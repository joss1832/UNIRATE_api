window.onload = () => {
    const monedas_lista = document.querySelector('#monedas_lista_base');//apuntamos al primer select
    const monedas_convertir = document.querySelector('#convertir');//apuntamos al segundo
    const resultado = document.querySelector('#resultado');//apuntamos al div donde pondre la informacion
    const url = 'https://api.unirateapi.com/api/rates?api_key=nAsFv7NeVgjbM6seeNtReE4fyxEzJhi32d1FIpYAw9iq23tI3TJGzE2pimBfPVY0&';
    cantidad_input = document.querySelector('#cantidad');//apuntamos al select de la cantidad

    let tasas = {}; // aquí se guardarán las tasas de cambio
    let monedasArray = [];//monedas disponibles

    fetch(url)//hacemos la consulta a la api
        .then((response) => response.json())//la convertimos a json
        .then((data) => {//imprimimos la data en consola
            console.log('datos recibidos', data);
            tasas = data.rates;//obtenemos los valores de las monedas
            monedasArray = Object.keys(tasas); // obtenemos las monedas disponibles
            monedasArray.sort(); // ordena alfabéticamente
            cargarMonedas(monedasArray);//llenamos los selects con las monedas
        });

    function cargarMonedas(listaMonedas) {
        // Limpiar selects antes de cargar
        monedas_lista.innerHTML = '';
        monedas_convertir.innerHTML = '';
        
        listaMonedas.forEach(moneda => {//recorremos todas las monedas
            let moneda_base = document.createElement('option');//creamos los elementos
            let moneda_conversion = document.createElement('option');

            //asignamos valor y texto a cada opcion y se los metemos a los selects
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
            quitar_moneda();//evitamos que al seleccionar una moneda esta siga apareciendo en la otra lista
        }
    }

    function quitar_moneda() {
        const base_seleccion = monedas_lista.value;
        
        // Guardamos la selección actual del selector de conversión
        const seleccionActual = monedas_convertir.value;
        
        // Limpiamos el selector de conversión
        monedas_convertir.innerHTML = '';
        
        // Agregamos todas las monedas excepto la moneda base al segundo selec
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
    //cuando cambio la moneda base, se actualiza el otro select y volvemos a calcular el resultado
    monedas_lista.addEventListener('change', () => {
        quitar_moneda();
        mostrarResultado();
    });

    monedas_convertir.addEventListener('change', mostrarResultado);
    cantidad_input.addEventListener('input', mostrarResultado);

    //obtenemos las monedas seleccionadas y convertimos la cantidad ingresada
    function mostrarResultado() {
        const base = monedas_lista.value;
        const destino = monedas_convertir.value;
        const cantidad = parseFloat(cantidad_input.value);

        //verificamos que los datops sean validos
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
