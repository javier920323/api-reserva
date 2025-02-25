// routes/reservas.js
const express = require("express"); // Importar Express para manejar rutas
const router = express.Router(); // Crear el enrutador de Express
const Reserva = require("../models/Reserva"); // Importar el modelo Reserva
const Local = require("../models/Local"); // Importar el modelo Local

// Endpoint para obtener reservas de un local en una fecha específica
router.get("/:local_id/:fecha", async (req, res) => {
  const { local_id, fecha } = req.params; // Extraer los parámetros de la URL
  const reservas = await Reserva.find({ local_id, fecha }); // Buscar reservas en la BD
  const local = await Local.findById(local_id); // Obtener información del local
  const cupos_disponibles = local.capacidad_maxima - reservas.length; // Calcular cupos disponibles
  res.json({ cupos_disponibles, reservas }); // Responder con los datos
});

// Endpoint para crear una reserva si hay cupos disponibles
router.post("/", async (req, res) => {
  const { local_id, fecha } = req.body; // Extraer datos del cuerpo de la petición
  const reservas = await Reserva.find({ local_id, fecha }); // Consultar reservas existentes
  const local = await Local.findById(local_id); // Obtener información del local

  if (reservas.length < local.capacidad_maxima) {
    // Verificar si hay cupos disponibles
    const nuevaReserva = new Reserva({ local_id, fecha }); // Crear nueva reserva
    await nuevaReserva.save(); // Guardar en la BD
    return res.status(201).json(nuevaReserva); // Responder con la reserva creada
  } else {
    return res.status(400).json({ error: "No hay cupos disponibles" }); // Responder con error si no hay cupos
  }
});

// Exportar el enrutador
module.exports = router;
