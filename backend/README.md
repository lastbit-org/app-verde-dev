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
| POST | `/users/login` | Login por e-mail |

```json
{ "id": 1, "name": "Ana Silva", "email": "ana@example.com" }
```

## Products

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/products` | Lista produtos |
| GET | `/products/:id` | Busca por id |
| POST | `/products` | Cria produto (`name`, `price`, `image`) |

```json
{
  "id": 1,
  "name": "Oliveira em vaso sage",
  "price": 248,
  "image": { "url": "https://picsum.photos/seed/oliveira/600/800", "name": "oliveira-vaso-sage.jpg" }
}
```
