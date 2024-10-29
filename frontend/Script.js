async function fetchData() {
    try {
        const response = await fetch('http://localhost:3000/api/telemetria');
        const data = await response.json();

        // Função para mapear dados por sensor_id
        const getDataBySensorId = (sensorId, key) => {
            const sensorData = data.find(item => item.sensor_id === sensorId);
            return sensorData ? sensorData[key] : null;
        };

        // Conversão de data para um formato legível
        const labels = data.map(item => new Date(item.data).toLocaleDateString());

        // Função para criar gráfico
        function criarGrafico(ctx, label, data, borderColor) {
            return new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: label,
                        data: data,
                        borderColor: borderColor,
                        borderWidth: 1,
                        fill: false
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: false
                        }
                    }
                }
            });
        }

        // Obter os elementos do canvas
        const ctxCaixa9Temp = document.getElementById('graficoCaixa9Temp').getContext('2d');
        const ctxCaixa9Umid = document.getElementById('graficoCaixa9Umid').getContext('2d');
        const ctxCaixa9Pressao = document.getElementById('graficoCaixa9Pressao').getContext('2d');

        const ctxCaixa10Temp = document.getElementById('graficoCaixa10Temp').getContext('2d');
        const ctxCaixa10Umid = document.getElementById('graficoCaixa10Umid').getContext('2d');
        const ctxCaixa10Pressao = document.getElementById('graficoCaixa10Pressao').getContext('2d');

        const ctxCaixa12Temp = document.getElementById('graficoCaixa12Temp').getContext('2d');
        const ctxCaixa12Umid = document.getElementById('graficoCaixa12Umid').getContext('2d');
        const ctxCaixa12Pressao = document.getElementById('graficoCaixa12Pressao').getContext('2d');

        const ctxAmbienteTemp = document.getElementById('graficoAmbienteTemp').getContext('2d');
        const ctxAmbienteUmid = document.getElementById('graficoAmbienteUmid').getContext('2d');
        const ctxAmbientePressao = document.getElementById('graficoAmbientePressao').getContext('2d');

        // Criar gráficos com base nos IDs dos sensores
        criarGrafico(ctxCaixa9Temp, 'Temperatura Caixa 9', data.map(item => getDataBySensorId('4', 'temperatura')), 'rgba(255, 205, 86, 1)');
        criarGrafico(ctxCaixa9Umid, 'Umidade Caixa 9', data.map(item => getDataBySensorId('4', 'umidade')), 'rgba(54, 162, 235, 1)');
        criarGrafico(ctxCaixa9Pressao, 'Pressão Caixa 9', data.map(item => getDataBySensorId('4', 'pressao')), 'rgba(75, 192, 192, 1)');

        criarGrafico(ctxCaixa10Temp, 'Temperatura Caixa 10', data.map(item => getDataBySensorId('5', 'temperatura')), 'rgba(255, 159, 64, 1)');
        criarGrafico(ctxCaixa10Umid, 'Umidade Caixa 10', data.map(item => getDataBySensorId('5', 'umidade')), 'rgba(54, 162, 235, 1)');
        criarGrafico(ctxCaixa10Pressao, 'Pressão Caixa 10', data.map(item => getDataBySensorId('5', 'pressao')), 'rgba(75, 192, 192, 1)');

        criarGrafico(ctxCaixa12Temp, 'Temperatura Caixa 12', data.map(item => getDataBySensorId('6', 'temperatura')), 'rgba(75, 192, 192, 1)');
        criarGrafico(ctxCaixa12Umid, 'Umidade Caixa 12', data.map(item => getDataBySensorId('6', 'umidade')), 'rgba(54, 162, 235, 1)');
        criarGrafico(ctxCaixa12Pressao, 'Pressão Caixa 12', data.map(item => getDataBySensorId('6', 'pressao')), 'rgba(75, 192, 192, 1)');

        criarGrafico(ctxAmbienteTemp, 'Temperatura Ambiente', data.map(item => getDataBySensorId('7', 'temperatura')), 'rgba(153, 102, 255, 1)');
        criarGrafico(ctxAmbienteUmid, 'Umidade Ambiente', data.map(item => getDataBySensorId('7', 'umidade')), 'rgba(54, 162, 235, 1)');
        criarGrafico(ctxAmbientePressao, 'Pressão Ambiente', data.map(item => getDataBySensorId('7', 'pressao')), 'rgba(75, 192, 192, 1)');

    } catch (error) {
        console.error('Error fetching data:', error);
        document.querySelector('.graphs-area').innerHTML = "<p>Erro ao carregar os dados.</p>";
    }
}

document.addEventListener('DOMContentLoaded', fetchData);
