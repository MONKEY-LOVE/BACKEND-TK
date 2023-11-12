import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import Role from '../models/role.js';
import RoleUsuario from '../models/rolesUsuario.js';

config();

export const signUp = async (req, res, next) => {
    try {
        const { body } = req;

        const newUser = await User.create(body);

        if (body.roles) {
            for (const role of body.roles) {
                const idRole = await Role.getByName(role);
                console.log('custom',idRole.id, newUser)
                const id = idRole.id
                const data = {id_rol: id, id_user: newUser}
                await RoleUsuario.create(data);
            }
        } else {
            const porDef = 'user';
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
            return res.status(400).json({ message: 'Usuario inválido' });
        }

        const matchPassword = await User.comparePassword(contrasena, buscarUser.id);
        if (!matchPassword) {
            return res.status(401).json({ token: null, message: 'Contraseña inválida' });
        }

        const token = jwt.sign({id: buscarUser.id, usuario:buscarUser.usuario}, process.env.SECRET,{
            expiresIn: 86400
        })
        // Generar token y enviarlo (necesitas implementar la lógica para generar el token)
        res.cookie("token", token);
        res.json({ token: token});
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