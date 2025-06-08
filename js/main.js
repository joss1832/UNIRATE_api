window.onload = () => {
    const monedas_lista = document.querySelector('#monedas_lista');
    const monedas_convertir = document.querySelector('#convertir');
    const resultado = document.querySelector('#resultado');
    const url = 'https://api.unirateapi.com/api/rates?api_key=nAsFv7NeVgjbM6seeNtReE4fyxEzJhi32d1FIpYAw9iq23tI3TJGzE2pimBfPVY0&';

    let tasas = {}; // aquí se guardarán las tasas de cambio

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            console.log('datos recibidos', data);
            tasas = data.rates;
            const monedasArray = Object.keys(tasas); // obtenemos las monedas disponibles
            monedasArray.sort(); // ordena alfabéticamente
            cargarMonedas(monedasArray);
        });

    function cargarMonedas(listaMonedas) {
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
    }

    // Escuchar cuando el usuario selecciona una moneda base y una a convertir
    monedas_lista.addEventListener('change', mostrarResultado);
    monedas_convertir.addEventListener('change', mostrarResultado);

    function mostrarResultado() {
        const base = monedas_lista.value;
        const destino = monedas_convertir.value;

        if (base && destino && tasas[base] && tasas[destino]) {
            const tasaBase = tasas[base];
            const tasaDestino = tasas[destino];

            const conversion = tasaDestino / tasaBase;

            resultado.innerHTML = `
                <p>1 ${base} equivale a ${conversion.toFixed(4)} ${destino}</p>
            `;
        } else {
            resultado.innerHTML = '';
        }
    }
}
