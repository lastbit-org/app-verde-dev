# Backend

API NestJS do ecommerce. Dados em memória, sem banco nesta entrega.

## Setup

```bash
npm install
npm run start:dev
```

Servidor em `http://localhost:3000`.

## Users

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/users` | Lista usuários |
| GET | `/users/:id` | Busca por id |
| POST | `/users` | Cria usuário (`name`, `email`) |

```json
{ "id": 1, "name": "Ana Silva", "email": "ana@example.com" }
```
