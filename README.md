Projeto de Monitoramento de Telemetria
Este sistema tem como objetivo realizar a coleta e exibição de dados de telemetria de sensores em tempo real. Ele utiliza uma interface web onde é possível selecionar uma data específica para visualizar os dados relacionados a sensores de temperatura, umidade e pressão.

Funcionalidades
Seleção de Data: O usuário pode selecionar uma data para visualizar os dados de telemetria de sensores em tempo real.
Exibição de Gráficos: O sistema exibe gráficos de linha para mostrar as medições de temperatura, umidade e pressão ao longo do tempo, utilizando a biblioteca Chartist.
Interatividade com os Gráficos: Ao passar o mouse sobre os gráficos, uma tooltip aparece, mostrando o valor exato do sensor naquele momento e a data/hora correspondente.
Atualização Automática: A cada 3 minutos (180.000 ms), o sistema atualiza automaticamente os dados de telemetria, garantindo que as informações sejam sempre as mais recentes.
Como Funciona
O sistema consiste em dois componentes principais:

Frontend
O frontend é uma aplicação web simples que permite ao usuário interagir com os dados de telemetria:

HTML e JavaScript: A interface permite selecionar a data e, a partir disso, buscar e filtrar os dados armazenados no banco de dados.
Gráficos Dinâmicos: Utiliza a biblioteca Chartist.js para desenhar gráficos interativos de temperatura, umidade e pressão para diferentes sensores.
Backend
O backend é um servidor Express que se conecta ao banco de dados MySQL para buscar e fornecer os dados de telemetria:

Conexão com o Banco de Dados: O servidor se conecta a um banco de dados MySQL hospedado remotamente.
API REST: A rota /api/telemetria disponibiliza os dados de telemetria, que são consumidos pelo frontend.
Instalação
Requisitos
Node.js
MySQL
Passos para Configuração
Clone o repositório:

bash
Copiar código
git clone <URL_DO_REPOSITORIO>
cd <NOME_DA_PASTA>
Instale as dependências:

bash
Copiar código
npm install
Configure o Banco de Dados:

Certifique-se de que o banco de dados MySQL esteja funcionando e que a tabela telemetria tenha os dados necessários.
As credenciais de conexão ao banco de dados são as seguintes:
Host: 194.195.213.74
Usuário: ifc
Senha: ifcs0mbrio
Banco de dados: abelhas
Inicie o servidor:

bash
Copiar código
npm start
O servidor será iniciado na porta 3000. Você pode acessar a aplicação web navegando até http://localhost:3000 em seu navegador.

Estrutura de Diretórios
bash
Copiar código
├── backend/
│   ├── app.js           # Código do servidor Express
│   ├── db.js            # Conexão com o banco de dados
│   └── config.js        # Configurações do banco de dados
├── frontend/
│   ├── Index.html       # Página inicial
│   ├── script.js        # Lógica do frontend
│   ├── styles.css       # Estilos do frontend
└── package.json         # Dependências e scripts do projeto
Contribuindo
Se você deseja contribuir com este projeto, siga as etapas abaixo:

Faça um fork deste repositório.
Crie uma nova branch para suas modificações.
Realize suas mudanças e envie uma pull request com uma descrição detalhada.
Licença
Este projeto está licenciado sob a MIT License - consulte o arquivo LICENSE para mais informações.
