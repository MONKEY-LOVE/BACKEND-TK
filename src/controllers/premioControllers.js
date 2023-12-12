// controllers/premioController.js
import { pool, query } from '../libs/db';

export const asignarPremio = async (req, res) => {
  try {
    const { idUsuario, idPremio } = req.body;

    // Insertar el premio en la tabla premio_disponible
    const result = await query(
      'INSERT INTO premio_disponible (id_user, premio_id, estado) VALUES ($1, $2, $3) RETURNING *',
      [idUsuario, idPremio, false]
    );

    res.status(201).json({ mensaje: 'Premio asignado correctamente', premio: result.rows[0] });
  } catch (error) {
    console.error('Error al asignar premio:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
