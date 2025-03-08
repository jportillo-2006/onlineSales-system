import User from "../users/user.model.js";
import Role from "../role/role.model.js";

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, password, ...rest } = req.body;
        const userAuth = req.usuario;

        if (userAuth.role.toString() !== "ADMIN_ROLE" && userAuth.id !== id) {
            return res.status(403).json({ msg: "No tienes permisos para editar este usuario." });
        }

        if (role) {
            const newRole = await Role.findById(role);
            if (!newRole) {
                return res.status(400).json({ msg: "Rol no válido." });
            }
            if (userAuth.role.toString() !== "ADMIN_ROLE" && newRole.role === "ADMIN_ROLE") {
                return res.status(403).json({ msg: "No puedes asignarte el rol ADMIN_ROLE." });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(id, rest, { new: true });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor", error });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { confirm } = req.body;
        const userAuth = req.usuario;

        if (userAuth.role.toString() === "USER_ROLE" && userAuth.id !== id) {
            return res.status(403).json({ msg: "No puedes eliminar a otro usuario." });
        }

        if (confirm !== true) {
            return res.status(400).json({ msg: "Debes confirmar la eliminación del usuario." });
        }

        await User.findByIdAndDelete(id);
        res.json({ msg: "Usuario eliminado correctamente." });
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor", error });
    }
};