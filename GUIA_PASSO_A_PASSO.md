# 📋 Guia Completo — Como Publicar o Encurtador de Links
### Para iniciantes — passo a passo detalhado

---

## O que você vai precisar

- Um computador (Windows, Mac ou Linux)
- Acesso à internet
- Uma conta de e-mail
- Cerca de 30 minutos

Você vai criar contas em **dois sites gratuitos**:
1. **Supabase** → guarda os links no banco de dados
2. **GitHub** → publica o site na internet

---

---

# PARTE 1 — CRIAR A CONTA NO SUPABASE (banco de dados)

---

## Passo 1 — Acessar o Supabase

1. Abra seu navegador (Chrome, Firefox, Edge...)
2. Digite na barra de endereço: **https://supabase.com**
3. Pressione **Enter**

---

## Passo 2 — Criar sua conta

1. Clique no botão verde **"Start your project"** (no centro da tela)
2. Clique em **"Sign Up"** (cadastro)
3. Você pode usar sua conta do **GitHub** (recomendado) ou seu **e-mail**
   - Se usar e-mail: preencha e-mail e senha, clique em **"Sign Up"**
   - Se usar GitHub: clique em **"Continue with GitHub"** e autorize

---

## Passo 3 — Criar um projeto no Supabase

1. Após entrar, clique no botão verde **"New Project"**
2. Preencha os campos:
   - **Name** (nome): escreva `encurtador` (ou qualquer nome)
   - **Database Password** (senha): crie uma senha forte e **anote em algum lugar** (ex: `MinhaSenha123!`)
   - **Region**: selecione **South America (São Paulo)**
3. Clique no botão verde **"Create new project"**
4. ⏳ Aguarde cerca de **1 a 2 minutos** enquanto o projeto é criado (vai aparecer uma animação de carregamento)

---

## Passo 4 — Criar a tabela no banco de dados

1. No menu do lado esquerdo, procure e clique em **"SQL Editor"**
   - Parece um ícone de código `</>`
2. Vai abrir uma tela com uma área de texto escura (editor de SQL)
3. Clique dentro dessa área de texto para focar nela
4. Pressione **Ctrl+A** (selecionar tudo) para apagar qualquer texto que já estiver lá
5. Abra o arquivo **`supabase_setup.sql`** que está na pasta do projeto:
   - No Windows: clique com botão direito no arquivo → **"Abrir com"** → **Bloco de Notas**
   - No Mac: clique com botão direito → **"Abrir com"** → **TextEdit**
6. Selecione **todo** o conteúdo do arquivo (Ctrl+A) e copie (Ctrl+C)
7. Volte para a aba do Supabase e cole (Ctrl+V) no editor SQL
8. Clique no botão verde **"Run"** (canto inferior direito)
9. ✅ Deve aparecer a mensagem **"Success. No rows returned"** — isso é correto!

---

## Passo 5 — Copiar suas credenciais (chaves de acesso)

Agora você precisa copiar duas informações importantes:

1. No menu esquerdo, clique em **"Project Settings"** (ícone de engrenagem ⚙️)
2. Clique em **"API"** no submenu que aparecer
3. Você verá dois itens importantes:

   **Project URL:**
   - Parece com: `https://abcdefghij.supabase.co`
   - Clique no ícone de cópia ao lado
   - Cole num bloco de notas temporário

   **Project API Keys — anon public:**
   - É uma sequência longa começando com `eyJhbGci...`
   - Clique em **"Reveal"** para mostrar a chave
   - Clique no ícone de cópia
   - Cole no mesmo bloco de notas temporário

> ⚠️ **Guarde essas duas informações!** Você vai precisar delas no Passo 8.

---

---

# PARTE 2 — CRIAR A CONTA NO GITHUB (onde o site fica hospedado)

---

## Passo 6 — Criar conta no GitHub

1. Abra uma nova aba e acesse: **https://github.com**
2. Clique em **"Sign up"** (canto superior direito)
3. Preencha:
   - **Username**: escolha um nome de usuário (ex: `joaosilva`) — **anote este nome!**
   - **Email**: seu e-mail
   - **Password**: uma senha
4. Complete a verificação (puzzle ou captcha)
5. Clique em **"Create account"**
6. Verifique seu e-mail e confirme o cadastro

---

## Passo 7 — Criar o repositório (pasta do site)

1. Após entrar no GitHub, clique no botão verde **"New"** (lado esquerdo)
   - Ou clique no **"+"** no canto superior direito → **"New repository"**
2. Preencha:
   - **Repository name**: `encurtador` (sem espaços, sem acentos)
   - **Description**: pode deixar em branco
   - Marque a opção **"Public"** (público)
   - **NÃO** marque nenhuma das opções de "Initialize this repository"
3. Clique no botão verde **"Create repository"**
4. Vai abrir uma página com instruções — **não feche esta aba**, você vai voltar aqui

---

---

# PARTE 3 — CONFIGURAR OS ARQUIVOS DO PROJETO

---

## Passo 8 — Preencher o arquivo config.js

1. No seu computador, navegue até a pasta com os arquivos do projeto
2. Abra o arquivo **`config.js`** com o Bloco de Notas:
   - Windows: clique com botão direito → **"Abrir com"** → **Bloco de Notas**
   - Mac: clique com botão direito → **"Abrir com"** → **TextEdit**
