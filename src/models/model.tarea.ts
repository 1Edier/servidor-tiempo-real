import {createConnection} from '../configs/db.config';
import { RowDataPacket } from 'mysql2';
interface ITarea {
    id?: number;
    tarea: string;
    descripcion: string;
    responsable: string;
}

class Tarea implements ITarea {
    id?: number;
    tarea: string;
    descripcion: string;
    responsable: string;

    constructor({ id, tarea, descripcion, responsable }: ITarea) {
        this.id = id;
        this.tarea = tarea;
        this.descripcion = descripcion;
        this.responsable = responsable;
    }

    static async getTareas(): Promise<RowDataPacket[]> {
        const connection = await createConnection();
        const [rows] = await connection.execute('SELECT * FROM tareas');
        return rows as RowDataPacket[];
    }

    async guardarTarea() {
        const connection = await createConnection();

        try {
            const [result]: any = await connection.execute('INSERT INTO tareas (tarea, descripcion, responsable) VALUES (?, ?, ?)', [this.tarea, this.descripcion, this.responsable]);

            if (result.insertId === 0) {
                throw new Error('No se insertó la tarea');
            }

            this.id = result.insertId;

            return this.id;
        } finally {
            connection.end();
        }
    }
}

export default Tarea;
