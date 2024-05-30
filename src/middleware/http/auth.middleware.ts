import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
    usuario?: string | object;
}

const secretJWT = process.env.JWT as string;

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.get('Authorization');

    if (!token) {
        return res.status(401).json({
            message: 'Token no proporcionado'
        });
    }

    jwt.verify(token, secretJWT, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                message: 'Hubo un error al validar el token',
                error: err.message
            });
        }

        req.usuario = decoded;
        next();
    });
};
