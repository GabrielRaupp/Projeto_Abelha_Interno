// Função para criar o tooltip
function createTooltip() {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    Object.assign(tooltip.style, {
        position: 'absolute',
        pointerEvents: 'none',
        display: 'none',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '5px',
        borderRadius: '4px',
        zIndex: '1000',
    });
    document.body.appendChild(tooltip);
    return tooltip;
}

// Função para exibir o último valor
function displayLastValue(containerId, values, unit) {
    if (!values || values.length === 0) return;

    const lastValue = values[values.length - 1];
    const container = document.querySelector(containerId)?.parentNode;

    if (!container) return;

    let valueDisplay = container.querySelector('.last-value');
    if (!valueDisplay) {
        valueDisplay = document.createElement('p');
        valueDisplay.className = 'last-value';
        container.appendChild(valueDisplay);
    }
    valueDisplay.innerText = `Último Valor: ${lastValue} ${unit}`;
}

// Função para exibir o título
function displayTitle(containerId, title) {
    const container = document.querySelector(containerId)?.parentNode;
    if (!container) return;

    if (!container.querySelector('h3')) {
        const titleElement = document.createElement('h3');
        titleElement.innerText = title;
        container.insertBefore(titleElement, container.firstChild);
    }
}

// Função para baixar os dados do gráfico como CSV
function downloadDataAsCSV(data, title) {
    if (!data || data.length === 0) {
        alert('Nenhum dado disponível para download.');
        return;
    }

    const currentDate = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const csvContent = `data:text/csv;charset=utf-8,` +
        `Gráfico Baixado: ${title}\n` +
        `Data da Geração: ${currentDate}\n\n` +
        `Data,Horário,Valor\n` +
        data.map(item => {
            const formattedDate = new Date(item.x * 1000);
            const date = formattedDate.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
            const time = formattedDate.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' });
            return `${date},${time},${item.y}`;
        }).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${title}_dados.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Função para desenhar o gráfico
function drawLineChart(containerId, title, seriesData, unit) {
    const container = document.querySelector(containerId);
    if (!container) return;

    if (!seriesData || seriesData.length === 0) {
        container.innerHTML = `<p>Sem dados para exibir.</p>`;
        return;
    }

    const labels = seriesData.map(point => new Date(point.x * 1000).toLocaleDateString('pt-BR'));
    const values = seriesData.map(point => point.y);

    const chart = new Chartist.Line(containerId, {
        labels: labels,
        series: [values]
    }, {
        high: Math.max(...values) + 5,
        low: Math.min(...values) - 5,
        showArea: true,
        fullWidth: true,
        axisY: { labelInterpolationFnc: value => `${value} ${unit}` },
        axisX: { showLabel: false, showGrid: false },
    });

    displayLastValue(containerId, values, unit);
    displayTitle(containerId, title);

    const tooltip = createTooltip();
    const chartElement = document.querySelector(containerId);

    chartElement.addEventListener('mousemove', (event) => {
        const pointIndex = Math.floor((event.offsetX / chartElement.offsetWidth) * seriesData.length);
        if (pointIndex >= 0 && pointIndex < seriesData.length) {
            const point = seriesData[pointIndex];
            tooltip.innerText = `Valor: ${point.y} ${unit}\nData: ${point.time}`;
            Object.assign(tooltip.style, {
                left: `${event.pageX + 10}px`,
                top: `${event.pageY + 10}px`,
                display: 'block',
            });
        }
    });

    chartElement.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
    });

    const existingButton = chartElement.parentNode.querySelector('.download-button');
    if (existingButton) {
        existingButton.remove();
    }

    const downloadButton = document.createElement('button');
    downloadButton.innerText = 'Baixar Dados';
    downloadButton.className = 'download-button';
    downloadButton.addEventListener('click', () => downloadDataAsCSV(seriesData, title));
    chartElement.parentNode.appendChild(downloadButton);
}

// Função para buscar e filtrar dados
async function fetchData(selectedDate) {
    try {
        const response = await fetch('/api/telemetria');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        const startOfDay = new Date(`${selectedDate}T00:00:00Z`);
        const endOfDay = new Date(`${selectedDate}T23:59:59Z`);

        const filteredData = data.filter(item => {
            const date = new Date(item.data);
            return date >= startOfDay && date <= endOfDay;
        });

        const getDataBySensorId = (sensorId, key) => filteredData
            .filter(item => item.sensor_id === sensorId)
            .map(item => ({
                x: new Date(item.data).getTime() / 1000,
                y: item[key],
                time: `${new Date(item.data).toLocaleDateString('pt-BR')} ${item.horario}`,
            }));

        drawChartsForAllSensors(getDataBySensorId);
    } catch (error) {
        console.error('Erro ao carregar os dados:', error);
        document.querySelector('.graphs-area').innerHTML = `<p>Erro ao carregar os dados: ${error.message}</p>`;
    }
}

// Função para desenhar gráficos para todos os sensores
function drawChartsForAllSensors(getDataBySensorId) {
    const sensorMappings = [
        { container: '#graficoAmbienteTemp', title: 'Temperatura', sensor: '7', key: 'temperatura', unit: '°C' },
        { container: '#graficoAmbienteUmid', title: 'Umidade', sensor: '7', key: 'umidade', unit: '%' },
        { container: '#graficoAmbientePressao', title: 'Pressão', sensor: '7', key: 'pressao', unit: 'hPa' },

        { container: '#graficoCaixa9Temp', title: 'Temperatura', sensor: '4', key: 'temperatura', unit: '°C' },
        { container: '#graficoCaixa9Umid', title: 'Umidade', sensor: '4', key: 'umidade', unit: '%' },
        { container: '#graficoCaixa9Pressao', title: 'Pressão', sensor: '4', key: 'pressao', unit: 'hPa' },

        { container: '#graficoCaixa10Temp', title: 'Temperatura', sensor: '5', key: 'temperatura', unit: '°C' },
        { container: '#graficoCaixa10Umid', title: 'Umidade', sensor: '5', key: 'umidade', unit: '%' },
        { container: '#graficoCaixa10Pressao', title: 'Pressão', sensor: '5', key: 'pressao', unit: 'hPa' },

        { container: '#graficoCaixa12Temp', title: 'Temperatura', sensor: '6', key: 'temperatura', unit: '°C' },
        { container: '#graficoCaixa12Umid', title: 'Umidade', sensor: '6', key: 'umidade', unit: '%' },
        { container: '#graficoCaixa12Pressao', title: 'Pressão', sensor: '6', key: 'pressao', unit: 'hPa' },
    ];

    sensorMappings.forEach(mapping => {
        const data = getDataBySensorId(mapping.sensor, mapping.key);
        drawLineChart(mapping.container, mapping.title, data, mapping.unit);
    });
}

// Configuração inicial
document.addEventListener('DOMContentLoaded', () => {
    const dateSelectorContainer = document.createElement('div');
    dateSelectorContainer.className = 'date-selector-container';

    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.id = 'dateInput';
    dateInput.className = 'date-input';

    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;

    const button = document.createElement('button');
    button.id = 'updateCharts';
    button.innerText = 'Atualizar';
    button.addEventListener('click', () => fetchData(dateInput.value));

    dateSelectorContainer.append(dateInput, button);
    document.querySelector('.graphs-area').prepend(dateSelectorContainer);

    fetchData(today);
});
