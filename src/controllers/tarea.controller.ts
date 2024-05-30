import { Request, Response } from 'express';
import Tarea from '../models/model.tarea';
import { sendPushNotification, enviarTareas } from '../socket/utils/util';

export const crearTarea = async (req: Request, res: Response): Promise<Response> => {
    const { tarea, descripcion, responsable } = req.body;

    const tareas = new Tarea({
        tarea: tarea,
        descripcion: descripcion,
        responsable: responsable,
    });

    try {
        await tareas.guardarTarea();
        sendPushNotification('Nueva tarea agregada');
        enviarTareas();

        return res.status(201).json({
            success: true,
            message: 'Se creó la tarea',
        });
    } catch (error:any) {
        return res.status(500).json({
            success: false,
            message: 'Ocurrió un error al crear la tarea',
            error: error.message,
        });
    }
};
