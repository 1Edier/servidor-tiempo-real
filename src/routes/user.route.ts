// src/routes/user.route.ts
import { Router } from 'express';
import { create } from '../controllers/usuario.controller';
import { login } from '../controllers/auth.controller';

const usuarioRouter = Router();

usuarioRouter.post('/registro', create);
usuarioRouter.post('/login', login);

export default usuarioRouter;
