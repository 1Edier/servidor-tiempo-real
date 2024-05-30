import express from 'express';
import { getList, getidtareas, getComentarios, getnuevoComentario, crearComentario } from '../controllers/controller.short';
import { crearTarea } from '../controllers/tarea.controller';

const router = express.Router();

router.get('/obtener-lista', getList);
router.get('/actualizar', getidtareas);
router.get('/comentarios', getComentarios);
router.post('/crear-comentario', crearComentario);
router.get('/nuevo-comentario', getnuevoComentario);
router.post('/crear-tarea', crearTarea);

export default router;
