import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import Role from '../models/role.js';
import RoleUsuario from '../models/rolesUsuario.js';

config();

/**
 * Sign up a new user.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the sign up process is complete.
 * @throws {Error} - If an error occurs during the sign up process.
 */
export const signUp = async (req, res, next) => {
    try {
        const { body } = req;

        const newUser = await User.create(body);

        if (body.roles) {
            for (const role of body.roles) {
                const idRole = await Role.getByName(role);
                const id = idRole.id
                const data = {id_rol: id, id_user: newUser}
                console.log('roles',idRole.id, newUser)
                await RoleUsuario.create(data);
            }
        } else {
            const porDef = 'estudiante';
            const idRole = await Role.getByName(porDef);
            console.log('default',idRole.id, newUser)
            const id = idRole.id
            const data = {id_rol: id, id_user: newUser}
            await RoleUsuario.create(data);
        }

        const token = jwt.sign({id: newUser}, process.env.SECRET ,{
            expiresIn: 86400 //24 hrs
        });
    
        res.cookie("token", token);
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).send(err);
    }
};

export const signIn = async (req, res) => {
    const { correo, contrasena } = req.body;
    if (!correo || !contrasena) {
        return res.status(400).json({ message: 'Por favor ingresa correo y contraseña' });
    }
    try {
        const buscarUser = await User.getByEmail(correo);
        if (!buscarUser) {
            return res.status(400).json({ message: 'Usuario o Contraseña Incorrecta' });
        }
        const matchPassword = await User.comparePassword(contrasena, buscarUser.id);
        if (!matchPassword) {
            return res.status(401).json({ token: null, message: 'Usuario o Contraseña Incorrecta' });
        }
        const token = jwt.sign({id: buscarUser.id, usuario:buscarUser.usuario}, process.env.SECRET,{
            expiresIn: 86400
        })
        res.cookie("token", token, "role", buscarUser.roles);
        res.json({ token: token, role: buscarUser.roles});
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor' });
    }
};



export const verifyToken = async (req, res) =>{
    const { token } = req.cookies
    if (!token) return res.status(401).json({message: "No Autorizado"})
    jwt.verify(token, process.env.SECRET, async (err, usuario) =>{
        if (err) return res.status(401).json({ message: "No Autorizado"});
        const userFound = await User.getById(usuario.id)
        if(!userFound) return res.status(401).json({ message: "No Autorizado"})


    return res.json({
        id: userFound.id,
        nombre: userFound.nombre,
        apellido_pat: userFound.apellido_pat,
        apellido_mat: userFound.apellido_mat,
        usuario: userFound.usuario,
        correo: userFound.correo
    })
    })
}

export const getHistory = async (req, res) =>{
    const { token } = req.cookies
    if (!token) return res.status(401).json({message: "No Autorizado"})
    jwt.verify(token, process.env.SECRET, async (err, usuario) =>{
        if (err) return res.status(401).json({ message: "No Autorizado"});
        const userFound = await User.getById(usuario.id)
        if(!userFound) return res.status(401).json({ message: "No Autorizado"})
        const history = await User.getHistory(userFound.id)
        return res.json(history)
    }
    )
}
