import { pool } from "../libs/db.js";
import { json } from "express";

 const Role = {

    getAll: async()=>{
        try{
           const result = await pool.query(`SELECT * FROM roles`) 
          return result;
        }
        catch(err){
            return err;
        }
    },
    getById:async(id)=>{
        try{
            const result = await pool.query(`SELECT * FROM roles WHERE id=$1`,[id]) 
            return result.rows[0]
        }
        catch(err){
            return err;
        }
    },
    getByName:async(nombre)=>{
      try{
          const result = await pool.query(`SELECT * FROM roles WHERE nombre=$1`,[nombre]) 
          return result.rows[0]
      }
      catch(err){
          return err;
      }
  },
    create: async(data)=>{
        const {nombre} = data
        try{
            const result = await pool.query(`INSERT INTO roles(nombre) VALUES ($1)`,[nombre]);
            if(result){
                return json({message:'el usuario fue creado correctamente'})
            }
        }
        catch(err){
            return err;
        }
    },
     update : async (data, id) => {
        const { nombre} = data;
        const updateFields = [];
        const values = [];
      
        if (nombre) {
          updateFields.push('nombre = $1');
          values.push(nombre);
        }
      
        try {
          if (updateFields.length === 0) {
            throw new Error('No se ha proporcionado ningún campo para actualizar');
          }
      
          const query = `
            UPDATE roles
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
          const result = await pool.query(`DELETE FROM roles WHERE id = $1`, [id]);
      
          if (result.rowCount > 0) {
            // Si rowCount es mayor que 0, indica que se eliminó al menos una fila
            return { success: true, message: 'Eliminación exitosa' };
          } else {
            throw new Error('No se eliminó ningún registro');
          }
        } catch (err) {
          return { success: false, message: err.message };
        }
      }
      



}

export default Role;