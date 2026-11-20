<div align="center">

  <img src="docs/assets/brand-h.png" alt="Rainha System Logo" width="380" />

  # SmartQuote AI 🏗️✨
  ### *Motor Inteligente de Orçamentos e Traço de Materiais para Construção Civil*

  [![Angular](https://img.shields.io/badge/Angular-18+-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
  [![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

  <p align="center">
    <strong>Uma solução corporativa desenvolvida sob a chancela da Rainha System</strong>, combinando Inteligência Artificial Generativa (NLP), engenharia de software full stack e regras de negócio de atacarejo de materiais de construção.
  </p>

  [Visualizar Protótipo Interativo](docs/prototype.html) • [Documentação da API](#-arquitetura-e-fluxo-de-dados) • [Como Executar](#-como-executar)

</div>

---

## 📌 Visão Geral do Projeto

No setor de varejo e atacarejo de materiais de construção, a geração de orçamentos precisos é frequentemente um gargalo operacional. O cliente chega com uma necessidade em linguagem informal (ex.: *"preciso rebocar uma parede de 50m² e colocar porcelanato"*), exigindo que o vendedor calcule manualmente traços de argamassa, consumo por metro quadrado, margem de quebra e compatibilidade de insumos.

O **SmartQuote AI** resolve essa dor:
1. **Interpretação Semântica (NLP):** O usuário descreve a obra em linguagem natural;
2. **Motor de Engenharia:** A IA decompõe o pedido, calcula traços (cimento, areia, brita, argamassas AC-I/II/III, rejuntes, tintas) e aplica margens técnicas de segurança (5%, 10% ou 15%);
3. **Planilha Precisa & Instantânea:** Monta uma lista quantitativa e financeira de materiais com preços parametrizados em tempo real;
4. **Fechamento de Vendas Omnichannel:** Disparo de orçamentos diagramados e integração direta com a API do WhatsApp.

---

## 🏛️ Arquitetura e Fluxo de Dados

A solução adota uma arquitetura em **Monorepo**, desacoplada e escalável:

```mermaid
flowchart TD
    subgraph Client ["🖥️ Frontend (Angular 18+)"]
        UI["Interface Rainha System (Tailwind CSS)"]
        State["Gerenciamento Reativo via Signals"]
        HTTP["Angular HttpClient + Interceptors"]
    end

    subgraph Server ["⚙️ Backend (Node.js + TypeScript)"]
        Router["Express / Fastify Router"]
        NLPService["AI Prompt Engine (Gemini / OpenAI API)"]
        CalcEngine["Rule-based Construction Calc Engine"]
        DBRepo["Prisma / Repository Pattern"]
    end

    subgraph Data ["🗄️ Persistência & Mensageria"]
        PG[("PostgreSQL")]
        WPP["WhatsApp Cloud API / Baileys Gateway"]
    end

    UI --> State --> HTTP
    HTTP -->|POST /api/v1/quote/calculate| Router
    Router --> NLPService
    NLPService -->|JSON Estruturado com Metragem| CalcEngine
    CalcEngine -->|Consulta Preços & Estoque| DBRepo
    DBRepo <--> PG
    CalcEngine -->|Planilha Final & Resumo| Router
    Router -->|JSON de Resposta com KPIs| HTTP
    UI -.->|Enviar Orçamento| WPP
```

---

## 🚀 Principais Funcionalidades

- **Prompt Inteligente:** Processamento de linguagem natural com fallback estruturado em schema JSON;
- **Cálculo Paramétrico de Obras:**
  - Reboco paulista e emboço (traços 1:3 a 1:6);
  - Assentamento de pisos cerâmicos e porcelanatos (AC-I, AC-II, AC-III);
  - Contrapiso nivelado e lajes;
  - Pinturas com demãos, seladores e massas corridas.
- **Margem de Perda Ajustável:** Configuração de quebra (5%, 10%, 15%) de acordo com a complexidade dos cortes;
- **KPIs em Tempo Real:** Total orçado, volume de insumos e estimativa de dias de aplicação com base no tamanho da equipe;
- **Exportação & Mensageria:** Geração de arquivos CSV/PDF e compartilhamento direto com o cliente via WhatsApp;
- **Design System Rainha System:** Interface responsiva, moderna e imersiva com paleta Dourada/Âmbar sobre Dark Slate.

---

## 🗂️ Estrutura do Monorepo

```text
smartquote-ai/
├── backend/                  # API REST em Node.js + TypeScript
│   ├── src/
│   │   ├── controllers/      # Controladores HTTP
│   │   ├── services/         # Regras de cálculo e chamadas à LLM
│   │   ├── prompts/          # Templates de Engenharia de Prompt (few-shot)
│   │   ├── models/           # Entidades e interfaces
│   │   └── server.ts         # Ponto de entrada do servidor
│   ├── package.json
│   └── Dockerfile
├── frontend/                 # Aplicação Angular 18+
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/   # Standalone Components (Prompt, KPIs, Tabela)
│   │   │   ├── services/     # Serviços de cotação e mensageria
│   │   │   └── models/       # Interfaces TypeScript compartilhadas
│   │   └── styles.css        # Tailwind CSS + Tokens Rainha System
│   ├── package.json
│   └── Dockerfile
├── docs/                     # Documentação e ativos da marca
│   ├── assets/               # Logotipos e ícones da Rainha System
│   └── prototype.html        # Protótipo funcional de alta fidelidade
├── docker-compose.yml        # Orquestração de containers (App + DB)
├── .gitignore
└── README.md
```

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia | Motivação / Uso |
| :--- | :--- | :--- |
| **Front-end** | **Angular 18+** | Standalone Components, Signals para reatividade pura, RxJS |
| **Estilização** | **Tailwind CSS** | Design system customizado com tokens da Rainha System |
| **Back-end** | **Node.js + TypeScript** | Tipagem estática rigorosa, alta performance em I/O |
| **IA / NLP** | **Google Gemini API** | Extração de entidades estruturadas a partir de texto informal |
| **Banco de Dados** | **PostgreSQL 16** | Armazenamento de catálogo de insumos, histórico e tabelas de preço |
| **DevOps** | **Docker & Compose** | Ambientes de desenvolvimento e produção reproduzíveis em 1 comando |

---

## 💻 Como Executar

### Pré-requisitos
- [Node.js](https://nodejs.org/) v20+
- [Docker](https://www.docker.com/) e Docker Compose
- Chave de API da LLM (Gemini API ou OpenAI)

### 1. Clonar o Repositório
```bash
git clone https://github.com/Kleby/smartquote-ai.git
cd smartquote-ai
```

### 2. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto com base nas suas credenciais:
```env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://rainha:rainha123@localhost:5432/smartquote_db
GEMINI_API_KEY=sua_chave_aqui
```

### 3. Execução Rápida via Docker Compose
```bash
docker compose up -d --build
```
Acesse a aplicação em:
- **Frontend:** `http://localhost:4200`
- **Backend API:** `http://localhost:3001/api/v1/health`

---

## 👨‍💻 Autor

Desenvolvido por **João Kleby Barros Veiga**  
*Desenvolvedor Full Stack • Pós-graduando em Inteligência Artificial e Machine Learning • Rainha System*

- 💼 **LinkedIn:** [linkedin.com/in/jkleby](https://www.linkedin.com/in/jkleby)
- 🐙 **GitHub:** [github.com/Kleby](https://github.com/Kleby)
- 📧 **Contato:** kleby10@gmail.com

---

<div align="center">
  <small>© Rainha System. Todos os direitos reservados.</small>
</div>
