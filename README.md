# Documentação do Projeto MapaCalor

## Visão Geral
O projeto MapaCalor é uma aplicação web que gera mapas de calor com base em dados de vendas georreferenciados. A aplicação permite visualizar a concentração de vendas em diferentes áreas geográficas ao redor das lojas, facilitando a análise de desempenho e distribuição de vendas.

## Estrutura do Projeto

```
mapacalor/
│
├── .env                # Configurações de ambiente (arquivo privado)
├── .gitignore          # Arquivos e diretórios ignorados pelo Git
├── app.js              # Configuração principal da aplicação Express
├── index.js            # Ponto de entrada da aplicação
├── modelo.env          # Modelo para o arquivo .env
├── package.json        # Dependências e metadados do projeto
│
├── components/         # Componentes de renderização HTML
│   ├── gerarErroLoginPage.js    # Página de erro de login
│   ├── gerarHomePage.js         # Página inicial
│   ├── gerarHtmlBasico.js       # Template HTML base
│   ├── gerarLoginPage.js        # Página de login
│   ├── gerarMapa.js             # Componente do mapa de calor
│   ├── gerarMapaPage.js         # Página completa do mapa
│   ├── gerarMenu.js             # Menu de opções do mapa
│   ├── gerarQuadrantes.js       # Geração de quadrantes para o mapa de calor
│   └── gerarRodape.js           # Rodapé das páginas
│
├── public/             # Arquivos estáticos
│   ├── css/
│   │   └── styles.css  # Estilos CSS da aplicação
│   ├── icons/
│   │   └── azilas-pin.png  # Ícone de marcador do mapa
│   └── img/
│       └── rodolfo.jpg     # Imagem do autor
│
├── routes/             # Rotas da aplicação
│   ├── authRoutes.js   # Rotas de autenticação
│   └── mapRoutes.js    # Rotas para o mapa de calor
│
├── services/           # Serviços da aplicação
│   └── mapService.js   # Serviços de consulta ao banco de dados
│
└── utils/              # Utilitários
    └── mapUtils.js     # Funções auxiliares para o mapa
```

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript server-side
- **Express**: Framework web para Node.js
- **PostgreSQL**: Banco de dados relacional para armazenamento dos dados de vendas
- **Leaflet**: Biblioteca JavaScript para mapas interativos
- **Chroma.js**: Biblioteca para manipulação de cores e geração de escalas
- **Express-session**: Middleware para gerenciamento de sessões
- **Moment-timezone**: Biblioteca para manipulação de datas e fusos horários

## Fluxo da Aplicação

1. O usuário acessa a aplicação e é direcionado para a página de login
2. Após autenticação bem-sucedida, o usuário é redirecionado para a página inicial
3. Na página inicial, o usuário pode navegar para o mapa de calor
4. No mapa, o usuário pode:
   - Selecionar a loja para análise
   - Definir o tamanho das áreas de análise (grid)
   - Estabelecer um valor mínimo para exibição de dados
   - Definir o intervalo de datas para análise
5. Com base nos parâmetros, a aplicação gera um mapa de calor com quadrantes coloridos
6. Cada quadrante exibe o valor total de vendas, quantidade de vendas e ticket médio

## Configuração

### Requisitos
- Node.js v14 ou superior
- PostgreSQL 12 ou superior

### Configuração do Ambiente

1. **Clone o repositório**:
   ```
   git clone https://github.com/rodolfobertini/mapacalor.git
   cd mapacalor
   ```

2. **Instale as dependências**:
   ```
   npm install
   ```

3. **Configure o arquivo .env**:
   - Copie o arquivo `modelo.env` para `.env`
   - Preencha as variáveis de ambiente necessárias:
     - `PORT`: Porta para a aplicação (padrão: 3000)
     - `DB_USER`: Usuário do banco de dados
     - `DB_HOST`: Host do banco de dados
     - `DB_NAME`: Nome do banco de dados
     - `DB_PASSWORD`: Senha do banco de dados
     - `DB_PORT`: Porta do banco de dados (padrão: 5432)
     - `MP_LOGIN` e `MP_SENHA`: Credenciais de acesso à aplicação
     - `SESSION_SECRET`: Chave secreta para criptografia de sessões

### Execução

- **Desenvolvimento**:
  ```
  npm run dev
  ```

- **Produção**:
  ```
  npm start
  ```

## Principais Componentes e Funcionalidades

### Autenticação
- Implementada utilizando Express-session
- Login seguro com credenciais configuráveis
- Registro de tentativas de acesso com dados do usuário

### Serviço de Dados (MapService)
- Conexão com PostgreSQL utilizando pooling para melhor performance
- Consulta parametrizada para obtenção de dados de vendas georreferenciados
- Agrupamento de dados por coordenadas geográficas

### Geração de Mapas
- Criação dinâmica de mapas utilizando Leaflet
- Geração de quadrantes com base no tamanho de grid definido pelo usuário
- Atribuição de cores baseada na escala de valores de vendas (verde a vermelho)

### Interface Responsiva
- Design adaptável para diferentes dispositivos
- Formulário de parâmetros para configuração do mapa de calor
- Visualização clara dos dados com indicadores de valor total, quantidade e ticket médio

## Banco de Dados

A aplicação utiliza uma tabela `TB_MOVVENDA` com a seguinte estrutura de colunas relevantes:

- `VEN_NRLOJA`: Número da loja
- `VEN_STATUS`: Status da venda
- `VEN_TPVEND`: Tipo de venda
- `VEN_LATI`: Latitude da venda
- `VEN_LONG`: Longitude da venda
- `VEN_VLRNOT`: Valor da venda
- `VEN_DHMOVI`: Data e hora da venda

## Utilidades do MapUtils

### deslocarCoordenadas
Função que calcula novas coordenadas com base em um deslocamento em metros a partir de um ponto central.

### gerarEscalaDeCores
Função que gera uma escala de cores para visualização dos quadrantes do mapa de calor, variando de verde (menor valor) a vermelho (maior valor).

## Desenvolvedor
- **Rodolfo Bertini** - [bertini.org](https://bertini.org)

## Versão
1.2.0

## Licença
ISC

---

Esta documentação foi criada para fornecer uma visão abrangente do projeto MapaCalor, abordando sua estrutura, funcionamento e configuração.
