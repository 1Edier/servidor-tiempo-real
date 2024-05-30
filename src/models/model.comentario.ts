import {createConnection} from '../configs/db.config';

interface IComentario {
    id?: number;
    comentario: string;
}

class Comentario implements IComentario {
    id?: number;
    comentario: string;

    constructor({ id, comentario }: IComentario) {
        this.id = id;
        this.comentario = comentario;
    }

    static async getComentarios() {
        const connection = await createConnection();

        const [rows] = await connection.execute('SELECT * FROM comentarios');
        return rows;
    }

    async guardarComentarios() {
        const connection = await createConnection();

        const [result]: any = await connection.execute('INSERT INTO comentarios (comentario) VALUES (?)', [this.comentario]);
        connection.end();

        if (result.insertId === 0) {
            throw new Error('No se insertó el comentario');
        }

        this.id = result.insertId;
        return this.id;
    }
}

export default Comentario;
