# CRM Imobiliário — Oliveira Soluções Imobiliária

Aplicação inicial Next.js + Supabase para o projeto Supabase já criado.

## Funcionalidades da versão inicial

- Login privado com Supabase Auth; perfil administrador existente.
- Painel com totais de imóveis, clientes, negociações e atendimentos.
- Cadastro/edição/exclusão de imóveis, clientes, negociações, atendimentos e comissões.
- Cálculo demonstrativo de 40% para distribuição e 60% para patrimônio com base no valor recebido cadastrado.
- Upload privado para o bucket `arquivos-imoveis` por UUID de imóvel, com links assinados temporários.
- Convite de novos corretores pelo painel, usando uma rota de servidor que valida o administrador.

## Implantação

1. Instale Node.js 20 ou superior e execute `npm install`.
2. Copie `.env.example` para `.env.local` e preencha as variáveis pelo painel do Supabase.
3. Em **Project Settings → API Keys**, obtenha a URL do projeto e a chave pública (publishable/anon). A variável `SUPABASE_SERVICE_ROLE_KEY` é **secreta** e deve ser configurada apenas no servidor. Nunca use `NEXT_PUBLIC_` nessa chave.
4. Execute `npm run dev` e abra `http://localhost:3000` para testar.
5. Coloque o código em um repositório GitHub **privado** e importe na Vercel como projeto Next.js.
6. Em **Vercel → Project → Settings → Environment Variables**, configure as mesmas variáveis; `NEXT_PUBLIC_SITE_URL` deve conter a URL pública exata do CRM, por exemplo `https://seu-projeto.vercel.app`.
7. Em **Supabase → Authentication → URL Configuration**, configure Site URL e Redirect URLs para o domínio do CRM. Em produção configure SMTP confiável para convites.
8. Faça deploy e teste login, permissões, operações CRUD e arquivos antes de incluir dados reais.

## Atenções de segurança

- O SQL das seis tabelas e as políticas RLS fornecidas anteriormente devem estar instalados.
- As políticas de Storage devem ter sido aplicadas no bucket privado.
- A chave de serviço fica exclusivamente no servidor e nas variáveis secretas da Vercel.
- O administrador deve testar uma conta de corretor antes de permitir acesso real.
- Convites dependem da configuração de SMTP e de redirecionamento de autenticação. A tela de redefinição/definição de senha por convite ainda precisa ser implementada e testada antes de usar o convite com usuários reais.
- O modelo financeiro atual é ilustrativo, não é contabilidade nem cálculo de comissão líquida após tributos/despesas.
- Faltam módulos completos de despesas, autorizações de venda, histórico de auditoria, seleção amigável de relacionamentos, controle de financiamento detalhado e backups operacionais.
- O plano Free serve para testes; valide limites, backups e adequação do plano para produção.

## Estrutura

- `app/page.tsx`: interface do CRM
- `app/api/invite/route.ts`: convite autenticado para corretores
- `lib/supabase.ts`: cliente Supabase
- `.env.example`: exemplo de variáveis de ambiente
