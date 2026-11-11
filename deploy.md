# 🚀 Deploy Guide — M.C.P PERSONAL OS

> Guia completo para deploy perfeito na **Vercel**. Siga cada passo na ordem indicada.

---

## 📋 Pré-requisitos

- Conta na [Vercel](https://vercel.com)
- Conta no [Supabase](https://supabase.com) (projeto `binaural` — ref: `kbqxzmyasstdvvbfymft`)
- Conta no [Resend](https://resend.com) com domínio verificado
- Projeto no [Google Cloud Console](https://console.cloud.google.com) com OAuth2 configurado
- Git instalado localmente
- Repositório no GitHub conectado à Vercel

---

## ⚠️ ANTES DE TUDO — Segurança

> **NUNCA commite os arquivos abaixo.** Eles já estão no `.gitignore`:
> - `credentials.json` ← Client Secret Google OAuth
> - `token.json` ← Token de acesso Google
> - `.env` ← Variáveis de ambiente locais
>
> Verifique com: `git status` (esses arquivos NÃO devem aparecer)

---

## 🗂️ Estrutura de Arquivos Deployados

Apenas esses arquivos chegam à Vercel (o `.vercelignore` bloqueia o restante):

```
├── index.html          ← App principal (Personal OS)
├── admin.html          ← Painel de administração da galeria
├── diary.html          ← Diário / Journal
├── js/
│   ├── control-engine.js
│   ├── habit-tracker.js
│   ├── webgl-backgrounds.js
│   ├── glass-dialog.js
│   ├── diary-crypto.js
│   └── supabase-auth-gate.js
├── assets/             ← Imagens e ícones
├── cartas/             ← Assets de cartas
├── package.json
└── vercel.json         ← Rotas, cache e headers de segurança
```

**NÃO deployados (bloqueados pelo .vercelignore):**
`credentials.json`, `token.json`, `server.py`, `scratch/`, `.env`, `new backgrounds/`, `rules/`, `structure/`, `gemini.md`

---

## 🔐 Variáveis de Ambiente — Configuração Completa

### Como acessar na Vercel

1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecione o projeto **m-c-p---os-personal-os**
3. Vá em **Settings → Environment Variables**
4. Adicione cada variável abaixo com o botão **Add New**

---

### Supabase (Projeto binaural)

| Variável | Valor | Ambiente |
|---|---|---|
| `SUPABASE_URL` | `https://kbqxzmyasstdvvbfymft.supabase.co` | All |
| `SUPABASE_ANON_KEY` | *(anon key — ver abaixo)* | All |
| `SUPABASE_PROJECT_REF` | `kbqxzmyasstdvvbfymft` | Production |

**Como obter a SUPABASE_ANON_KEY:**
1. Acesse [supabase.com](https://supabase.com) → projeto binaural
2. Vá em **Project Settings → API**
3. Copie a chave `anon` `public`

> ⚠️ A anon key é pública por design do Supabase — segura para o frontend.
> NUNCA use a `service_role` key no front.

---

### Resend (Sistema de Email)

| Variável | Onde configurar | Valor |
|---|---|---|
| `RESEND_API_KEY` | Supabase Secrets (Edge Function) | `re_xxxxxxxxxxxx` |
| Remetente | Admin Panel do app → Configurações | `noreply@seudominio.com` |

**A API Key do Resend NÃO vai para a Vercel diretamente.**
Ela é configurada de duas formas:
1. **Via painel Admin** do app (salvo no LocalStorage do usuário — para uso imediato)
2. **Via Supabase Edge Function Secret** (para envio automático seguro):

```bash
# Instale o Supabase CLI
npm install -g supabase

# Faça login e linke ao projeto
supabase login
supabase link --project-ref kbqxzmyasstdvvbfymft

# Configure o secret (NÃO vai para o código)
supabase secrets set RESEND_API_KEY=re_sua_chave_aqui

# Deploy da Edge Function de email
supabase functions deploy send-resend-email
```

---

### Google Calendar (OAuth2)

| Variável | Visibilidade | Onde usar |
|---|---|---|
| `GOOGLE_CLIENT_ID` | **Pública** — pode estar no JS | Frontend (já está no código) |
| `GOOGLE_CLIENT_SECRET` | **PRIVADA** — NUNCA no frontend | Apenas localmente / servidor |

**O Client ID já está no código** (`control-engine.js` linha 226) — isso é correto por design do OAuth2.

**O Client Secret (`credentials.json`) permanece APENAS na sua máquina local.**
O servidor MCP (`server.py`) roda localmente para integração com Google Calendar.

---

### Configurar URIs Autorizadas no Google Cloud

Após fazer deploy, atualize as URIs:

1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Vá em **APIs & Services → Credentials → seu OAuth 2.0 Client ID**
3. Em **Authorized JavaScript origins**, adicione:
   ```
   https://seu-projeto.vercel.app
   https://seudominio.com
   ```
4. Em **Authorized redirect URIs**, adicione:
   ```
   https://seu-projeto.vercel.app
   https://seu-projeto.vercel.app/index.html
   https://seudominio.com
   ```
5. Clique em **Save** e aguarde até 5 minutos para propagar.

---

## 🚢 Deploy Passo a Passo

### Opção A — Via GitHub (Recomendado — deploy automático)

```bash
# 1. Verifique que arquivos sensíveis não estão rastreados
git status
# credentials.json, token.json, .env NÃO devem aparecer

# 2. Adicione as mudanças
git add -A

# 3. Revise o que vai ser commitado
git diff --staged --stat

# 4. Commit
git commit -m "chore: production deploy"

# 5. Push
git push origin main
```

A Vercel detecta o push e faz deploy automaticamente.
Acompanhe em: **vercel.com/dashboard → seu projeto → Deployments**

---

### Opção B — Via Vercel CLI (deploy manual)

```bash
# Instalar CLI
npm i -g vercel

# Login
vercel login

# Deploy de preview (teste)
vercel

# Deploy de produção
vercel --prod
```

---

## ✅ Checklist Pós-Deploy

### Sistema Base
- [ ] Abrir `https://seu-projeto.vercel.app` — carrega sem erros
- [ ] Gate de autenticação Supabase aparece e funciona
- [ ] Login com senha funciona

### Habits & Dados
- [ ] Hábitos carregam do Supabase corretamente
- [ ] Marcar hábito persiste após reload

### Emails Motivacionais (Resend)
- [ ] Admin Email Panel → ⚙️ Configurações → inserir API Key do Resend
- [ ] Salvar configurações
- [ ] Clicar em "Disparar Briefing Diário" → email chega na caixa

### Google Calendar
- [ ] Control → ⚙️ Configurações Google Calendar
- [ ] Botão "Conectar com Google" funciona
- [ ] Autorizações OAuth aparecem corretamente
- [ ] Criar evento de teste

### Segurança (verifique em securityheaders.com)
- [ ] `X-Frame-Options: DENY`
- [ ] `Strict-Transport-Security`
- [ ] `Content-Security-Policy`
- [ ] `X-Content-Type-Options: nosniff`

---

## 📦 Tamanho do Deploy

| Arquivo | Tamanho |
|---|---|
| `index.html` | ~303 KB |
| `admin.html` | ~149 KB |
| `diary.html` | ~172 KB |
| `js/control-engine.js` | ~203 KB |
| `js/habit-tracker.js` | ~130 KB |
| `js/webgl-backgrounds.js` | ~148 KB |
| `assets/` | ~668 KB |
| **Total estimado** | **~1.9 MB** |

Muito abaixo do limite gratuito da Vercel (100 MB por deployment).

---

## 🔄 Resumo Final das Variáveis

```
# Na Vercel (Settings → Environment Variables)
SUPABASE_URL=https://kbqxzmyasstdvvbfymft.supabase.co
SUPABASE_ANON_KEY=<cole aqui a anon key do Supabase Dashboard>
SUPABASE_PROJECT_REF=kbqxzmyasstdvvbfymft

# No Google Cloud Console (não na Vercel)
# Adicionar domínios vercel.app nas URIs autorizadas

# Na Supabase Edge Function (supabase secrets set)
RESEND_API_KEY=re_sua_chave_aqui

# Google Client ID (já está no código — público por design)
# demo-client-id.apps.googleusercontent.com

# Google Client Secret → NUNCA no deploy → apenas local em credentials.json
```

> **IMPORTANTE:** Este projeto é um frontend estático (HTML/JS puro).
> Variáveis de ambiente da Vercel NÃO são injetadas automaticamente no browser.
> Elas só funcionam em Vercel Functions (serverless). Para este projeto:
> - Supabase anon key → pode estar no JS (pública por design)
> - Resend API key → inserida pelo usuário via painel Admin (salva no LocalStorage)
> - Google Client ID → pode estar no JS (público por design do OAuth2)
> - Google Client Secret → APENAS local, NUNCA no frontend

---

*M.C.P PERSONAL OS — Deploy Guide v1.0 — 2026-08-23*
