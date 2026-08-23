# Verde — GCP, CI/CD e crescimento por fases

Documento de operação da loja (NestJS + Vite + Postgres). Começa no mínimo que sobe um ambiente e cresce até canary em produção, com a API **privada** e só o HTTPS da loja público.

Não implementa código. É o mapa do que criar, na ordem.

## 1. Objetivo

- Quem commita em `dev` vê o app em **DEV** depois do CI.
- Quem mergeia em `main` (PR + review) sobe **PRD**.
- O cliente na internet só fala com `https://loja…` (IP do Load Balancer). Nest e Postgres **não têm IP público**.
- O browser não chama a API por outro host: o JS usa `/api` no mesmo domínio; o load balancer encaminha para o Nest interno.

Isso importa porque o frontend é SPA: o código roda no **navegador**. Esconder o Nest da internet só funciona se o LB fizer proxy de `/api`.

## 2. Repositório hoje

| Pasta       | Papel                                                                                             |
| ----------- | ------------------------------------------------------------------------------------------------- |
| `frontend/` | Vite/React. `VITE_API_URL` hoje aponta para `http://localhost:3000`. Em GCP vira vazio ou `/api`. |
| `backend/`  | Nest. Cookie JWT, CSRF, CORS. `JWT_SECRET` com fallback só em não-produção.                       |
| `database/` | Postgres local (Docker). Em GCP vira Cloud SQL Private IP.                                        |

Dois projetos GCP isolam IAM, secret e banco. Não misturar DEV e PRD no mesmo projeto.

| Projeto GCP | Uso                                                  |
| ----------- | ---------------------------------------------------- |
| `verde-dev` | Integração. Hostname interno ou `dev.loja…` com IAP. |
| `verde-prd` | Produção. Único IP público da loja.                  |

Conta de faturamento única; projetos separados.

## 3. Estratégia de branches

```
feature/*  → PR →  dev   →  deploy automático DEV
dev        → PR + review →  main  →  canary PRD → aprovação → 100%
```

- `feature/*`: CI (lint, testes). Sem deploy (fase 1). Preview de PR é fase posterior.
- `dev`: protegida com CI verde. Push/merge dispara DEV.
- `main`: sem push direto. Review obrigatório. Merge dispara PRD.

O mesmo commit (SHA) que passou em DEV é a imagem que sobe em PRD. Não rebuildar “para produção”.

## 4. Arquitetura-alvo (quando estiver maduro)

```
Internet
    │
    │  443  (único IP público — HTTPS LB + Cloud Armor)
    ▼
HTTPS Load Balancer
    ├─ /*        → Cloud Storage + CDN   (SPA)
    └─ /api/*    → Cloud Run Nest        (ingress internal)
                        │
                        ├─ VPC connector
                        ├─ Cloud SQL Postgres (Private IP)
                        ├─ Secret Manager (JWT, DB)
                        └─ Cloud NAT (saída: e-mail, etc.)
```

Firewall mental:

- Internet → só `:443` no LB.
- LB → Nest `:8080` (interno).
- Nest → Cloud SQL `:5432` e, se houver, Memorystore.
- Nada de `:22` / `:5432` / Nest na internet.
- Operação humana: IAP ou Cloud SQL Auth Proxy, nunca Postgres público.

Cookie: mesmo site (`loja` + `/api`) → `Secure`, `SameSite=Lax`, CSRF como já está no Nest. CORS de origens diferentes some em produção.

## 5. Recursos GCP por fase

Criar só o da fase atual. A lista completa é o destino, não o dia 1.

### Sempre (DEV e PRD, quando o ambiente existir)

| Recurso                           | Para quê                                                                                      |
| --------------------------------- | --------------------------------------------------------------------------------------------- |
| Projeto GCP + APIs                | `run`, `sqladmin`, `secretmanager`, `iam`, `artifactregistry`, `compute`, `servicenetworking` |
| Artifact Registry                 | Imagem Docker do Nest (`verde/api`)                                                           |
| Secret Manager                    | `JWT_SECRET`, `DATABASE_PASSWORD` (e depois SMTP)                                             |
| Service account de deploy         | Usada pelo GitHub via Workload Identity Federation (sem JSON no repo)                         |
| Workload Identity Pool + Provider | OIDC GitHub Actions → GCP                                                                     |

