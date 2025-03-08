import {Router} from "express";
import {check} from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { tieneRole } from "../middlewares/validar-role.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { getCategories, updateCategory, addCategory, deleteCategory } from "./category.controller.js";
import { existeCategoryById } from "../helpers/db-validator.js";

const router = Router();

router.get("/", getCategories)

router.post(
    '/',
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
    ],
    addCategory
)

router.put(
    "/:id",
    [
        validarJWT,
        check("id", "No es un id valido").isMongoId(),
        check("id").custom(existeCategoryById),
        tieneRole("ADMIN_ROLE"),
        validarCampos
    ],
    updateCategory
)

router.delete(
    "/:id",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id", "No es un id valido").isMongoId(),
        check("id").custom(existeCategoryById),
        tieneRole("ADMIN_ROLE"),
        validarCampos
    ],
    deleteCategory
)

export default router;