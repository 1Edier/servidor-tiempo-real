import WebSocket from 'ws';
import http from 'http';
import Tarea from '../../models/model.tarea';

const server = http.createServer();
const wss = new WebSocket.Server({ port: 4000 });
const clients = new Set<WebSocket>();

let taskQueue: Tarea[] = [];

export function conectarWebsocket() {
    wss.on('connection', (ws, req) => {
        console.log('Nuevo cliente conectado con Websocket');

        clients.add(ws);

        // enviar el paquete cuando se reconecte 
        if (taskQueue.length > 0) {
            taskQueue.forEach((task) => {
                ws.send(JSON.stringify({
                    type: 'tareas',
                    tareas: [task]
                }));
            });
            taskQueue = [];
        }

        enviarTareas();

        ws.on('close', () => {
            console.log('Cliente desconectado Websocket');
            clients.delete(ws);
        });
    });
}

export function sendPushNotification(message: string) {
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'notification', message }));
        }
    });
}

export async function enviarTareas() {
    try {
        const rows = await Tarea.getTareas();
        const tareas: Tarea[] = rows.map(row => {
            const tareaData = row as Tarea;
            return new Tarea(tareaData);
        });

        if (wss.clients.size === 0) {
            taskQueue.push(tareas[tareas.length - 1]);
            console.log('Almacenando la tarea recién creada en el paquete buffer:', taskQueue);
            return;
        }

        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    type: 'tareas',
                    tareas: tareas
                }));
            }
        });
    } catch (error) {
        console.log('Hubo un error al obtener las tareas ', error);
    }
}
