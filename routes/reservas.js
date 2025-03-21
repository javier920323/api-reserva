// routes/reservas.js
const express = require("express"); // Importar Express para manejar rutas
const router = express.Router(); // Crear el enrutador de Express
const Reserva = require("../models/Reserva"); // Importar el modelo Reserva
const Local = require("../models/Local"); // Importar el modelo Local
const authMiddleware = require("../middlewares/authMiddleware");

// Endpoint para obtener todas las reservas
router.get("/", authMiddleware, async (req, res) => {
  try {
    if (req.usuario.rol !== "admin") {
      return res.status(403).json({ error: "Acceso denegado. Se requiere rol de administrador." });
    }
    const reservas = await Reserva.find()
      .populate("user_id", "nombre")
      .populate("local_id", "nombre");
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener las reservas", error });
  }
});

// Obtener reservas de un usuario por su ID
router.get('/user/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const reservas = await Reserva.find({ user_id })
      .populate("local_id", "nombre");
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las reservas' });
  }
});

// Endpoint para obtener todas reservas de un local
router.get("/:local_id", authMiddleware, async (req, res) => {
  try {
    if (req.usuario.rol !== "admin") {
      return res.status(403).json({ error: "Acceso denegado. Se requiere rol de administrador." });
    }
    const { local_id } = req.params;
    // Verificar si el local existe
    const local = await Local.findById(local_id);
    if (!local) {
      return res.status(404).json({ error: "Local no encontrado" });
    }
    // Obtener todas las reservas del local, ordenadas por fecha
    const reservas = await Reserva.find({ local_id }).populate("user_id", "nombre").sort({ fecha: 1 });
    res.json({
      local: local.nombre,
      cupo_total: local.cupo,
      cupo_ocupado: reservas.length,
      reservas
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las reservas" });
  }
});

// Endpoint para crear una reserva si hay cupos disponibles
router.post("/", async (req, res) => {
  try {
    const { local_id, user_id, fecha } = req.body;

    // Verificar que el local exista
    const local = await Local.findById(local_id);
    if (!local) {
      return res.status(404).json({ error: "Local no encontrado" });
    }

    // Verificar disponibilidad de cupos
    if (local.cupo <= 0) {
      return res.status(400).json({ error: "No hay cupos disponibles para esta fecha" });
    }

    // Crear la nueva reserva
    const nuevaReserva = new Reserva({ local_id, user_id, fecha });
    await nuevaReserva.save();

    // Actualizar el cupo del local
    local.cupo -= 1;
    await local.save();

    res.status(201).json(nuevaReserva); // Responder con la nueva reserva creada
  } catch (error) {
    res.status(500).json({ error: "Error al crear la reserva" });
  }
});

// Endpoint modificar una reserva
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { local_id, fecha } = req.body;

    // Verificar si la reserva existe
    const reserva = await Reserva.findById(id);
    if (!reserva) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    // Verificar si el local existe
    const local = await Local.findById(local_id);
    if (!local) {
      return res.status(404).json({ error: "Local no encontrado" });
    }

    // Actualizar la reserva con la nueva fecha
    reserva.fecha = fecha;
    await reserva.save();

    res.json(reserva); // Responder con la reserva actualizada
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la reserva" });
  }
});


// Exportar el enrutador
module.exports = router;
