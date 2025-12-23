# Catálogo Elétrico

Aplicativo de catálogo digital para motos elétricas, desenvolvido com Next.js, Prisma e Supabase (PostgreSQL).

## Pré-requisitos

- Node.js
- NPM ou Yarn
- Conta no Supabase (configurada no arquivo `.env`)

## Configuração

1.  Instale as dependências:
    ```bash
    npm install
    ```

2.  Configure as variáveis de ambiente no arquivo `.env`:
    ```env
    DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres"
    ```

3.  Prepare o banco de dados:
    ```bash
    npx prisma db push
    npx prisma db seed
    ```

## Executando

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Estrutura

- `app/`: Páginas e rotas da aplicação (Next.js App Router).
- `components/`: Componentes React reutilizáveis.
- `lib/`: Utilitários e configurações.
- `prisma/`: Schema do banco de dados e migrações.
- `scripts/`: Scripts auxiliares (ex: seed do banco).
