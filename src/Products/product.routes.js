import {Router} from "express";
import {check} from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { tieneRole } from "../middlewares/validar-roles.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { addProduct, getProducts, getProductById, updateProduct, deleteProduct, getProductByName } from "./product.controller.js";
import { existeProductById } from "../helpers/db-validator.js";

const router = Router();

router.get("/", getProducts)

router.post(
    '/',
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
    ],
    addProduct
)

router.get(
    "/:id",
    [
        validarJWT,
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(existeProductById),
        validarCampos
    ],
    getProductById
)

router.get(
    "/:name",
    [
        validarJWT,
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(existeProductById),
        validarCampos
    ],
    getProductByName
)

router.put(
    "/:id",
    [
        validarJWT,
        check("id", "No es un id valido").isMongoId(),
        check("id").custom(existeProductById),
        tieneRole("ADMIN_ROLE"),
        validarCampos
    ],
    updateProduct
)

router.delete(
    "/:id",
    [
        validarJWT,
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id", "No es un id valido").isMongoId(),
        check("id").custom(existeProductById),
        tieneRole("ADMIN_ROLE"),
        validarCampos
    ],
    deleteProduct
)

export default router;