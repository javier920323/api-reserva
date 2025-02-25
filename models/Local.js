// models/Local.js
const mongoose = require("mongoose"); // Importar mongoose para definir el esquema

// Definir el esquema del modelo Local
const localSchema = new mongoose.Schema({
  nombre: String, // Nombre del local
  cupo: Number, // Capacidad máxima de reservas
});

// Exportar el modelo Local
module.exports = mongoose.model("Local", localSchema);
