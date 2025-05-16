function calcularResultados() {
    const form = document.getElementById('cocienteTricerebralForm');
    let sumSq = 0;
    let sumTr = 0;
    let sumCi = 0;

    // Sumar para la columna "cuadrado"
    form.querySelectorAll('input[name$="_sq"]:not(:disabled)').forEach(input => {
        const value = parseInt(input.value, 10);
        if (value >= 1 && value <= 5) { // Validar rango
            sumSq += value;
        } else if (input.value !== "") { // Si hay algo pero no es válido
            // Opcional: alertar o marcar el input
            console.warn(`Valor inválido en ${input.name}: ${input.value}`);
        }
    });

    // Sumar para la columna "triángulo"
    form.querySelectorAll('input[name$="_tr"]:not(:disabled)').forEach(input => {
        const value = parseInt(input.value, 10);
        if (value >= 1 && value <= 5) { // Validar rango
            sumTr += value;
        } else if (input.value !== "") {
            console.warn(`Valor inválido en ${input.name}: ${input.value}`);
        }
    });

    // Sumar para la columna "círculo"
    form.querySelectorAll('input[name$="_ci"]:not(:disabled)').forEach(input => {
        const value = parseInt(input.value, 10);
        if (value >= 1 && value <= 5) { // Validar rango
            sumCi += value;
        } else if (input.value !== "") {
            console.warn(`Valor inválido en ${input.name}: ${input.value}`);
        }
    });

    document.getElementById('sum_sq').textContent = sumSq;
    document.getElementById('sum_tr').textContent = sumTr;
    document.getElementById('sum_ci').textContent = sumCi;
}

// Opcional: Calcular dinámicamente mientras se escribe y se pierde el foco
// document.querySelectorAll('.score-input').forEach(input => {
//     input.addEventListener('change', calcularResultados); // 'change' es mejor que 'input' para type=number si no quieres recalcular a medio escribir
// });
let resultsChartInstance = null; // Variable global para guardar la instancia del gráfico

function calcularResultados() {
    const form = document.getElementById('cocienteTricerebralForm');
    let sumSq = 0;
    let sumTr = 0;
    let sumCi = 0;

    // Validar y sumar para la columna "cuadrado"
    form.querySelectorAll('input[name$="_sq"]:not(:disabled)').forEach(input => {
        const value = parseInt(input.value, 10);
        if (input.value === "") { // Si está vacío, no hacer nada y no contar como error
            return;
        }
        if (value >= 1 && value <= 5) {
            sumSq += value;
        } else {
            console.warn(`Valor inválido en ${input.name}: ${input.value}. No se sumará.`);
            // Opcional: Marcar el input o mostrar alerta
            // input.style.borderColor = 'red';
            // alert(`Valor inválido en la pregunta ${input.closest('tr').cells[0].textContent}. Debe ser entre 1 y 5.`);
            // input.value = ""; // Limpiar
        }
    });

    // Validar y sumar para la columna "triángulo"
    form.querySelectorAll('input[name$="_tr"]:not(:disabled)').forEach(input => {
        const value = parseInt(input.value, 10);
        if (input.value === "") {
            return;
        }
        if (value >= 1 && value <= 5) {
            sumTr += value;
        } else {
            console.warn(`Valor inválido en ${input.name}: ${input.value}. No se sumará.`);
        }
    });

    // Validar y sumar para la columna "círculo"
    form.querySelectorAll('input[name$="_ci"]:not(:disabled)').forEach(input => {
        const value = parseInt(input.value, 10);
        if (input.value === "") {
            return;
        }
        if (value >= 1 && value <= 5) {
            sumCi += value;
        } else {
            console.warn(`Valor inválido en ${input.name}: ${input.value}. No se sumará.`);
        }
    });

    document.getElementById('sum_sq').textContent = sumSq;
    document.getElementById('sum_tr').textContent = sumTr;
    document.getElementById('sum_ci').textContent = sumCi;

    // Actualizar o crear el gráfico de barras
    const ctx = document.getElementById('resultsChart').getContext('2d');
    const chartData = {
        labels: ['Cerebro Izquierdo (C.I)', 'Cerebro Central (C.C)', 'Cerebro Derecho (C.D)'],
        datasets: [{
            label: 'Puntuación por Cerebro',
            data: [sumSq, sumTr, sumCi],
            backgroundColor: [
                'rgba(255, 206, 86, 0.7)', // Amarillo para C.I (Cuadrado)
                'rgba(255, 99, 132, 0.7)',  // Rojo para C.C (Triángulo)
                'rgba(54, 162, 235, 0.7)'   // Azul para C.D (Círculo)
            ],
            borderColor: [
                'rgba(255, 206, 86, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1
        }]
    };

    const chartOptions = {
        scales: {
            y: {
                beginAtZero: true,
                suggestedMax: calcularMaximoY(sumSq, sumTr, sumCi) // Para un mejor escalado del eje Y
            }
        },
        responsive: true,
        maintainAspectRatio: false // Importante con el div contenedor
    };

    if (resultsChartInstance) {
        resultsChartInstance.data = chartData;
        resultsChartInstance.options = chartOptions; // Actualizar opciones también por si suggestedMax cambia
        resultsChartInstance.update();
    } else {
        resultsChartInstance = new Chart(ctx, {
            type: 'bar', // Gráfico de barras
            data: chartData,
            options: chartOptions
        });
    }
}

// Función auxiliar para calcular un buen máximo para el eje Y del gráfico
function calcularMaximoY(...valores) {
    const maxValor = Math.max(...valores);
    // Sugerir un máximo un poco por encima del valor más alto, en múltiplos de 5 o 10
    if (maxValor < 10) return 10;
    if (maxValor < 25) return 25;
    if (maxValor < 50) return 50;
    return Math.ceil(maxValor / 10) * 10 + 10; // Añade un poco de espacio arriba
}


// Opcional: Limpiar el resaltado de error cuando el usuario corrige el input
document.querySelectorAll('.score-input').forEach(input => {
    input.addEventListener('input', () => { // 'input' para reaccionar rápido al cambio
        // input.style.borderColor = ''; // Restablecer borde
        const value = parseInt(input.value, 10);
        const min = parseInt(input.min, 10);
        const max = parseInt(input.max, 10);

        if (input.value !== "" && (value < min || value > max || isNaN(value))) {
            input.style.borderColor = 'red'; // Marcar si está fuera de rango mientras escribe
        } else {
            input.style.borderColor = '#adb5bd'; // Color de borde original (o el que uses)
        }
    });
    // También podrías recalcular al cambiar el input, pero puede ser mucho si son muchos inputs
    // input.addEventListener('change', calcularResultados);
});
