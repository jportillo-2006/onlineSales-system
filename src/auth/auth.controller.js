import User from '../users/user.model.js';
import { hash, verify } from 'argon2';
import { generarJWT } from '../helpers/generate-jwt.js';
import Role from '../role/role.model.js'

export const register = async (req, res) => {
    try {
        const { name, surname, username, email, password, phone, role } = req.body;

        let roleFound;
        if (!role) {
            roleFound = await Role.findOne({ role: 'USER_ROLE' });
        } else {
            roleFound = await Role.findOne({ role: role });
        }

        if (!roleFound) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const encryptedPassword = await hash(password);

        const user = await User.create({
            name,
            surname,
            username,
            email,
            phone,
            password: encryptedPassword,
            role: roleFound._id,
        });

        return res.status(201).json({
            message: "User registraod",
            userDetails: {
                user: user.email
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "User no registrado, error",
            error: error.message
        });
    }
};

export const login = async (req, res) => {

    const { email, password, username } = req.body;

    try {

        const user = await User.findOne({
            $or: [{ email }, { username }]
        });

        if(!user){
            return res.status(400).json({
                msg: 'Credenciales incorrectas'
            });
        }

        if(!user.estado){
            return res.status(400).json({
                msg: 'El usuario no existe en la base de datos'
            });
        }

        const validPassword = await verify(user.password, password);
        
        if(!validPassword){
            return res.status(400).json({
                msg: 'La contraseña es incorrecta'
            });
        }

        const token = await generarJWT( user.id );

        return res.status(200).json({
            msg: 'Inicio de sesión exitoso',
            userDetails: {
                username: user.username,
                token: token,
            }
        })

    } catch (e) {
        
        console.log(e);

        return res.status(500).json({
            message: "Server error",
            error: e.message
        })
    }
}