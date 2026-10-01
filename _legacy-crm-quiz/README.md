# CRM Quiz Funnel

Esta é uma landing page em formato de quiz interativo (funil) construída com Next.js 14, Tailwind CSS e TypeScript. Ela foi desenhada para atuar como frontend de captura de leads para um CRM low-ticket, com rastreamento completo de Meta Ads (Pixel Client-Side + Conversions API Server-Side).

## 🚀 Como iniciar o projeto

Como o projeto base foi gerado manualmente para facilitar a integração no seu repositório:

1. Instale as dependências:
\`\`\`bash
npm install
\`\`\`

2. Inicie o servidor de desenvolvimento:
\`\`\`bash
npm run dev
\`\`\`

3. Acesse `http://localhost:3000/quiz` no seu navegador.

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

\`\`\`env
# O ID do seu Pixel no Gerenciador de Eventos da Meta
NEXT_PUBLIC_META_PIXEL_ID=SEU_PIXEL_ID
META_PIXEL_ID=SEU_PIXEL_ID

# Token da Conversions API (Gerado nas configurações do Pixel > API de Conversões > Gerar Token de Acesso)
META_CAPI_ACCESS_TOKEN=SEU_TOKEN_AQUI

# A URL do Webhook do seu CRM (onde os leads capturados no final do quiz serão enviados)
CRM_WEBHOOK_URL=https://seu-crm.com/api/public/leads
\`\`\`

## 📊 Rastreamento e Eventos (Meta Ads)

O funil está instrumentado para enviar dados precisos para o Meta Ads, incluindo deduplicação automática via `event_id`. 

- **PageView**: Disparado ao acessar a página.
- **ViewContent**: Disparado a cada resposta do quiz. Envia o parâmetro `question_number`.
- **Lead**: Disparado assim que o formulário de captura é enviado. Este evento é enviado de duas formas:
  1. Pelo Navegador (Client-side Pixel)
  2. Pelo Servidor (CAPI) - com os dados do usuário (e-mail/telefone) em hash SHA-256.
- **InitiateCheckout**: Disparado quando o usuário clica no botão "Quero Assinar Agora" na tela de resultados.

Além disso, parâmetros UTM e `fbclid` presentes na URL de entrada são capturados e persistidos via LocalStorage, sendo enviados junto com o payload do Lead para o seu webhook.

## 🧪 Como testar os eventos

1. Instale a extensão **Meta Pixel Helper** no Chrome para validar os disparos no navegador.
2. Acesse a aba **Gerenciador de Eventos** no painel da Meta > Fontes de Dados > Seu Pixel > **Testar Eventos**.
3. Pegue o código de teste (ex: `TEST54321`) e adicione nos payloads do arquivo `app/api/capi/route.ts` durante seus testes (caso queira forçar o modo de teste na CAPI).
4. Preencha o Quiz e veja os eventos chegando tanto via Navegador quanto via Servidor no Gerenciador da Meta.
5. Verifique a coluna de "Deduplicação" no painel para confirmar que os eventos Server/Browser de mesmo `event_id` estão sendo agrupados.

## 🎨 Estilização

As cores principais (Granola e Terracota) estão configuradas em `tailwind.config.ts`. Modifique as chaves lá caso deseje alterar a paleta base do projeto.
