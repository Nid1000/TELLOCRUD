document.addEventListener('DOMContentLoaded', async () => {
    const menuCategorias = document.getElementById('menu-categorias');
    const listaProductos = document.getElementById('lista-productos');
    // Cargar categorías
    const categorias = await getCategorias();
    categorias.forEach(cat => {
        const li = document.createElement('li');
        li.className = 'nav-item';
        li.innerHTML = `<a class="nav-link" href="#" data-id="${cat.id}">${cat.nombre}</a>`;
        menuCategorias.appendChild(li);
    });

    // Cargar productos iniciales
    cargarProductos();

    // Filtrar por categoría
    menuCategorias.addEventListener('click', async (e) => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            const categoriaId = e.target.getAttribute('data-id');
            cargarProductos(categoriaId);
        }
    });

    async function cargarProductos(categoriaId = null) {
        listaProductos.innerHTML = '';
        let productos = categoriaId ? await getProductosPorCategoria(categoriaId) : await getProductos();

        for (let prod of productos) {
            const imagenes = await getImagenes(prod.id);
            const imagenUrl = imagenes.length > 0 ? imagenes[0].url : 'https://via.placeholder.com/200';

            const div = document.createElement('div');
            div.className = 'col-md-4 mb-4';
            div.innerHTML = `
                <div class="card h-100">
                    <img src="${imagenUrl}" class="card-img-top" alt="${prod.nombre}">
                    <div class="card-body">
                        <h5 class="card-title">${prod.nombre}</h5>
                          <p class="card-text">${prod.descripcion}</p>
                        <p class="card-text">Precio: $${prod.precio}</p>
                        <a href="detalle.html?id=${prod.id}" class="btn btn-primary">Ver Detalle</a>
                    </div>
                </div>
                
            `;
            
            listaProductos.appendChild(div);
            
        }
        app.use(express.static(path.join(__dirname, 'public')));

    }
    const imagenUrl = imagenes.length > 0 
    ? `http://localhost:3000/uploads/${imagenes[0].url}`
    : 'https://via.placeholder.com/200';

    
});
