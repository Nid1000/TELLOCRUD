document.addEventListener('DOMContentLoaded', () => {
    cargarCategorias();
    cargarProductos();
    cargarImagenes();

    let editId = null; // null = crear, número = editar

    // ============================
    // Formulario Categoría
    // ============================
    document.getElementById('form-categoria').addEventListener('submit', async e => {
        e.preventDefault();
        const nombre = document.getElementById('nombreCategoria').value;

        await fetch('http://localhost:3000/categorias', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre })
        });

        document.getElementById('nombreCategoria').value = '';
        cargarCategorias();
    });

    // ============================
    // Formulario Producto
    // ============================
    document.getElementById('form-producto').addEventListener('submit', async e => {
        e.preventDefault();

        const nombre = document.getElementById('nombreProducto').value;
        const precio = document.getElementById('precioProducto').value;
        const categoria_id = document.getElementById('categoriaProducto').value;
        const descripcion = document.getElementById('descripcionProducto').value;

        if(editId) {
            // Actualizar producto existente
            await fetch(`http://localhost:3000/productos/${editId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, precio, categoria_id, descripcion })
            });
            editId = null; // Restaurar modo crear
        } else {
            // Crear nuevo producto
            await fetch('http://localhost:3000/productos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, precio, categoria_id, descripcion })
            });
        }

        e.target.reset();
        cargarProductos();
    });

    // ============================
    // Formulario Imagen
    // ============================
    document.getElementById('form-imagen').addEventListener('submit', async (e) => {
        e.preventDefault();
        const productoId = document.getElementById('productoImagen').value;
        const archivo = document.getElementById('archivoImagen').files[0];

        const formData = new FormData();
        formData.append("imagen", archivo); 
        formData.append("productoId", productoId);

        try {
            const res = await fetch('http://localhost:3000/imagenes', {
                method: 'POST',
                body: formData
            });
            if (!res.ok) throw new Error('Error al guardar la imagen');
            alert('Imagen registrada');
            document.getElementById('form-imagen').reset();
            cargarImagenes();
        } catch (err) {
            console.error(err);
            alert('No se pudo guardar la imagen');
        }
    });
});

// ============================
// Funciones para cargar listas
// ============================
async function cargarCategorias() {
    const res = await fetch('http://localhost:3000/categorias');
    const categorias = await res.json();

    // Select en formulario de productos
    const selectCategoria = document.getElementById('categoriaProducto');
    selectCategoria.innerHTML = categorias.map(cat => `<option value="${cat.id}">${cat.nombre}</option>`).join('');

    // Lista visible
    document.getElementById('lista-categorias').innerHTML = `
        <h5>Categorías existentes:</h5>
        <ul class="list-group">
            ${categorias.map(cat => `<li class="list-group-item">${cat.nombre}</li>`).join('')}
        </ul>
    `;
}

async function cargarProductos() {
    const res = await fetch('http://localhost:3000/productos');
    const productos = await res.json();

    // Select en formulario de imágenes
    const selectProducto = document.getElementById('productoImagen');
    selectProducto.innerHTML = productos.map(prod => `<option value="${prod.id}">${prod.nombre}</option>`).join('');

    // Lista visible con botón Editar
    document.getElementById('lista-productos').innerHTML = `
        <h5>Productos existentes:</h5>
        <ul class="list-group">
            ${productos.map(prod => `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    ${prod.nombre} - $${prod.precio}
                    <button class="btn btn-sm btn-outline-secondary" onclick="editarProducto(${prod.id})">Editar</button>
                </li>
            `).join('')}
        </ul>
    `;
}

async function cargarImagenes() {
    const res = await fetch('http://localhost:3000/imagenes');
    const imagenes = await res.json();

    document.getElementById('lista-imagenes').innerHTML = `
        <h5>Imágenes registradas:</h5>
        <div class="row">
            ${imagenes.map(img => `
                <div class="col-md-3">
                    <div class="card mb-3">
                        <img src="${img.url}" class="card-img-top" alt="Imagen de producto">
                        <div class="card-body">
                            <p class="card-text">Producto ID: ${img.producto_id}</p>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// ============================
// Función para editar producto
// ============================
window.editarProducto = async (id) => {
    const res = await fetch(`http://localhost:3000/productos/${id}`);
    const prod = await res.json();

    document.getElementById('nombreProducto').value = prod.nombre;
    document.getElementById('precioProducto').value = prod.precio;
    document.getElementById('categoriaProducto').value = prod.categoria_id;
    document.getElementById('descripcionProducto').value = prod.descripcion;

    // Activar modo edición
    window.editId = id;
};
