import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Usuario from '../models/user.model';

const secret = process.env.JWT as string;

export const login = async (req: Request, res: Response) => {
    try {
        const { usuario, contraseña } = req.body; // Extraer usuario y contraseña del cuerpo de la solicitud

const usuarioObj = new Usuario({ usuario, contraseña }); 


        const credencialesValidas = await usuarioObj.verificarUsuario();

        if (!credencialesValidas) {
            return res.status(400).json({
                message: 'Usuario o contraseña incorrectos',
            });
        }

        const contraseñaCorrecta = bcrypt.compareSync(contraseña, usuarioObj.contraseña);

        if (!contraseñaCorrecta) {
            return res.status(400).json({
                message: 'Usuario o contraseña incorrectos',
            });
        }

        const payload = {
            usuario: {
                id: usuarioObj.id,
            },
        };

        const token = jwt.sign(payload, secret, { expiresIn: '1h' });

        return res.status(200).json({
            message: 'El acceso fue correcto',
            token,
        });
    } catch (error: any) {
        return res.status(500).json({
            message: 'Ocurrió un error al validar las credenciales',
            error: error.message,
        });
    }
};