### Rede (a partir da fase em que o Nest não é público)

| Recurso                           | Para quê                              |
| --------------------------------- | ------------------------------------- |
| VPC + subnet                      | Backend e SQL                         |
| Private Service Connection        | IP privado do Cloud SQL               |
| Serverless VPC Access (connector) | Cloud Run chega no SQL                |
| Cloud NAT                         | Nest sai para internet sem IP público |
| Cloud DNS (opcional no começo)    | `dev.` e apex da loja                 |

### App

| Recurso                           | Para quê                                                                |
| --------------------------------- | ----------------------------------------------------------------------- |
| Cloud Run `api`                   | Nest. DEV pode até ser `ingress=all` no começo; PRD `ingress=internal`. |
| Cloud Storage bucket              | `dist/` do Vite                                                         |
| HTTPS Load Balancer               | URL map `/*` bucket, `/api/*` Cloud Run                                 |
| Certificado gerenciado            | HTTPS                                                                   |
| Cloud Armor                       | WAF + rate limit (login) — depois do LB existir                         |
| Cloud SQL Postgres                | Banco. DEV: `db-f1-micro`. PRD: HA quando o tráfego pedir.              |
| Cloud Run Job `migrate` (fase 3+) | TypeORM migrate na VPC, disparado pelo pipeline                         |

### Depois (crescimento)

| Recurso                      | Para quê                                             |
| ---------------------------- | ---------------------------------------------------- |
| Memorystore Redis            | Pub/sub in-process já não basta (várias instâncias)  |
| Pub/Sub                      | E-mail / “pedido atualizado” desacoplado do checkout |
| IAP                          | Travar `dev.loja…` em contas Google da equipe        |
| Error Reporting / Monitoring | Alertar 5xx no canary                                |
| VPC Service Controls         | Perímetro em SQL + Secret Manager                    |

Não usar GKE no início. Cloud Run cobre Nest + canary (`update-traffic`).

## 6. CI e CD

Arquivos a criar quando for a hora (não precisam existir na fase 0):

| Workflow                           | Gatilho                 | Faz                                                                                                         |
| ---------------------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------- |
| `.github/workflows/ci.yml`         | PR para `dev` ou `main` | `frontend`: build/`tsc`. `backend`: lint + jest.                                                            |
| `.github/workflows/deploy-dev.yml` | Push em `dev`           | Build imagem `$SHA`, push Registry, deploy Cloud Run DEV, upload SPA DEV, migrate DEV.                      |
| `.github/workflows/deploy-prd.yml` | Push em `main`          | Reusa a **mesma** imagem `$SHA`. Canary 10% → job `promote` com environment `production` (reviewer) → 100%. |

Autenticação: **Workload Identity Federation**. Nunca `GCP_SA_KEY` em secret de longa duração.

GitHub Environments:

| Environment  | Branch | Proteção                            |
| ------------ | ------ | ----------------------------------- |
| `dev`        | `dev`  | opcional                            |
| `production` | `main` | required reviewers no job `promote` |

Há dois “reviews”: o PR (código) e o Environment (cortar tráfego em PRD). Os dois valem.

### Variáveis

**DEV**

- `CORS_ORIGIN` só se ainda houver origem cruzada; com proxy `/api`, pode ficar vazio / same-origin.
- `DATABASE_SYNC=true` aceitável só em DEV.
- `JWT_SECRET` no Secret Manager (pode ser fraco em DEV; em PRD o Nest recusa `verde-dev-jwt`).

**PRD**

- `JWT_SECRET` forte, único, sem fallback.
- `DATABASE_SYNC=false`.
- `VITE_API_URL` vazio → frontend chama `/api`.
- Cookie `Secure`.

O frontend **não** recebe JWT. Só URL pública.

## 7. Deploy: simples → canary

