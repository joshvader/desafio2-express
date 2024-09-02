require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname)); // Servir archivos estáticos como index.html y posibles assets como CSS o imágenes

// Ruta principal para servir el archivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para obtener todas las canciones
app.get('/canciones', (req, res) => {
    fs.readFile('repertorio.json', 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Error al leer el archivo' });
        res.json(JSON.parse(data));
    });
});

// Ruta para agregar una nueva canción
app.post('/canciones', (req, res) => {
    const newCancion = req.body;

    fs.readFile('repertorio.json', 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Error al leer el archivo' });

        let repertorio = JSON.parse(data);
        repertorio.push(newCancion);

        fs.writeFile('repertorio.json', JSON.stringify(repertorio), (err) => {
            if (err) return res.status(500).json({ error: 'Error al escribir en el archivo' });
            res.json({ mensaje: 'Canción agregada exitosamente' });
        });
    });
});

// Ruta para editar una canción
app.put("/canciones/:id", (req, res) => {
    const id = String(req.params.id);
    const cancionActualizada = req.body; 
    let newCancion = JSON.parse(fs.readFileSync("repertorio.json")); 

    // Buscamos la canción
    const index = newCancion.findIndex(c => c.id === id);
    
    if (index !== -1) {
        newCancion[index] = cancionActualizada;
        fs.writeFileSync("repertorio.json", JSON.stringify(newCancion, null, 2)); 
        res.send(`Canción con ID ${id} actualizada.`);
    } else {
        res.status(404).send("Canción no encontrada.");
    }
});

// Ruta para eliminar una canción
app.delete("/canciones/:id", (req, res) => {
    const { id } = req.params
    const repertorio = JSON.parse(fs.readFileSync("repertorio.json"))
    const index = repertorio.findIndex(p => p.id == id)
    repertorio.splice(index, 1)
    fs.writeFileSync("repertorio.json", JSON.stringify(repertorio))
    res.send("Canción eliminada con éxito")
    })

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
