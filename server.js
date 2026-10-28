const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let productos = [
  { id: 1, nombre: 'Café con leche', precio: 1800, categoria: 'bebida' },
  { id: 2, nombre: 'Medialuna', precio: 900, categoria: 'comida' },
  { id: 3, nombre: 'Tostado de jamón y queso', precio: 3500, categoria: 'comida' },
  { id: 4, nombre: 'Agua mineral', precio: 1200, categoria: 'bebida' }
];

app.get('/', (req, res) => {
  res.send('¡Bienvenido a la API de la Cafetería del CRUI!');
});

app.get('/api/productos', (req, res) => {
  res.json(productos);
});

app.get('/api/productos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const producto = productos.find(p => p.id === id);

  if (!producto) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  res.json(producto);
});

app.post('/api/productos', (req, res) => {
  const { nombre, precio, categoria } = req.body;

  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '' || 
      typeof precio !== 'number' || precio <= 0) {
    return res.status(400).json({ 
      error: 'Datos inválidos. El nombre es obligatorio y el precio debe ser un número mayor a cero.' 
    });
  }

  const nuevoId = productos.length > 0 ? productos[productos.length - 1].id + 1 : 1;

  const nuevoProducto = {
    id: nuevoId,
    nombre: nombre.trim(),
    precio,
    categoria: categoria || 'general'
  };

  productos.push(nuevoProducto);
  res.status(201).json(nuevoProducto);
});

app.put('/api/productos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const producto = productos.find(p => p.id === id);

  if (!producto) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  const { nombre, precio, categoria } = req.body;

  if (nombre !== undefined && (typeof nombre !== 'string' || nombre.trim() === '')) {
    return res.status(400).json({ error: 'El nombre no puede estar vacío.' });
  }

  if (precio !== undefined && (typeof precio !== 'number' || precio <= 0)) {
    return res.status(400).json({ error: 'El precio debe ser un número mayor a cero.' });
  }

  if (nombre !== undefined) producto.nombre = nombre.trim();
  if (precio !== undefined) producto.precio = precio;
  if (categoria !== undefined) producto.categoria = categoria;

  res.json(producto);
});

app.delete('/api/productos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = productos.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  const productoEliminado = productos.splice(index, 1);
  res.json({ 
    mensaje: 'Producto eliminado correctamente', 
    producto: productoEliminado[0] 
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});