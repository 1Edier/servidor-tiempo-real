import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Usuario from '../models/user.model';

const saltosBcrypt = parseInt(process.env.SALTOS_BCRYPT as string);

export const create = async (req: Request, res: Response): Promise<Response> => {
    try {
        const usuario = new Usuario({
            usuario: req.body.usuario,
            contraseña: bcrypt.hashSync(req.body.contraseña, saltosBcrypt)
        });

        await usuario.guardarUsuarios();

        return res.status(200).json({
            message: 'usuario creado exitosamente'
        });
    } catch (error:any) {
        return res.status(500).json({
            message: 'ocurrio un error al crear el usuario',
            error: error.message
        });
    }
};
