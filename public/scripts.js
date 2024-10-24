// Função para buscar dados da API
async function fetchDados() {
    try {
        const response = await fetch('/dados'); // Buscando dados da API
        const dados = await response.json();    // Convertendo resposta para JSON
        return dados;
    } catch (error) {
        console.error("Erro ao buscar os dados:", error);
    }
}

// Função para desenhar gráficos com D3.js
async function renderGraficos() {
    const dados = await fetchDados(); // Buscando os dados do backend

    if (!dados || dados.length === 0) {
        console.error("Nenhum dado disponível para exibição.");
        return;
    }

    // Processando dados de telemetria
    dados.forEach(caixa => {
        // Selecionando o contêiner correto para cada caixa
        const containerTemperatura = d3.select(`#temperaturaCaixa${caixa.caixa}`);
        const containerUmidade = d3.select(`#umidadeCaixa${caixa.caixa}`);
        const containerPressao = d3.select(`#pressaoCaixa${caixa.caixa}`);

        // Dados de exemplo (ajuste conforme seus campos de telemetria)
        const temperaturaData = caixa.temperatura;
        const umidadeData = caixa.umidade;
        const pressaoData = caixa.pressao;

        // Criando gráficos de temperatura
        criarGrafico(containerTemperatura, temperaturaData, 'Temperatura (°C)');

        // Criando gráficos de umidade
        criarGrafico(containerUmidade, umidadeData, 'Umidade (%)');

        // Criando gráficos de pressão
        criarGrafico(containerPressao, pressaoData, 'Pressão (hPa)');
    });
}

// Função para criar gráfico usando D3.js
function criarGrafico(container, data, titulo) {
    // Definir margens e dimensões do gráfico
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 400 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Criar o SVG
    const svg = container.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Definir escalas para o gráfico
    const x = d3.scaleLinear()
        .domain([0, data.length - 1]) // Intervalo de dados no eixo X
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([d3.min(data), d3.max(data)]) // Intervalo de dados no eixo Y
        .range([height, 0]);

    // Adicionar eixo X
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    // Adicionar eixo Y
    svg.append("g")
        .call(d3.axisLeft(y));

    // Adicionar a linha dos dados
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x((d, i) => x(i))   // Posicionamento no eixo X
            .y(d => y(d))        // Posicionamento no eixo Y
        );

    // Adicionar título
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .text(titulo);
}

// Inicializando os gráficos quando o conteúdo da página carregar
document.addEventListener('DOMContentLoaded', renderGraficos);
