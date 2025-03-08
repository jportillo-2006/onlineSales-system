import { Router } from 'express';
import { check } from 'express-validator';
import { updateUser, deleteUser } from './user.controller.js';
import { existeUsuarioById } from '../helpers/db-validator.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router();

router.put(
    '/:id',
    [
        validarJWT,
        check('id', 'No es un id válido.').isMongoId(),
        check('id').custom(existeUsuarioById),
        validarCampos 
    ],
    updateUser
)

router.delete(
    '/:id',
    [
        validarJWT,
        check('id', 'No es un id válido.').isMongoId(),
        check('id').custom(existeUsuarioById),
        validarCampos 
    ],
    deleteUser
)

export default router;