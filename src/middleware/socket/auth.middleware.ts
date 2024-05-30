import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

const secretJWT = process.env.JWT as string;

export const verifyJWT = (socket: Socket, next: (err?: any) => void) => {
    try {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error('Authentication error'));
        }

        jwt.verify(token, secretJWT, (err, decode) => {
            if (err) {
                return next(err);
            }

            socket.data.user = decode;
            next();
        });
    } catch (error) {
        next(error);
    }
};