### Frontend (SPA)

Blue-green por objeto/prefixo: upload `dist/` em `releases/$SHA/`, depois o `index.html` (ou o backend do LB) aponta para essa revisão. Rollback = apontar o `index.html` de volta. Invalidar CDN só no HTML.

Canary percentual em JS estático + CDN é frágil. **API = canary; frontend = blue-green.**

### Backend (Cloud Run)

```bash
# nova revisão, ainda sem tráfego
gcloud run deploy api --image …:$SHA --no-traffic --tag canary --ingress internal

# fase 4: 10%
gcloud run services update-traffic api --to-revisions REV_STABLE=90,REV_CANARY=10

# promote
gcloud run services update-traffic api --to-latest
```

Rollback: 100% na revisão anterior. Sem rebuild.

### Banco (o que quebra canary)

Enquanto 10% e 90% rodam juntos, a migration tem que ser **compatível com os dois binários** (expand/contract: coluna nova nullable → deploy → preencher → NOT NULL depois).

Ordem em PRD: migrate expand → canary API → 100% → (release seguinte) contract.

DEV pode `synchronize` ou migrate automático. PRD nunca `synchronize`.

## 8. Passo a passo (crescer devagar)

Cada fase termina quando o critério de pronto estiver verdadeiro. Não pular para canary sem CI e sem DEV estável.

### Fase 0 — Repo e qualidade (esta semana)

**Fazer**

- Branch `dev` e `main`.
- Protection em `main`: PR + 1 reviewer + CI.
- `ci.yml`: install, `backend` test, `frontend` build.
- README apontando este doc.

**Ainda não:** GCP pago, Docker de produção, domínio.

**Pronto quando:** PR vermelho não mergeia.

### Fase 1 — DEV mínimo (primeiro ambiente)

Objetivo: `git push` em `dev` → URL que a equipe abre.

**GCP (**`verde-dev`**)**

1. Projeto + APIs.
2. Artifact Registry.
3. Secret Manager (`JWT_SECRET`, senha do banco).
4. Cloud SQL Postgres (pode ter IP público **só nesta fase**, autorizado ao Cloud Run / seu IP; anotar para remover).
5. Cloud Run `api` `ingress=all`, variáveis apontando ao SQL, secrets montados.
6. Bucket + site estático **ou** o próprio Cloud Run servindo SPA atrás (aceitável só em DEV).
7. `VITE_API_URL` = URL pública do Cloud Run DEV (ainda CORS). Ajustar `CORS_ORIGIN`.

**GitHub**

- WIF ligado ao SA `github-dev@verde-dev`.
- `deploy-dev.yml`.

**App**

- `DATABASE_SYNC=true` ok.
- Seed (Ana/Bruno) só em DEV.

**Pronto quando:** login, catálogo, pedido funcionam em DEV após um merge em `dev`.

### Fase 2 — Um hostname e API atrás do proxy (fecha o modelo de rede)

Objetivo: browser só conhece `https://dev.loja…`.

**GCP**

1. VPC, Private IP no SQL, **desligar IP público do SQL**.
2. VPC connector no Cloud Run; `ingress=internal` (só o LB chega).
3. HTTPS LB: `/*` → bucket, `/api/*` → Cloud Run.
4. Certificado gerenciado. DNS `dev`.
5. Frontend build com `VITE_API_URL=` (relative `/api`). O LB reescreve `/api` → Nest sem o prefixo, ou o Nest ganha um `globalPrefix` `api` — escolher **um** e documentar no workflow.

**Segurança**

- Cookie same-site.
- IAP no LB de DEV (opcional, recomendado).

**Pronto quando:** DevTools não mostra host de API diferente; SQL inacessível da internet.

### Fase 3 — PRD igual ao DEV, corte 100% (blue-green simples)

Objetivo: loja no ar, rollback = revisão anterior.

**GCP (**`verde-prd`**)** — copiar fase 2, sem atalhos:

