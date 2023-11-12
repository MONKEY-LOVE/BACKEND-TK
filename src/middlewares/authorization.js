import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import Role from '../models/role.js';
import RoleUsuario from '../models/rolesUsuario.js';

config();

export const validadorToken = async (req, res, next) => {
    try{
        const token = req.cookies.token
    
        if(!token) return res.status(403).json({message:'No token provided'})
    
       const decoded = jwt.verify(token, process.env.SECRET)
        req.id = decoded.id
    
        console.log(decoded)
       const user = await User.getById(req.id)
       if(!user) return res.status(404).json({message:'usuario no existe'})
    
        next()
       }catch(error){
        return res.status(401).json({message:'Unauthorized'})
       }
};
export const isProfesor = async(req,res,next)=>{
   const user = await User.getById(req.id)
   const filter = 'profesor'
   const idRol = await Role.getByName(filter)
   const validateProfesor = await RoleUsuario.getByUserRoles( user.id, idRol.id)
   if(validateProfesor){
      next();
      return;
   };
   return res.status(403).json({message:'require profesor role'})
}

export const isModerator = async(req,res,next)=>{
    const user = await User.getById(req.id)
    const filter = 'moderator'
    const idRol = await Role.getByName(filter)
    const validateModerator = await RoleUsuario.getByUserRoles( user.id, idRol.id)
    if(validateModerator){
       next();
       return;
    };
    return res.status(403).json({message:'require moderator role'})
 }
 export const isAdmin = async(req,res,next)=>{
    const user = await User.getById(req.id)
    const filter = 'admin'
    const idRol = await Role.getByName(filter)
    const validateAdmin = await RoleUsuario.getByUserRoles( user.id, idRol.id)
    if(validateAdmin){
       next();
       return;
    };
    return res.status(403).json({message:'require admin role'})
 }