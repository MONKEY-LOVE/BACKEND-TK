import { pool } from "../libs/db.js";
import { json } from "express";
import bcrypt from 'bcrypt'

 const User = {

    getAll: async()=>{
        try{
           const result = await pool.query(`SELECT * FROM usuarios`) 
           return result;
        }
        catch(err){
  
            return err;
        }
    },
    getById:async(id)=>{
        try{
            const result = await pool.query(`SELECT * FROM usuarios WHERE id=$1`,[id]) 
            return result.rows[0];
        }
        catch(err){
  
            return err;
        }
    },
    getByEmail:async(correo)=>{
      try{
          const result = await pool.query(`SELECT * FROM usuarios WHERE correo =$1`,[correo]) 
          return result.rows[0];
      }
      catch(err){

          return err;
      }
  },
  create: async (data) => {
    const { nombre, apellido_pat, apellido_mat, run, usuario, correo, contrasena, id_profesor } = data;
    try {
        let password = contrasena;
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
        const result = await pool.query(
            `INSERT INTO usuarios(nombre, apellido_pat, apellido_mat, run, usuario, correo, contrasena, id_profesor) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
            [nombre, apellido_pat, apellido_mat, run, usuario, correo, password, id_profesor]
        );

        if (result.rowCount > 0) {
            return result.rows[0].id;
        }
    } catch (err) {
        return err;
    }
},
    comparePassword: async(contrasena, id)=>
      {        
        try{
        
          const usuario  = await User.getById(id)      
          if (!usuario) {
            throw new Error('Usuario no encontrado'); // Maneja el caso en que no se encuentre el usuario
        }
        const hash = usuario.contrasena;
          return await bcrypt.compare(contrasena, hash)
        }catch(err){

          return err;
        }
      }
    ,
     update : async (data, id) => {
        const { nombre, apellido_pat, apellido_mat, run, usuario, correo, contrasena } = data;
        const updateFields = [];
        const values = [];
      
        if (nombre) {
          updateFields.push('nombre = $1');
          values.push(nombre);
        }
      
        if (apellido_pat) {
          updateFields.push('apellido_pat = $2');
          values.push(apellido_pat);
        }
      
        if (apellido_mat) {
          updateFields.push('apellido_mat = $3');
          values.push(apellido_mat);
        }
      
        if (run) {
          updateFields.push('run = $4');
          values.push(run);
        }
      
        if (usuario) {
          updateFields.push('usuario = $5');
          values.push(usuario);
        }
      
        if (correo) {
          updateFields.push('correo = $6');
          values.push(correo);
        }
      
        if (contrasena) {
          updateFields.push('contrasena = $7');
          values.push(contrasena);
        }
      
        try {
          if (updateFields.length === 0) {
            throw new Error('No se ha proporcionado ningún campo para actualizar');
          }
      
          const query = `
            UPDATE usuarios
            SET ${updateFields.join(', ')}
            WHERE id = $${values.length + 1}
          `;
      
          const result = await pool.query(query, [...values, id]);
      
          if (result.rowCount > 0) {
            // rowCount indica el número de filas afectadas
            return { success: true, message: 'Actualización exitosa' };
          } else {
            throw new Error('No se ha actualizado ningún registro');
          }
        } catch (err) {
          return { success: false, message: err.message };
        }
      }
      ,
      delete: async (id) => {
        try {
          const result_access = await pool.query(`DELETE FROM roles_usuarios WHERE id_user = $1`, [id]);
          if (result_access.rowCount > 0) {
          const result = await pool.query(`DELETE FROM usuarios WHERE id = $1`, [id]);
      
          if (result.rowCount > 0) {
            // Si rowCount es mayor que 0, indica que se eliminó al menos una fila
            return { success: true, message: 'Eliminación exitosa' };
          } else {
            throw new Error('No se eliminó ningún registro');
          }}
          else{
            throw new Error('No se pudo eliminar ningún registro');
          }
        } catch (err) {
          return { success: false, message: err.message };
        }
      }
      



}

export default User;