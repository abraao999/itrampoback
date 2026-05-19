# Itrampo Backend

Backend em Next.js para o projeto Itrampo, usando MongoDB com Mongoose.

## Como rodar

1. Instale as dependencias:

```bash
npm install
```

2. Crie o arquivo `.env.local` a partir do exemplo:

```bash
cp .env.example .env.local
```

3. Configure a variavel `MONGODB_URI` no `.env.local`.

4. Rode o servidor:

```bash
npm run dev
```

O backend sobe em `http://localhost:3001`.

## Rotas iniciais

- `GET /api/health`: verifica se a API esta no ar.
- `GET /api/services`: lista servicos cadastrados e cria a lista inicial se estiver vazia.
- `POST /api/services`: cria um servico.
- `GET /api/specialties`: lista especialidades cadastradas e cria a lista inicial se estiver vazia.
- `POST /api/specialties`: cria uma especialidade.
- `GET /api/appointments`: lista agendamentos.
- `POST /api/appointments`: cria um agendamento.
# itrampoback
