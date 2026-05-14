# BetIntel AI

Plataforma web de análise estatística para apostas esportivas. Baseada em probabilidades, tendências e dados históricos — **não promete resultados garantidos**.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18 + TypeScript + Vite + TailwindCSS |
| Backend | Node.js + TypeScript + Express |
| Banco de dados | Firebase Firestore |
| Autenticação | Firebase Auth (email + Google) |
| Estado | Zustand + TanStack Query |
| Deploy | Vercel |
| API esportiva | API-Football (com mock data como fallback) |

---

## Estrutura do projeto

```
betintel-ai/
├── apps/
│   ├── web/          # Frontend React
│   └── api/          # Backend Node.js
├── packages/
│   └── shared/       # Tipos TypeScript compartilhados
├── firebase/
│   ├── firestore.rules
│   └── firestore.indexes.json
├── .env.example
├── vercel.json
└── README.md
```

---

## Como rodar localmente

### 1. Pré-requisitos

- Node.js 18+
- npm 9+

### 2. Clone e instale

```bash
git clone https://github.com/seu-usuario/betintel-ai.git
cd betintel-ai
npm install
```

### 3. Configure as variáveis de ambiente

**Frontend:**
```bash
cp apps/web/.env.example apps/web/.env
# As chaves do Firebase já estão pré-configuradas no .env.example
```

**Backend:**
```bash
cp apps/api/.env.example apps/api/.env
# Edite apps/api/.env e adicione suas chaves
```

### 4. Rode o projeto

```bash
npm run dev
```

Isso inicia:
- Frontend em http://localhost:5173
- Backend em http://localhost:3001

> **Sem API key configurada:** o sistema usa dados de demonstração (mock) automaticamente. Todas as funcionalidades ficam disponíveis com dados fictícios.

---

## Configurando as APIs esportivas

### API-Football (recomendado)

1. Acesse https://www.api-football.com
2. Crie uma conta gratuita
3. Copie sua API key
4. Adicione em `apps/api/.env`:
   ```
   API_FOOTBALL_KEY=sua_chave_aqui
   ```

O plano gratuito inclui:
- 100 requisições/dia
- Fixtures, estatísticas, lineups, H2H
- Suficiente para desenvolvimento e testes

### SportMonks e Sportradar

Os adapters estão preparados em:
- `apps/api/src/providers/SportMonksProvider.ts`
- `apps/api/src/providers/SportradarProvider.ts`

Implemente os métodos e adicione as chaves correspondentes no `.env`.

---

## Firebase — configuração

O projeto já usa o Firebase configurado. Para usar o seu próprio:

1. Crie um projeto em https://console.firebase.google.com
2. Ative **Authentication** (Email/Senha + Google)
3. Ative **Firestore Database**
4. Copie as configurações e atualize `apps/web/.env`

### Aplicar Firestore Rules

```bash
npm install -g firebase-tools
firebase login
firebase init firestore
firebase deploy --only firestore:rules,firestore:indexes
```

---

## Deploy na Vercel

### 1. Primeiro deploy

```bash
npm install -g vercel
cd betintel-ai
vercel
```

### 2. Configure as variáveis de ambiente na Vercel

No painel da Vercel, em **Settings > Environment Variables**, adicione:

**Para o frontend (prefixo VITE_):**
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
VITE_API_URL=https://seu-projeto.vercel.app/api
```

**Para o backend (nunca expor no frontend):**
```
API_FOOTBALL_KEY
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
NODE_ENV=production
```

### 3. Deploy de produção

```bash
vercel --prod
```

---

## Deploy alternativo (separado)

Se preferir hospedar frontend e backend separados:

**Frontend (Vercel/Netlify):**
```bash
cd apps/web
npm run build
# Faça deploy da pasta dist/
```

**Backend (Railway/Render/Fly.io):**
```bash
cd apps/api
npm run build
npm start
```

---

## Funcionalidades

### Dashboard
- Próximos jogos e jogos de hoje
- Filtros por liga, time e busca
- Cards com escudo, horário e campeonato

### Análise de partida
- **Análise estatística** com probabilidades calculadas
- **Forma recente** dos times (últ. 5, 10, 15 jogos)
- **Confrontos diretos** (H2H) com histórico completo
- **Escalações** (oficial ou provável)
- **Estatísticas dos jogadores**
- **Transferências** recentes

### Motor de análise (PredictionEngine)

Pesos utilizados:
| Fator | Peso |
|-------|------|
| Forma recente | 25% |
| Ataque/Defesa | 20% |
| Mando de campo | 15% |
| Confronto direto | 15% |
| Escalação/Desfalques | 15% |
| Transferências recentes | 5% |
| Mercado/Odds | 5% |

Mercados calculados: resultado (1X2), Over/Under 1.5 e 2.5, BTTS, escanteios, cartões, faltas e finalizações.

---

## Estrutura de rotas da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/fixtures/upcoming` | Próximos jogos |
| GET | `/api/fixtures/today` | Jogos de hoje |
| GET | `/api/fixtures/:id` | Detalhes da partida |
| GET | `/api/fixtures/:id/analysis` | Análise completa |
| GET | `/api/teams/:id/form` | Forma recente do time |
| GET | `/api/teams/:id/transfers` | Transferências |
| GET | `/api/players/:id/stats` | Stats do jogador |
| GET | `/api/head-to-head?teamA=&teamB=` | H2H |
| GET | `/api/leagues` | Ligas suportadas |
| POST | `/api/cache/refresh` | Limpar cache |

---

## Segurança

- API keys esportivas **nunca** expostas no frontend
- Todas as integrações externas passam pelo backend
- Rate limiting nas rotas da API
- Validação de parâmetros com Zod
- Firestore Rules restritas por usuário
- Headers de segurança com Helmet

---

## Aviso legal

> Esta plataforma fornece análises baseadas em estatísticas e probabilidades históricas. **Não constitui garantia de resultados.** Aposte com responsabilidade. O usuário é responsável pelas suas decisões de apostas.

---

## Licença

MIT
