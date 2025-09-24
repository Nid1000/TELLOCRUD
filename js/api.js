const API_URL = 'http://localhost:3000';

// Obtener todas las categorías
async function getCategorias() {
    const res = await fetch(`${API_URL}/categorias`);
    return res.json();
}

// Obtener todos los productos
async function getProductos() {
    const res = await fetch(`${API_URL}/productos`);
    return res.json();
}

// Obtener productos por categoría
async function getProductosPorCategoria(categoriaId) {
    const res = await fetch(`${API_URL}/productos?categoria_id=${categoriaId}`);
    return res.json();
}

// Obtener imágenes de un producto
async function getImagenes(productoId) {
    const res = await fetch(`${API_URL}/imagenes/${productoId}`);
    return res.json();
}
fetch(`${API_URL}/productos?categoria_id=${categoriaId}`)
async function crearProducto() {
  const nuevoProducto = {
    nombre: "   MUÑECAS",
    precio: 4200,
    categoria_id: 3,
    imagenes: [
      "https://example.com/muñeca1.jpg",
      "https://example.com/muñeca2.jpg"
    ]
  };

  const res = await fetch("http://localhost:3000/productos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevoProducto)
  });

  const data = await res.json();
  console.log("Producto creado:", data);
}
