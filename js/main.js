window.onload = () => {
    const monedas_lista = document.querySelector('#monedas_lista_base');
    const monedas_convertir = document.querySelector('#convertir');
    const resultado = document.querySelector('#resultado');
    const url = 'https://api.unirateapi.com/api/rates?api_key=nAsFv7NeVgjbM6seeNtReE4fyxEzJhi32d1FIpYAw9iq23tI3TJGzE2pimBfPVY0&';
    cantidad_input = document.querySelector('#cantidad');

    let tasas = {}; // aquí se guardarán las tasas de cambio
    let monedasArray = [];

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            console.log('datos recibidos', data);
            tasas = data.rates;
            monedasArray = Object.keys(tasas); // obtenemos las monedas disponibles
            monedasArray.sort(); // ordena alfabéticamente
            cargarMonedas(monedasArray);
        });

    function cargarMonedas(listaMonedas) {
        // Limpiar selects antes de cargar
        monedas_lista.innerHTML = '';
        monedas_convertir.innerHTML = '';
        
        listaMonedas.forEach(moneda => {
            let moneda_base = document.createElement('option');
            let moneda_conversion = document.createElement('option');

            moneda_base.value = moneda;
            moneda_conversion.value = moneda;

            moneda_base.textContent = moneda;
            moneda_conversion.textContent = moneda;

            monedas_lista.appendChild(moneda_base);
            monedas_convertir.appendChild(moneda_conversion);
        });

        // Establecer valores por defecto
        if (monedas_lista.options.length > 0) {
            monedas_lista.value = monedas_lista.options[0].value;
            quitar_moneda();
        }
    }

    function quitar_moneda() {
        const base_seleccion = monedas_lista.value;
        
        // Guardar la selección actual del selector de conversión
        const seleccionActual = monedas_convertir.value;
        
        // Limpiar el selector de conversión
        monedas_convertir.innerHTML = '';
        
        // Agregar todas las monedas excepto la moneda base base
        monedasArray.forEach(moneda => {
            if (moneda !== base_seleccion) {
                let opcion = document.createElement('option');
                opcion.value = moneda;
                opcion.textContent = moneda;
                monedas_convertir.appendChild(opcion);
            }
        });
        
        // Restaurar la selección anterior si todavía está disponible
        if (monedas_convertir.querySelector(`option[value="${seleccionActual}"]`) && seleccionActual !== base_seleccion) {
            monedas_convertir.value = seleccionActual;
        }
    }

    // Escuchar cuando el usuario selecciona una moneda base
    monedas_lista.addEventListener('change', () => {
        quitar_moneda();
        mostrarResultado();
    });

    monedas_convertir.addEventListener('change', mostrarResultado);
    cantidad_input.addEventListener('input', mostrarResultado);

    function mostrarResultado() {
        const base = monedas_lista.value;
        const destino = monedas_convertir.value;
        const cantidad = parseFloat(cantidad_input.value);

        if (base && destino && tasas[base] && tasas[destino] && !isNaN(cantidad)) {
            const tasaBase = tasas[base];
            const tasaDestino = tasas[destino];

            const conversion = (tasaDestino / tasaBase) * cantidad;

            resultado.innerHTML = `
                <p>${cantidad} ${base} equivale a ${conversion.toFixed(4)} ${destino}</p>
            `;
        } else {
            resultado.innerHTML = '';
        }
    }
}
