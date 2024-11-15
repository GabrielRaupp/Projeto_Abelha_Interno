Projeto Telemetria - Sistema de Monitoramento
Este projeto tem como objetivo coletar e visualizar dados de telemetria de sensores para monitoramento de ambiente e caixas, como temperatura, umidade e pressão. Através de uma interface web, os dados podem ser filtrados por data e exibidos em gráficos interativos.

Tecnologias Utilizadas
Frontend:
HTML, CSS e JavaScript
Chartist.js para gráficos
Backend:
Node.js com Express para a criação de servidor
MySQL para banco de dados
API para fornecer dados de telemetria
Outras:
Fetch API para comunicação com o backend
Funcionalidades
Seleção de Data:


O usuário pode selecionar uma data através de um seletor de data. A partir dessa data, os dados serão filtrados e exibidos nos gráficos.
A data mínima disponível para seleção é 29 de agosto de 2024.
Gráficos de Telemetria:

São exibidos gráficos para cada sensor, mostrando os dados de temperatura, umidade e pressão. Os dados são apresentados em tempo real, com atualizações a cada 3 minutos.
A visualização é feita através de gráficos de linha interativos, com informações sobre o valor do dado no momento do mouse over.
Backend e Banco de Dados:

Os dados são armazenados em um banco de dados MySQL, com a tabela telemetria contendo informações de sensores.
O backend é responsável por fornecer uma API para a obtenção dos dados de telemetria via GET.
Instalação
Requisitos
Node.js
MySQL
Acesso ao banco de dados configurado


Licença
Este projeto é licenciado sob a MIT License.

Autor
Gabriel Pimentel - Desenvolvedor
