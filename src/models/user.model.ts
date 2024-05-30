import {createConnection} from '../configs/db.config';

interface IUsuario {
    id?: number;
    usuario: string;
    contraseña: string;
}

class Usuario implements IUsuario {
    id?: number;
    usuario: string;
    contraseña: string;

    constructor({ id, usuario, contraseña }: IUsuario) {
        this.id = id;
        this.usuario = usuario;
        this.contraseña = contraseña;
    }

    async verificarUsuario() {
        const connection = await createConnection();

        try {
            const [rows]: any = await connection.execute('SELECT * FROM usuarios WHERE nombre_usuario = ?', [this.usuario]);

            if (rows.length === 0) {
                return false;
            }

            const { id, nombre_usuario, contraseña } = rows[0];
            this.id = id;
            this.usuario = nombre_usuario;
            this.contraseña = contraseña;

            return true;
        } finally {
            connection.end();
        }
    }

    async guardarUsuarios() {
        const connection = await createConnection();

        try {
            const [result]: any = await connection.execute('INSERT INTO usuarios (nombre_usuario, contraseña) VALUES (?, ?)', [this.usuario, this.contraseña]);

            if (result.insertId === 0) {
                throw new Error('No se inserto el usuario');
            }

            this.id = result.insertId;

            return this.id;
        } finally {
            connection.end();
        }
    }
}

export default Usuario;
