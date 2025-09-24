window.editProd = async (id) => {
    const res = await fetch(`${API}/productos/${id}`);
    if (!res.ok) { alert('Error al cargar producto'); return; }
    const p = await res.json();
  
    // Rellenar formulario
    document.getElementById('nombreProducto').value = p.nombre;
    document.getElementById('precioProducto').value = p.precio;
    document.getElementById('categoriaProducto').value = p.categoriaId;
    document.getElementById('descripcionProducto').value = p.descripcion;
  
    // Cambiar botón guardar para actualizar
    const form = document.getElementById('form-producto');
    form.onsubmit = async (e) => {
      e.preventDefault();
      const body = {
        nombre: document.getElementById('nombreProducto').value,
        precio: parseFloat(document.getElementById('precioProducto').value),
        categoriaId: document.getElementById('categoriaProducto').value,
        descripcion: document.getElementById('descripcionProducto').value
      };
      const r = await authFetch(`${API}/productos/${id}`, {
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!r.ok) { alert('Error actualizando producto'); return; }
      form.reset();
      await cargarProductos();
      await llenarSelects();
  
      // Restaurar submit original para crear productos nuevos
      form.onsubmit = async (e) => {
        e.preventDefault();
        const body = {
          nombre: document.getElementById('nombreProducto').value,
          precio: parseFloat(document.getElementById('precioProducto').value),
          categoriaId: document.getElementById('categoriaProducto').value,
          descripcion: document.getElementById('descripcionProducto').value
        };
        const r = await authFetch(`${API}/productos`, {
          method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(body)
        });
        if (!r.ok){ alert('Error guardando producto'); return; }
        e.target.reset();
        await cargarProductos(); await llenarSelects();
      };
    };
  };
  