- SQL sem IP público, sem `synchronize`.
- `JWT_SECRET` forte (o app recusa `verde-dev-jwt` se `NODE_ENV=production`).
- Cloud Armor básico (rate limit `/api/auth/login`).
- Cloud NAT se precisar de saída.
- Sem seed de senha demo em PRD.

**GitHub**

- `deploy-prd.yml`: deploy revisão nova → smoke (`GET /products`, `/auth/csrf`) → tráfego 100%.
- Environment `production` com reviewer (mesmo no corte 100%).

**Migrations:** job na VPC **antes** do apontar tráfego. Primeira migration = schema atual exportado do DEV.

**Pronto quando:** um release em `main` atualiza a loja; rollback testado uma vez.

### Fase 4 — Canary na API

Objetivo: 10% do tráfego na revisão nova; humano promove.

**Fazer**

- Traffic split 90/10.
- Alertas 5xx / latência no Cloud Monitoring na revisão `canary`.
- Job `promote` separado (required reviewers).
- Migrations só expand nesta fase.

**Frontend:** continua blue-green (HTML novo de uma vez).

**Pronto quando:** um rollback de canary foi ensaiado (forçar 5xx de teste ou só o comando de traffic).

### Fase 5 — Crescimento (quando a loja pedir)

Ordem sugerida, uma de cada vez:

1. **Eventos de pedido** (`order.placed`, `order.status_changed`) com EventEmitter no Nest — e-mail / preferências que hoje não enviam nada.
2. **Pub/Sub ou Redis** se houver mais de uma instância Cloud Run e o in-process não alcançar.
3. **Cloud SQL HA** + backups automáticos + retenção.
4. **Preview environments** por PR (Cloud Run tag + bucket `pr-$N`) — caro; só com equipe maior.
5. **VPC-SC**, Error Reporting, uptime check no LB.
6. **IAP** em rotas admin se o JWT da loja não bastar para o painel interno.

## 9. Checklist de segurança (não negociar em PRD)

- [ ] Nest sem IP público; SQL sem IP público.
- [ ] Único 443 público = LB da loja.
- [ ] `JWT_SECRET` no Secret Manager, não no Git, não `verde-dev-jwt`.
- [ ] Sem chave JSON de GCP no GitHub; só WIF.
- [ ] `DATABASE_SYNC=false`.
- [ ] Cookie `Secure` + CSRF (já no código).
- [ ] Cloud Armor no login.
- [ ] Sem `/users` admin exposto sem papel `admin`.
- [ ] Backup SQL + teste de restore (pelo menos uma vez).
- [ ] SSH/IAP, nunca `0.0.0.0/0` na 22.

## 10. Custos (ordem de grandeza, para não surpreender)

Fase 1 (DEV pequeno): Cloud Run (quase zero parado) + SQL `f1-micro` + Registry. Dezenas de dólares/mês.

Fase 2–3: LB + IP forwarding + certificado + NAT pesam mais que o Run. É o preço da rede “só o frontend público”.

Canary não duplica SQL. Duplica revisão Cloud Run (barato). SQL HA em PRD é o salto caro — deixar para fase 5.

## 11. Decisões já tomadas (para não reabrir)

| Tema                  | Decisão                                    |
| --------------------- | ------------------------------------------ |
| Orquestrador          | Cloud Run, não GKE no início               |
| Tráfego API PRD       | Canary (fase 4); blue-green 100% na fase 3 |
| Tráfego SPA           | Blue-green                                 |
| Projetos              | `verde-dev` e `verde-prd`                  |
| Identidade CI         | WIF, não JSON                              |
| Imagem PRD            | Mesmo SHA de DEV                           |
| Banco PRD             | Private IP, migrate expand/contract        |
| URL da API no browser | Same-origin `/api` a partir da fase 2      |
| Pub/sub               | Depois do checkout estável (fase 5)        |

## 12. Próxima ação concreta

1. Criar `dev` / proteger `main`.
2. Fase 0: `ci.yml`.
3. Só então projeto `verde-dev` e fase 1.

Pub/sub, Armor avançado e canary ficam no backlog até DEV estar chato de tão previsível.
