require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

// Importar el modelo Local
const Local = require("./models/Local");

// Conectar a MongoDB y poblar la base de datos con locales iniciales
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("MongoDB conectado");
  })
  .catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

// Importar rutas de locales y reservas
const localesRoutes = require("./routes/locales");
const reservasRoutes = require("./routes/reservas");

// Definir las rutas para los diferentes recursos
app.use("/api/locales", localesRoutes); // Rutas relacionadas con locales
app.use("/api/reservas", reservasRoutes); // Rutas relacionadas con reservas

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
