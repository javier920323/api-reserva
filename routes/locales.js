// routes/locales.js
const express = require("express"); // Importar Express para manejar rutas
const router = express.Router(); // Crear el enrutador de Express
const Local = require("../models/Local"); // Importar el modelo Local

// Endpoint para obtener la lista de locales
router.get("/", async (req, res) => {
  const locales = await Local.find().select("nombre cupo -_id"); // Obtener todos los locales de la BD
  res.json(locales); // Enviar la lista en formato JSON
});

// Endpoint para crear un nuevo local
router.post("/", async (req, res) => {
  const { nombre, cupo } = req.body; // Extraer datos del cuerpo de la petición
  const nuevoLocal = new Local({ nombre, cupo }); // Crear una nueva instancia de Local
  await nuevoLocal.save(); // Guardar en la base de datos
  res.status(201).json(nuevoLocal); // Responder con el local creado
});

// Exportar el enrutador
module.exports = router;
