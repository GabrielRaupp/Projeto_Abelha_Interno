async function fetchData() {
    try {
        const response = await fetch('http://localhost:3000/api/telemetria');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) throw new Error("Dados no formato incorreto ou array vazio.");

        const getDataBySensorId = (sensorId, key) => data
            .filter(item => item.sensor_id === sensorId)
            .map(item => {
                const [day, month, year] = item.data.split('/');
                const [hour, minute, second] = item.horario.split(':');
                const formattedDate = new Date(year, month - 1, day, hour, minute, second);

                return {
                    x: formattedDate.getTime() / 1000,
                    y: item[key],
                    time: formattedDate.toLocaleString('pt-BR', {
                        year: 'numeric', month: '2-digit', day: '2-digit',
                        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
                    })
                };
            });

        const lastDisplayedValues = {};
        const createTooltip = () => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.style.position = 'absolute';
            tooltip.style.pointerEvents = 'none';
            tooltip.style.display = 'none';
            document.body.appendChild(tooltip);
            return tooltip;
        };

        const tooltip = createTooltip();

        function drawLineChart(containerId, title, seriesData, unit) {
            const labels = seriesData.map(point => new Date(point.x * 1000).toLocaleTimeString());
            const values = seriesData.map(point => point.y);

            new Chartist.Line(containerId, {
                labels: labels,
                series: [values]
            }, {
                high: Math.max(...values) + 5,
                low: Math.min(...values) - 5,
                showArea: true,
                fullWidth: true,
                axisY: { title: title },
                axisX: { title: 'Horário' }
            });

            const lastValue = values[values.length - 1];
            const valueDisplay = document.querySelector(`${containerId} + p`);
            if (lastDisplayedValues[containerId] !== lastValue) {
                lastDisplayedValues[containerId] = lastValue;
                if (valueDisplay) {
                    valueDisplay.innerText = `Último Valor: ${lastValue} ${unit}`;
                    valueDisplay.className = 'last-value';
                } else {
                    const newValueDisplay = document.createElement('p');
                    newValueDisplay.innerText = `Último Valor: ${lastValue} ${unit}`;
                    newValueDisplay.className = 'last-value';
                    document.querySelector(containerId).parentNode.appendChild(newValueDisplay);
                }
            }

            const titleElement = document.createElement('h3');
            titleElement.innerText = title;
            const container = document.querySelector(containerId).parentNode;
            if (!container.querySelector('h3')) container.insertBefore(titleElement, document.querySelector(containerId));

            const chartElement = document.querySelector(containerId);
            chartElement.addEventListener('mousemove', (event) => {
                const pointIndex = Math.floor((event.offsetX / chartElement.offsetWidth) * seriesData.length);
                if (pointIndex >= 0 && pointIndex < seriesData.length) {
                    const point = seriesData[pointIndex];
                    tooltip.innerText = `Valor: ${point.y} ${unit}\nData: ${point.time}`;
                    tooltip.style.left = `${event.pageX + 10}px`;
                    tooltip.style.top = `${event.pageY + 10}px`;
                    tooltip.style.display = 'block';
                }
            });

            chartElement.addEventListener('mouseleave', () => {
                tooltip.style.display = 'none';
            });
        }

        drawLineChart('#graficoAmbienteTemp', 'Temperatura', getDataBySensorId('7', 'temperatura'), '°C');
        drawLineChart('#graficoAmbienteUmid', 'Umidade', getDataBySensorId('7', 'umidade'), '%');
        drawLineChart('#graficoAmbientePressao', 'Pressão', getDataBySensorId('7', 'pressao'), 'hPa');

        drawLineChart('#graficoCaixa9Temp', 'Temperatura', getDataBySensorId('4', 'temperatura'), '°C');
        drawLineChart('#graficoCaixa9Umid', 'Umidade', getDataBySensorId('4', 'umidade'), '%');
        drawLineChart('#graficoCaixa9Pressao', 'Pressão', getDataBySensorId('4', 'pressao'), 'hPa');

        drawLineChart('#graficoCaixa10Temp', 'Temperatura', getDataBySensorId('5', 'temperatura'), '°C');
        drawLineChart('#graficoCaixa10Umid', 'Umidade', getDataBySensorId('5', 'umidade'), '%');
        drawLineChart('#graficoCaixa10Pressao', 'Pressão', getDataBySensorId('5', 'pressao'), 'hPa');

        drawLineChart('#graficoCaixa12Temp', 'Temperatura', getDataBySensorId('6', 'temperatura'), '°C');
        drawLineChart('#graficoCaixa12Umid', 'Umidade', getDataBySensorId('6', 'umidade'), '%');
        drawLineChart('#graficoCaixa12Pressao', 'Pressão', getDataBySensorId('6', 'pressao'), 'hPa');

 

    } catch (error) {
        console.error('Erro ao carregar os dados:', error);
        document.querySelector('.graphs-area').innerHTML = `<p>Erro ao carregar os dados: ${error.message}</p>`;
    }
}

setInterval(fetchData, 60000);
document.addEventListener('DOMContentLoaded', fetchData);