3. Você verá este conteúdo:

```
const SUPABASE_URL      = "https://SEU_PROJECT_ID.supabase.co";
const SUPABASE_ANON_KEY = "sua-anon-key-publica-aqui";
const BASE_URL = window.location.origin;
```

4. Substitua **`https://SEU_PROJECT_ID.supabase.co`** pela **Project URL** que você copiou no Passo 5
   - Exemplo: `"https://abcdefghij.supabase.co"`

5. Substitua **`sua-anon-key-publica-aqui`** pela chave **anon public** que você copiou no Passo 5
   - Exemplo: `"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`

6. O arquivo ficará assim (com seus dados reais):
```
const SUPABASE_URL      = "https://abcdefghij.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
const BASE_URL = window.location.origin;
```

7. Salve o arquivo: **Ctrl+S**

---

---

# PARTE 4 — FAZER UPLOAD DOS ARQUIVOS PARA O GITHUB

---

## Passo 9 — Enviar os arquivos para o GitHub

Volte para a aba do GitHub com seu repositório criado.

1. Na página do repositório, clique no link **"uploading an existing file"**
   - Estará escrito: *"...or uploading an existing file"*
   - Se não aparecer, clique em **"Add file"** → **"Upload files"**

2. Vai abrir uma área para arrastar arquivos

3. Abra a pasta do projeto no seu computador (Windows Explorer ou Finder no Mac)

4. Selecione **todos os arquivos de uma vez**:
   - Clique no primeiro arquivo
   - Segure **Ctrl** (Windows) ou **Command** (Mac)
   - Clique nos demais arquivos:
     - `index.html`
     - `r.html`
     - `style.css`
     - `app.js`
     - `config.js`
     - `supabase_setup.sql`
     - `README.md`

5. **Arraste** todos os arquivos selecionados para a área pontilhada do GitHub

6. Aguarde o upload terminar (vai aparecer o nome dos arquivos listados)

7. Na parte de baixo da página, em **"Commit changes"**:
   - No campo de texto, escreva: `Primeiro upload`
   - Clique no botão verde **"Commit changes"**

8. ✅ Seus arquivos estão no GitHub!

---

## Passo 10 — Ativar o GitHub Pages (publicar o site)

1. Na página do seu repositório, clique em **"Settings"** (aba no topo, ícone de engrenagem)
2. No menu esquerdo, role para baixo e clique em **"Pages"**
3. Em **"Source"**, clique no menu que diz **"None"** e selecione **"Deploy from a branch"**
4. Em **"Branch"**, clique no menu e selecione **"main"**
5. Na caixa ao lado, certifique-se que está selecionado **"/ (root)"**
6. Clique em **"Save"**
7. ⏳ Aguarde **1 a 2 minutos**
8. Atualize a página (F5)
9. Vai aparecer uma caixa verde com o endereço do seu site:
   **`https://seunome.github.io/encurtador`**

> Substitua `seunome` pelo seu nome de usuário do GitHub que você escolheu no Passo 6.

---

## Passo 11 — Testar o site

1. Clique no link que apareceu (ou copie e cole na barra do navegador)
2. O site deve abrir com o formulário verde/branco
3. Cole uma URL longa e clique em **"GERAR LINK"**
4. ✅ Se aparecer o link encurtado e o botão do WhatsApp, está funcionando!

---

---

# ❓ PROBLEMAS COMUNS

---

**"Erro ao salvar no banco"**
→ Volte ao Passo 5 e verifique se copiou corretamente a URL e a chave do Supabase
→ Verifique se colou no lugar certo no `config.js` (sem apagar as aspas `"`)

---

**O site abre mas está em branco ou com erro**
→ Verifique se fez upload de TODOS os arquivos (principalmente o `config.js`)
→ Pressione F12 no navegador → clique em "Console" para ver o erro

---

**O GitHub Pages não aparece depois de salvar**
→ Aguarde mais 2-3 minutos e atualize a página
→ Verifique se selecionou "main" e "/ (root)" corretamente

---

**O link encurtado não redireciona**
→ Certifique-se de que executou o SQL do Passo 4 com sucesso
→ Verifique se as políticas RLS foram criadas (no Supabase: Authentication → Policies)

---

# 📱 COMO USAR NO DIA A DIA

1. Acesse `https://seunome.github.io/encurtador`
2. Cole o link longo no campo
3. Clique em **"GERAR LINK"**
4. Clique em **"Compartilhar no WhatsApp"**
5. O WhatsApp vai abrir com a mensagem pronta — escolha o contato e envie!

---

# 🔄 COMO ATUALIZAR UM ARQUIVO NO FUTURO

Se precisar alterar algo (ex: mudar a mensagem do WhatsApp):

1. Edite o arquivo no seu computador
2. Acesse `https://github.com/seunome/encurtador`
3. Clique no arquivo que quer substituir
4. Clique no ícone de lápis ✏️ (editar)
5. Cole o novo conteúdo
6. Clique em **"Commit changes"**
7. Aguarde 1-2 minutos e o site atualiza automaticamente

---

*Guia criado para uso com Supabase + GitHub Pages — custo total: R$ 0,00/mês*
