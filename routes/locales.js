// routes/locales.js
const express = require("express"); // Importar Express para manejar rutas
const router = express.Router(); // Crear el enrutador de Express
const Local = require("../models/Local"); // Importar el modelo Local
const authMiddleware = require("../middlewares/authMiddleware");

// Endpoint para obtener la lista de locales
router.get("/", async (req, res) => {
  const locales = await Local.find().select("_id nombre cupo "); // Obtener todos los locales de la BD
  res.json(locales); // Enviar la lista en formato JSON
});

// Endpoint para crear un nuevo local
router.post("/", authMiddleware, async (req, res) => {
  if (req.usuario.rol !== "admin") {
    return res.status(403).json({ error: "Acceso denegado. Se requiere rol de administrador." });
  }

  const { nombre, cupo } = req.body; // Extraer datos del cuerpo de la petición
  const nuevoLocal = new Local({ nombre, cupo }); // Crear una nueva instancia de Local
  await nuevoLocal.save(); // Guardar en la base de datos
  res.status(201).json(nuevoLocal); // Responder con el local creado
});
// Endpoint para actualizar un local
router.put("/", authMiddleware, async (req, res) => {
  try {
    if (req.usuario.rol !== "admin") {
      return res.status(403).json({ error: "Acceso denegado. Se requiere rol de administrador." });
    }
    const { id, nombre, cupo } = req.body;

    // Validar que los datos sean correctos
    if (!nombre || !cupo || typeof cupo !== "number" || cupo <= 0) {
      return res.status(400).json({ error: "Datos inválidos" });
    }

    // Verificar si el local existe
    const local = await Local.findById(id);
    if (!local) {
      return res.status(404).json({ error: "Local no encontrado" });
    }

    // Verificar si otro local ya tiene el mismo nombre
    const existeLocal = await Local.findOne({ nombre: nombre.trim(), _id: { $ne: id } });
    if (existeLocal) {
      return res.status(400).json({ error: "Ya existe otro local con este nombre" });
    }

    // Actualizar el local
    local.nombre = nombre.trim();
    local.cupo = cupo;
    await local.save();

    res.json(local);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el local" });
  }
});


// Exportar el enrutador
module.exports = router;
