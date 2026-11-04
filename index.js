const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());

let usuarios = [];
let nextId = 1;

// POST - Crear usuario
   app.post('/api/usuarios', (req, res) => {
       const { nombre, email, edad } = req.body;
       
       if (!nombre || !email || !edad) {
           return res.status(400).json({ success: false, message: "Faltan campos requeridos" });
       }

       // NUEVA VALIDACIÓN: Verificar si el email ya existe
       const usuarioExistente = usuarios.find(u => u.email === email);
       if (usuarioExistente) {
           return res.status(409).json({ 
               success: false, 
               message: "El correo electrónico ya está registrado" 
           });
       }

       const nuevoUsuario = { id: nextId++, nombre, email, edad };
       usuarios.push(nuevoUsuario);
       res.status(201).json({ success: true, message: "Usuario creado exitosamente", data: nuevoUsuario });
   });

// DELETE - Eliminar usuario
app.delete('/api/usuarios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = usuarios.findIndex(u => u.id === id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }
    usuarios.splice(index, 1);
    res.status(200).json({ success: true, message: "Usuario eliminado exitosamente" });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

   // GET - Listar todos los usuarios
   app.get('/api/usuarios', (req, res) => {
       res.status(200).json({
           success: true,
           data: usuarios
       });
   });

      // PUT - Actualizar usuario
   app.put('/api/usuarios/:id', (req, res) => {
       const id = parseInt(req.params.id);
       const { nombre, email, edad } = req.body;
       
       const index = usuarios.findIndex(u => u.id === id);
       
       if (index === -1) {
           return res.status(404).json({ success: false, message: "Usuario no encontrado" });
       }

       // Actualizamos los datos (mantenemos el ID original)
       usuarios[index] = { 
           id: id, 
           nombre: nombre || usuarios[index].nombre, 
           email: email || usuarios[index].email, 
           edad: edad || usuarios[index].edad 
       };

       res.status(200).json({
           success: true,
           message: "Usuario actualizado exitosamente",
           data: usuarios[index]
       });
   });