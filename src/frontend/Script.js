// Função para criar o tooltip
function createTooltip() {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.style.position = 'absolute';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.display = 'none';
    tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    tooltip.style.color = 'white';
    tooltip.style.padding = '5px';
    tooltip.style.borderRadius = '4px';
    document.body.appendChild(tooltip);
    return tooltip;
}

// Função para exibir o último valor
function displayLastValue(containerId, values, unit) {
    const lastValue = values[values.length - 1];
    const valueDisplay = document.querySelector(`${containerId} + p`);
    if (valueDisplay) {
        valueDisplay.innerText = `Último Valor: ${lastValue} ${unit}`;
        valueDisplay.classList.add('last-value');
    } else {
        const newValueDisplay = document.createElement('p');
        newValueDisplay.innerText = `Último Valor: ${lastValue} ${unit}`;
        newValueDisplay.className = 'last-value';
        document.querySelector(containerId).parentNode.appendChild(newValueDisplay);
    }
}

// Função para exibir o título
function displayTitle(containerId, title) {
    const container = document.querySelector(containerId).parentNode;
    if (!container.querySelector('h3')) {
        const titleElement = document.createElement('h3');
        titleElement.innerText = title;
        container.insertBefore(titleElement, document.querySelector(containerId));
    }
}

// Função para baixar os dados do gráfico como CSV
function downloadDataAsCSV(data, title) {
    const csvContent = `data:text/csv;charset=utf-8,` + 
        `Data,Valor\n` + 
        data.map(item => `${item.time},${item.y}`).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${title}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Função para desenhar o gráfico de linha com tooltip e botão de download
function drawLineChart(containerId, title, seriesData, unit) {
    if (seriesData.length === 0) {
        document.querySelector(containerId).innerHTML = `<p>Sem dados para exibir.</p>`;
        return;
    }

    const labels = seriesData.map(point => new Date(point.x * 1000).toLocaleDateString());
    const values = seriesData.map(point => point.y);

    new Chartist.Line(containerId, {
        labels: labels,
        series: [values]
    }, {
        high: Math.max(...values) + 5,
        low: Math.min(...values) - 5,
        showArea: true,
        fullWidth: true,
        axisY: {
            labelInterpolationFnc: value => `${value} ${unit}`,
            labelClass: 'y-axis-label'
        },
        axisX: { showLabel: false, showGrid: false }
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
            tooltip.style.left = `${event.pageX + 10}px`;
            tooltip.style.top = `${event.pageY + 10}px`;
            tooltip.style.display = 'block';
        }
    });

    chartElement.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
    });

    // Remover o botão de download anterior, se existir
    const existingButton = chartElement.parentNode.querySelector('.download-button');
    if (existingButton) {
        existingButton.remove();
    }

    // Adiciona o botão de download
    const downloadButton = document.createElement('button');
    downloadButton.innerText = 'Baixar Dados';
    downloadButton.className = 'download-button';
    downloadButton.addEventListener('click', () => downloadDataAsCSV(seriesData, title));
    chartElement.parentNode.appendChild(downloadButton);
}

// Função para desenhar gráficos para todos os sensores
function drawChartsForAllSensors(getDataBySensorId) {
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
}

// Função para buscar e filtrar dados
async function fetchData(selectedDate = today) {
    try {
        const response = await fetch('/api/telemetria');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) throw new Error("Dados no formato incorreto ou array vazio.");

        const startOfDay = new Date(`${selectedDate}T00:00:00Z`);
        const endOfDay = new Date(`${selectedDate}T23:59:59Z`);

        const filteredData = data.filter(item => {
            const date = new Date(item.data);
            return date >= startOfDay && date <= endOfDay;
        });

        const getDataBySensorId = (sensorId, key) => {
            return filteredData
                .filter(item => item.sensor_id === sensorId)
                .map(item => ({
                    x: new Date(item.data).getTime() / 1000,
                    y: item[key],
                    time: `${new Date(item.data).toLocaleDateString('pt-BR')} ${item.horario}`
                }));
        };

        drawChartsForAllSensors(getDataBySensorId);
    } catch (error) {
        console.error('Erro ao carregar os dados:', error);
        document.querySelector('.graphs-area').innerHTML = `<p>Erro ao carregar os dados: ${error.message}</p>`;
    }
}

// Função de seleção de data
function selectDate() {
    const dateInput = document.getElementById('dateInput').value;
    const minDate = "2024-08-29";

    if (dateInput < minDate) {
        alert("Por favor, selecione uma data a partir de 2024-08-29.");
        return;
    }

    fetchData(dateInput);
}

// Configuração inicial do seletor de data
const dateSelectorContainer = document.createElement('div');
dateSelectorContainer.className = 'date-selector-container';
dateSelectorContainer.innerHTML = `<label for="dateInput" class="date-label">Selecione a Data:</label>`;

const dateSelector = document.createElement('input');
dateSelector.type = 'date';
dateSelector.id = 'dateInput';
dateSelector.min = "2024-08-29";
dateSelector.className = 'date-input';

const today = new Date().toISOString().split('T')[0];
dateSelector.value = today;
dateSelector.addEventListener('change', selectDate);

dateSelectorContainer.appendChild(dateSelector);
document.body.prepend(dateSelectorContainer);

// Atualiza os gráficos a cada 3 minutos
setInterval(() => fetchData(), 600000);

// Carrega os dados inicialmente quando a página é carregada
document.addEventListener('DOMContentLoaded', () => fetchData());
