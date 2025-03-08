import Role from './role.model.js';

export const initializeRoles = async () => {
    try {
        const existingRoles = await Role.find();

        if (existingRoles.length === 0) {
            await Role.insertMany([
                { role: "ADMIN_ROLE" },
                { role: "USER_ROLE" }
            ]);
            console.log("Roles creados correctamente");
        } else {
            console.log("Los roles ya existen en la base de datos");
        }
    } catch (error) {
        console.error("Error inicializando los roles:", error);
    }
};