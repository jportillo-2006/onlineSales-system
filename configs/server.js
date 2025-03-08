'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import { initializeRoles } from "../src/role/initRoles.js";
import  authRoutes  from '../src/auth/auth.routes.js'
import userRoutes from '../src/users/user.routes.js'
import categoryRoutes from '../src/Category/category.routes.js'

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
}

const routes = (app) => {
    app.use("/onlineSalesSystem/v1/auth", authRoutes);
    app.use("/onlineSalesSystem/v1/users", userRoutes);
    app.use("/onlineSalesSystem/v1/categories", categoryRoutes);
}

const conectarDB = async () => {
    try{
        await dbConnection();
        console.log("Conexión a la base de datos exitosa");
        await initializeRoles();
    }catch(error){
        console.error('Error conectando a la base de datos', error);
        process.exit(1);
    }
}

export const iniciarServidor = async () => {
    const app = express();
    const port = process.env.PORT || 3000;

    try {
        middlewares(app);
        conectarDB();
        routes(app);
        app.listen(port);
        console.log(`Server running on port: ${port}`);
    } catch (err) {
        console.log(`Server init failed: ${err}`);
    }
}