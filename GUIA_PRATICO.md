# GUIA PRATICO - Como Colocar o Site no Ar e Gerenciar Associados

---

## PARTE 1: COLOCAR O SITE NO AR (Deploy)

### Passo 1 - Criar conta no TiDB (Banco de Dados Gratuito)

1. Acesse: **https://tidbcloud.com**
2. Clique em **"Get Started for Free"**
3. Crie conta com seu email ou Google
4. Clique em **"Create Cluster"**
5. Escolha **"Serverless Tier"** (GRATUITO)
6. Regiao: **AWS sa-east-1 (Sao Paulo)**
7. Clique **"Create"**

**Copiar os dados de conexao:**
- Depois de criado, clique em **"Connect"**
- Selecione **"General"**
- Copie: Host, User e Password (clique em "Generate Password")

---

### Passo 2 - Colocar projeto no GitHub

1. Acesse: **https://github.com/new**
2. Nome: **capelania-internacional**
3. Deixe Public e clique **"Create repository"**
4. No terminal (dentro da pasta do projeto), rode:

```bash
cd /mnt/agents/output/app
git init
git add .
git commit -m "Primeiro commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/capelania-internacional.git
git push -u origin main
```

*(Troque SEU_USUARIO pelo seu usuario do GitHub)*

---

### Passo 3 - Deploy no Vercel

1. Acesse: **https://vercel.com**
2. Clique **"Sign Up"** e use sua conta GitHub
3. Clique **"Add New Project"**
4. Selecione **capelania-internacional**
5. Em **"Framework Preset"** escolha: **Other**
6. Em **"Build Command"** digite: `npm run build:vercel`
7. Em **"Output Directory"** digite: `dist/public`
8. Clique **"Deploy"**

---

### Passo 4 - Configurar Banco de Dados

1. No painel do Vercel, clique no seu projeto
2. Clique em **"Settings"** (no topo)
3. Clique em **"Environment Variables"** (lateral esquerda)
4. Adicione estas variaveis:

| Nome | Valor |
|------|-------|
| `DATABASE_URL` | `mysql://SEU_USER:SUA_SENHA@gateway01.xxx.aws.tidbcloud.com:4000/capelania?ssl={"rejectUnauthorized":true}` |
| `APP_ID` | `capelania` |
| `APP_SECRET` | `capelania-secret` |

*(Troque SEU_USER, SUA_SENHA e gateway01.xxx pelo que voce copiou do TiDB)*

5. Clique **"Save"**
6. Va em **"Deployments"** (topo), clique nos **3 pontinhos** e **"Redeploy"**

---

### Passo 5 - Criar tabela no banco

No seu computador, rode:

```bash
cd /mnt/agents/output/app
export DATABASE_URL="mysql://SEU_USER:SUA_SENHA@gateway01.xxx.aws.tidbcloud.com:4000/capelania?ssl={\"rejectUnauthorized\":true}"
npx drizzle-kit push
```

*(Troque pelos seus dados do TiDB)*

Pronto! O site esta no ar! 🎉

---

## PARTE 2: ADICIONAR NOVOS ASSOCIADOS

### Metodo 1 - Pelo link direto (Mais facil!)

1. Acesse seu site
2. No final da URL, adicione **/admin**
3. Exemplo: `https://seusite.vercel.app/admin`
4. Pronto! Voce pode adicionar, editar e excluir associados!

### Metodo 2 - Campos para preencher

Quando adicionar um novo associado, preencha:

| Campo | O que colocar |
|-------|---------------|
| **Nome Completo** | Nome completo do capelao |
| Email | Email de contato (opcional) |
| Telefone | Numero de telefone (opcional) |
| Cidade | Cidade onde atua |
| Estado | Estado/Provincia |
| Pais | Pais |
| Curso | Curso que fez (ex: "Capelania Internacional") |
| Data de Conclusao | Quando terminou (ex: "15/03/2024") |
| N do Certificado | Numero da carteirinha |
| Status | Ativo ou Inativo |
| Observacoes | Qualquer informacao extra |

---

## LINKS

| Servico | Link |
|---------|------|
| Vercel | https://vercel.com |
| TiDB Cloud | https://tidbcloud.com |
| GitHub | https://github.com |

## CUSTO

**R$ 0,00 por mes!** Tudo gratuito!

---

## RESUMO RAPIDO

Para colocar no ar voce precisa:
1. ✅ Criar conta no TiDB (banco de dados)
2. ✅ Enviar projeto para o GitHub
3. ✅ Conectar GitHub no Vercel
4. ✅ Colocar dados do banco no Vercel
5. ✅ Rodar drizzle-kit push para criar tabela

Para adicionar associados:
1. ✅ Acesse seu-site.com/admin
2. ✅ Clique "Adicionar Aluno"
3. ✅ Preencha os dados
4. ✅ Clique "Salvar"
