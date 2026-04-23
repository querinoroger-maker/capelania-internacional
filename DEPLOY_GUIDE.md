# Guia de Deploy - Capelania Internacional
## Vercel + TiDB (100% Gratuito)

---

## ETAPA 1: Criar Conta no TiDB (Banco de Dados MySQL Gratuito)

O TiDB oferece **5GB de banco de dados MySQL gratuitos** forever.

1. Acesse: https://tidbcloud.com
2. Clique em **"Get Started for Free"**
3. Crie uma conta (pode usar Google, GitHub ou email)
4. Depois de logar, clique em **"Create Cluster"**
5. Escolha a opção **"Serverless Tier"** (esta e a gratuita!)
6. Selecione a regiao mais proxima: **AWS sa-east-1 (Sao Paulo)** ou **AWS us-east-1**
7. Clique em **"Create"** e aguarde (cerca de 1-2 minutos)

### Obter os dados de conexao:

1. No painel do TiDB, clique em **"Connect"** no seu cluster
2. Selecione **"General"** como tipo de conexao
3. Voce vai ver os dados:
   - **Host**: algo tipo `gateway01.xxx.aws.tidbcloud.com`
   - **Port**: `4000`
   - **User**: `xxx.root`
   - **Password**: clique em "Generate Password" para criar
4. Copie esses dados - voce vai usar no Vercel

### Criar a URL de conexao:

A URL do banco vai ficar assim:
```
mysql://USER:PASSWORD@HOST:4000/capelania?ssl={"rejectUnauthorized":true}
```

Substitua:
- `USER` = seu usuario
- `PASSWORD` = sua senha
- `HOST` = o host do TiDB

Exemplo:
```
mysql://4xxxxxx.root:xxxxxxxx@gateway01.us-east-1.prod.aws.tidbcloud.com:4000/capelania?ssl={"rejectUnauthorized":true}
```

---

## ETAPA 2: Preparar o Projeto no GitHub

1. Crie um repositorio novo no GitHub: `capelania-internacional`
2. Faca upload dos arquivos do projeto (ou use Git):

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/capelania-internacional.git
git push -u origin main
```

---

## ETAPA 3: Criar Conta e Deploy no Vercel

1. Acesse: https://vercel.com
2. Clique em **"Sign Up"** e crie uma conta (use GitHub para facilitar)
3. Clique em **"Add New Project"**
4. Selecione seu repositorio `capelania-internacional`
5. Configure:
   - **Framework Preset**: `Other`
   - **Build Command**: `npm run build:vercel`
   - **Output Directory**: `dist/public`

6. Clique em **"Deploy"**
7. Aguarde o deploy (cerca de 2 minutos)

---

## ETAPA 4: Configurar Variaveis de Ambiente

Agora voce precisa adicionar a URL do banco de dados:

1. No painel do Vercel, clique no seu projeto
2. Va em **"Settings"** (no menu superior)
3. Clique em **"Environment Variables"** (no menu lateral)
4. Adicione a variavel:

| Name | Value |
|------|-------|
| `DATABASE_URL` | `mysql://USER:PASSWORD@HOST:4000/capelania?ssl={"rejectUnauthorized":true}` |
| `APP_ID` | `capelania-app` |
| `APP_SECRET` | `capelania-secret-2024` |

5. Clique em **"Save"**
6. Va em **"Deployments"** no menu
7. Clique nos **3 pontinhos** do ultimo deploy e selecione **"Redeploy"**

---

## ETAPA 5: Criar as Tabelas no Banco

O Drizzle vai criar as tabelas automaticamente!

1. No seu computador, com o projeto aberto, rode:

```bash
# Instalar o TiDB CLI (uma vez)
npm install -g @tidbcloud/serverless

# Ou use o script do Drizzle
npx drizzle-kit push
```

**ATENCAO**: O Drizzle usa MySQL, mas o TiDB e compativel! Quando rodar o `drizzle-kit push`, ele vai criar a tabela `students` automaticamente.

Se precisar, configure o `drizzle.config.ts` assim:
```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "mysql",
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

---

## ETAPA 6: Configurar Domínio Personalizado (Opcional)

Quer usar `www.capelaniainternacional.org`?

1. No Vercel, va em **"Settings" > "Domains"**
2. Digite seu dominio: `capelaniainternacional.org`
3. O Vercel vai te mostrar os DNS para configurar
4. Va no seu registrador de dominio (GoDaddy, Hostgator, Registro.br...) e adicione:
   - Um registro `A` apontando para o IP do Vercel
   - Ou um `CNAME` apontando para `cname.vercel-dns.com`
5. Aguarde 24-48h para propagar

---

## CUSTOS

| Servico | Custo |
|---------|-------|
| Vercel (Hobby) | **GRATIS** |
| TiDB Serverless | **GRATIS** (5GB) |
| Dominio | ~R$ 40-60/ano (se quiser .com.br) |
| **Total** | **R$ 0,00/mes** |

---

## LINKS UTEIS

- **Vercel**: https://vercel.com
- **TiDB Cloud**: https://tidbcloud.com
- **GitHub**: https://github.com

---

## SUPORTE

Se tiver problemas:
1. Verifique se a `DATABASE_URL` esta correta
2. Confira se o cluster TiDB esta "ativo" (running)
3. Veja os logs no Vercel: **Deployments > Latest > Logs**
