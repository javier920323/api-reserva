const express = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Endpoint para registrar un usuario
router.post("/registro", async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Crear el nuevo usuario
    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: passwordHash,
      rol: rol || "usuario", // Si no envían rol, se asigna "usuario" por defecto
    });

    // Guardar en la base de datos
    await nuevoUsuario.save();

    res.status(201).json({ mensaje: "Usuario registrado con éxito" });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar el usuario" });
  }
});


// Endpoint para iniciar sesión
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ error: "Usuario o contraseña incorrectos" });
    }

    // Verificar la contraseña
    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(400).json({ error: "Usuario o contraseña incorrectos" });
    }

    // Crear el token JWT
    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol }, // Datos que guardamos en el token
      process.env.JWT_SECRE, // Clave secreta (debería estar en una variable de entorno)
      { expiresIn: "2h" } // Duración del token
    );

    res.json({ mensaje: "Inicio de sesión exitoso", token, usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } });
  } catch (error) {
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

module.exports = router;
