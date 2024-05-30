import { Request, Response } from 'express';
import Tarea from '../models/model.tarea';
import Comentarios from '../models/model.comentario';

// Short polling
export const getList = async (req: Request, res: Response) => {
    try {
        const tarea = await Tarea.getTareas();

        return res.status(200).json({
            message: 'Se obtuvo la lista de las tareas',
            tarea
        });
    } catch (error: any) {
        return res.status(500).json({
            message: 'hubo un error al obtener la lista de tareas',
            error: error.message
        });
    }
};

export const getidtareas = async (req: Request, res: Response) => {
    const tarea = await Tarea.getTareas();
    const ultimaTarea = parseInt(req.query.idTarea as string, 10);
    const nuevasTareas = tarea.filter(tarea => tarea.id > ultimaTarea);

    return res.status(200).json({
        success: true,
        tareas: nuevasTareas
    });
};

// Long polling
let resComentarios: Response[] = [];
export const getComentarios = async (req: Request, res: Response) => {
    try {
        const comentario = await Comentarios.getComentarios();

        return res.status(200).json({
            message: 'Se obtuvieron los comentarios correctamente',
            comentario
        });
    } catch (error: any) {
        return res.status(500).json({
            message: 'Hubo un error al obtener los comentarios',
            error: error.message
        });
    }
};

export const getnuevoComentario = async (req: Request, res: Response) => {
    resComentarios.push(res);

    req.on('close', () => {
        const index = resComentarios.indexOf(res);
        if (index !== -1) {
            resComentarios.splice(index, 1);
        }
    });
};

export const crearComentario = async (req: Request, res: Response) => {
    const nuevoComentario = req.body.comentario;

    const comentario = new Comentarios({
        comentario: nuevoComentario
    });

    try {
        await comentario.guardarComentarios();

        responderComentarios(comentario);

        res.status(201).json({
            success: true,
            message: "comentario creado"
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Ocurrió un error al guardar el comentario",
            error: error.message
        });
    }
};

function responderComentarios(comentario: Comentarios) {
    for (const res of resComentarios) {
        res.status(200).json({
            success: true,
            comentario
        });
    }
    resComentarios = [];
}
