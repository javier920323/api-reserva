// models/Reserva.js
const mongoose = require("mongoose"); // Importar mongoose para definir el esquema

// Definir el esquema del modelo Reserva
const reservaSchema = new mongoose.Schema({
  local_id: { type: mongoose.Schema.Types.ObjectId, ref: "Local" }, // Referencia al local
  fecha: String, // Fecha de la reserva
});

// Exportar el modelo Reserva
module.exports = mongoose.model("Reserva", reservaSchema);
