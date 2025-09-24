document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const productoId = params.get('id');

    if (!productoId) {
        document.getElementById('detalle-producto').innerHTML = '<p>Producto no encontrado.</p>';
        return;
    }

    // Obtener datos del producto
    const productos = await getProductos(); // Se podría optimizar con una API específica
    const producto = productos.find(p => p.id == productoId);

    if (!producto) {
        document.getElementById('detalle-producto').innerHTML = '<p>Producto no encontrado.</p>';
        return;
    }

    // Obtener imágenes del producto
    const imagenes = await getImagenes(productoId);

    // Crear carrusel
    let carruselItems = '';
    imagenes.forEach((img, index) => {
        carruselItems += `
            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                <img src="${img.url}" class="d-block w-100" alt="Imagen ${index + 1}">
            </div>
        `;
    });

    const carruselHTML = `
        <div id="carouselProducto" class="carousel slide mb-4" data-bs-ride="carousel">
            <div class="carousel-inner">
                ${carruselItems || '<div class="text-center p-3">No hay imágenes disponibles</div>'}
            </div>
            ${imagenes.length > 1 ? `
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselProducto" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Anterior</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselProducto" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Siguiente</span>
            </button>
            ` : ''}
        </div>
    `;

    // Mostrar detalle
    document.getElementById('detalle-producto').innerHTML = `
        ${carruselHTML}
        <h2>${producto.nombre}</h2>
        <p><strong>Precio:</strong> $${producto.precio}</p>
        <p><strong>Descripción:</strong> ${producto.descripcion || 'Sin descripción'}</p>
    `;
});
