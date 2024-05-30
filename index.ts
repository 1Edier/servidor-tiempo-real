// src/index.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import http from 'http';
import bodyParser from 'body-parser';
import { conectarWebsocket } from './src/socket/utils/util';
import tareaRouter from './src/routes/router.tarea';
import usuarioRouter from './src/routes/user.route';
import dotenv from 'dotenv';



const app = express();

// Parseo de cuerpos de solicitud JSON
app.use(bodyParser.json())
dotenv.config();


app.use(cors());
app.use(express.json());

const server = http.createServer(app);


app.use('/', tareaRouter);
app.use('/', usuarioRouter);

server.listen(3000, () => {
    console.log('Servidor iniciado en el puerto 3000');
});

conectarWebsocket();
