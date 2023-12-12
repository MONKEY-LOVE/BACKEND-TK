
// Importar el modelo de Token
const Token = require('../models/token');

// Obtener todos los tokens activos
const getActiveTokens = async (req, res) => {
  try {
    const tokens = await Token.find({ estado: 'activo' });
    res.json(tokens);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los tokens activos' });
  }
};

// Crear un nuevo token
const createToken = async (req, res) => {
  const { nombre } = req.body;

  try {
    // Verificar si ya existe un token activo con el mismo nombre
    const existingToken = await Token.findOne({ nombre, estado: 'activo' });
    if (existingToken) {
      return res.status(400).json({ error: 'Ya existe un token activo con el mismo nombre' });
    }

    // Crear el nuevo token
    const newToken = new Token({ nombre });
    await newToken.save();

    res.status(201).json(newToken);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el token' });
  }
};

module.exports = {
  getActiveTokens,
  createToken,
};
