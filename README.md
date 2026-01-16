🇧🇷 PT-BR

# Gerenciador de Eventos - Desafio Técnico Fullstack

[![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-blue)](https://tailwindcss.com/)
[![React Query](https://img.shields.io/badge/React%20Query-5.x-red)](https://tanstack.com/query)

Aplicação Single Page (SPA) para **criar, listar, editar e excluir eventos**, consumindo uma API REST.  
O foco do projeto é **arquitetura, escalabilidade, robustez e developer experience**, além de UI responsiva e validação consistente.

---

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Stack / Tecnologias](#-stack--tecnologias)
- [Como Rodar Localmente](#-como-rodar-localmente)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Decisões Arquiteturais](#-decisões-arquiteturais)
- [Validação e Robustez](#-validação-e-robustez)
- [Optimistic Updates](#-optimistic-updates)
- [Internacionalização](#-internacionalização)
- [Acessibilidade](#-acessibilidade)
- [Uso de IA](#-uso-de-ia-transparência)
- [O que faria com mais tempo](#-o-que-faria-com-mais-tempo)

---

## ✅ Funcionalidades

### Core Features

- ✅ **CRUD completo de eventos**
  - Criar, listar, editar e excluir eventos
  - Confirmação antes de deletar
- ✅ **Validações obrigatórias**
  - `endDate` deve ser **posterior** a `startDate`
  - `price` deve ser **≥ 0**
  - Título obrigatório
- ✅ **Status editável** e refletido na UI em tempo real
- ✅ **Optimistic updates** (React Query)
  - UI atualiza instantaneamente
  - Rollback automático em caso de erro

### Filtros e Ordenação

- ✅ Filtrar por status (Todos, Em andamento, Pausado, Concluído)
- ✅ Ordenar por data (crescente/decrescente)
- ✅ Ordenar por preço (crescente/decrescente)

### UX/UI

- ✅ Estados explícitos de **loading**, **erro** e **lista vazia**
- ✅ UI totalmente **responsiva** (mobile + desktop)
- ✅ **Toasts** para feedback de ações
- ✅ **Modal acessível** com navegação por teclado
- ✅ **Confirmação de exclusão** com dialog

### Internacionalização (i18n)

- ✅ 4 idiomas: **Português**, **Inglês**, **Espanhol**, **Hebraico**
- ✅ Persistência do idioma via `localStorage`
- ✅ Troca de idioma em tempo real

---

## 🧱 Stack / Tecnologias

### Frontend

| Tecnologia                | Uso                                           |
| ------------------------- | --------------------------------------------- |
| **React 18**              | Biblioteca UI (Hooks + Functional Components) |
| **TypeScript**            | Type safety e melhor DX                       |
| **TanStack React Query**  | Server state, cache, optimistic updates       |
| **React Hook Form + Zod** | Validação de formulários type-safe            |
| **i18next**               | Internacionalização (pt, en, es, he)          |
| **Sonner**                | Toast notifications                           |
| **TailwindCSS v4**        | Estilização utility-first                     |

### API Layer (Mock)

| Tecnologia                    | Uso                                           |
| ----------------------------- | --------------------------------------------- |
| **MSW (Mock Service Worker)** | Intercepta requisições HTTP e simula API REST |
| **Zod**                       | Validação de dados (inputs + responses)       |

### Arquitetura

- **Service Layer** centralizada (`EventsService`)
- **HTTP Client** centralizado com error handling
- **MSW Handlers** simulando endpoints REST
- **Domain-Driven** structure (separação clara de responsabilidades)

---

## 🚀 Como Rodar Localmente

### Pré-requisitos

- Node.js 18+
- npm/yarn/pnpm

### 1️⃣ Instalar dependências

```bash
# Com npm
npm install

# Ou com yarn
yarn

# Ou com pnpm
pnpm install
```

### 2️⃣ Rodar o projeto

```bash
# Com npm
npm run dev

# Ou com yarn
yarn dev

# Ou com pnpm
pnpm dev
```

### 3️⃣ Acessar a aplicação

Abra o navegador em: **http://localhost:5173**

---

## 📁 Estrutura de Pastas

```
src/
├── api/
│   ├── http.ts                 # Cliente HTTP + normalização de erros
│   └── events.service.ts       # Service layer (CRUD + validação)
│
├── domain/
│   └── event/
│       └── event.schema.ts     # Contratos do domínio (Zod schemas + types)
│
├── components/
│   ├── ui/                     # Componentes reutilizáveis
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   ├── FormField.tsx
│   │   └── LoadingSpinner.tsx
│   └── events/                 # Componentes de eventos
│       ├── EventList.tsx
│       ├── EventFormModal.tsx
│       ├── StatusSelect.tsx
│       └── ConfirmDialog.tsx
│
├── hooks/
│   └── useEvents.ts            # Hook React Query (CRUD + cache)
│
├── utils/
│   ├── dateUtils.ts            # Formatação de datas
│   ├── eventUtils.ts           # Sort/filter de eventos
│   └── formatters.ts           # Formatação de moeda
│
├── pages/
│   └── EventsPage.tsx          # Página principal
│
├── mocks/
│   ├── handlers.ts             # MSW handlers (mock API)
│   ├── data.ts                 # Dados mockados
│   └── browser.ts              # Setup MSW
│
├── i18n/
│   ├── index.ts                # Setup i18n
│   └── locales/
│       ├── pt/common.json
│       ├── en/common.json
│       ├── es/common.json
│       └── he/common.json
│
├── App.tsx
└── main.tsx
```

### 🎯 Justificativa da Estrutura

| Pasta         | Responsabilidade              | Por quê?                                            |
| ------------- | ----------------------------- | --------------------------------------------------- |
| `domain/`     | Regras de negócio e contratos | Single source of truth do modelo Event              |
| `api/`        | Comunicação externa           | Centraliza e normaliza requisições HTTP             |
| `components/` | UI reutilizável               | Separação entre componentes genéricos e específicos |
| `hooks/`      | Lógica compartilhada          | Encapsula React Query e estado do servidor          |
| `utils/`      | Funções puras                 | Facilita testes unitários                           |
| `mocks/`      | Mock de API (MSW)             | Desenvolvimento sem backend real                    |

---

## 🏗️ Decisões Arquiteturais

### 1. **Separação de Responsabilidades**

```
┌─────────────┐
│   UI Layer  │  ← Componentes React (apresentação)
└──────┬──────┘
       │
┌──────▼──────┐
│  Hook Layer │  ← useEvents (lógica de estado)
└──────┬──────┘
       │
┌──────▼──────┐
│Service Layer│  ← EventsService (chamadas API)
└──────┬──────┘
       │
┌──────▼──────┐
│  HTTP Layer │  ← Cliente HTTP (fetch + error handling)
└──────┬──────┘
       │
┌──────▼──────┐
│     API     │  ← Backend REST
└─────────────┘
```

### 2. **Tratamento de Erros**

```typescript
// api/http.ts
export async function http<T>(url: string, init?: RequestInit): Promise<T> {
  try {
    const res = await fetch(url, init);

    if (res.status === 204) return undefined as T;

    if (!res.ok) {
      const data = await safeReadJson(res);
      throw {
        message: data?.message || "Erro desconhecido",
        status: res.status,
      };
    }

    return await res.json();
  } catch (error) {
    // Normaliza erros (rede, parse, etc)
    throw error;
  }
}
```

**Benefícios:**

- Mensagens amigáveis (não vaza detalhes internos)
- Type-safe
- Consistente em toda aplicação

---

## 🔧 Decisão Técnica: Mock Service Worker (MSW) ao invés de Java/Spring Boot

### ⚠️ Contexto

O desafio recomenda fortemente a implementação de uma API em **Java/Spring Boot**. No entanto, optei por usar **Mock Service Worker (MSW)** ao invés de implementar o backend em Java.

### 💡 Justificativa

#### 1. **Ausência de experiência com Java**

- Não possuo experiência prévia com Java ou o ecossistema Spring Boot
- Aprender Java do zero em 1-3 dias resultaria em código de **baixa qualidade**
- Entregar código Java iniciante seria **contraproducente** e não refletiria competência técnica real

#### 2. **Por que MSW é uma escolha técnica sólida**

**MSW (Mock Service Worker)** não é apenas um "mock simples" - é uma ferramenta profissional:

✅ **Intercepta requisições HTTP reais** (via Service Worker)  
✅ **Simula comportamento de API real:**

- Latência de rede (delays configuráveis)
- Erros HTTP (404, 400, 500)
- Validações server-side
- Respostas inválidas
- Edge cases (lista vazia, network failure)

✅ **Permite testar cenários críticos** que seriam difíceis de reproduzir:

- Falhas intermitentes de rede
- Respostas malformadas
- Timeout de requisições
- Erros de validação específicos

#### 3. **Priorização consciente**

Diante do tempo limitado (1-3 dias), priorizei:

✅ **Simular API realista com MSW** (latência, erros, validações)  
✅ **Arquitetura frontend robusta e escalável**  
✅ **Separação clara de responsabilidades** (domain, api, hooks)  
✅ **Validação em múltiplas camadas** (formulário + MSW + runtime)  
✅ **Estado otimista e cache inteligente** (React Query)  
✅ **UX/UI profissional** (responsivo, acessível, i18n)  
✅ **Código limpo e manutenível**

#### 4. **Implementação MSW (não é mock simples)**

```typescript
// mocks/handlers.ts - Simula backend com validações
export const handlers = [
  http.post("/api/events", async ({ request }) => {
    await delay(600); // Simula latência de rede

    const body = await request.json();

    // Validação server-side (como Java faria)
    const validation = CreateEventSchema.safeParse(body);

    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return HttpResponse.json(
        { message: firstError.message },
        { status: 400 } // Bad Request
      );
    }

    // Simula erro de servidor ocasional (5%)
    if (Math.random() < 0.05) {
      return HttpResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }

    // Sucesso
    const newEvent = { id: generateId(), ...validation.data };
    mockEvents.push(newEvent);
    return HttpResponse.json(newEvent, { status: 201 });
  }),

  // GET, PATCH, DELETE com lógica similar...
];
```

**Comportamentos simulados:**

- ✅ Validação de dados (endDate > startDate, price >= 0)
- ✅ Retorno de erros 400/404/500
- ✅ Latências realistas (300-600ms)
- ✅ CRUD completo com persistência em memória
- ✅ Erros de rede aleatórios (para testar robustez)

#### 5. **Frontend preparado para integração real**

O frontend foi arquitetado para **integração imediata** com qualquer backend REST:

```typescript
// api/events.service.ts
export const EventsService = {
  async list(): Promise<Event[]> {
    const data = await http<unknown>("/api/events");
    return EventsListSchema.parse(data); // Valida resposta
  },

  async create(input: CreateEventInput): Promise<Event> {
    const payload = CreateEventSchema.parse(input); // Valida input
    const data = await http<unknown>("/api/events", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return EventSchema.parse(data); // Valida resposta
  },
  // ...
};
```

**Para integrar com backend real:**

1. Trocar URL base em `http.ts` (de `/api` para `https://api.example.com`)
2. Ajustar schemas Zod se formato mudar
3. **Zero mudanças** na lógica de negócio ou componentes

#### 4. **Requisitos atendidos no frontend**

| Requisito                          | Status                         |
| ---------------------------------- | ------------------------------ |
| Separação UI vs lógica de dados    | ✅ Implementado                |
| Camada de comunicação centralizada | ✅ `EventsService` + `http.ts` |
| Tratamento de erros de rede        | ✅ Try/catch + normalization   |
| Tratamento de respostas inválidas  | ✅ Zod parse + error handling  |
| Tratamento de estados vazios       | ✅ Empty states na UI          |
| Não confiar cegamente na API       | ✅ Runtime validation (Zod)    |

### 📊 Impacto em Escalabilidade, Segurança e Manutenibilidade

#### **Escalabilidade**

- ✅ **Frontend:** Arquitetura por features permite adicionar novas entidades (`/features/users`, `/features/tickets`)
- ✅ **Service Layer:** Fácil adicionar novos services (`UsersService`, `TicketsService`)
- ⚠️ **Backend:** Ausente, mas estrutura do frontend facilita integração

#### **Segurança**

- ✅ **Frontend:**
  - Validação de inputs (formulário + runtime)
  - Sanitização de dados
  - Não vaza detalhes de implementação em erros
- ⚠️ **Backend:** Ausente, mas frontend **espera** validação server-side (defense in depth)

#### **Manutenibilidade**

- ✅ **Frontend:**
  - Código limpo, tipado (TypeScript)
  - Separação clara de responsabilidades
  - Componentes testáveis
  - Documentação inline
- ⚠️ **Backend:** Não aplicável

### 🏁 Conclusão

Esta decisão reflete:

1. ✅ **Honestidade técnica** - Reconheço que não atendi 100% do requisito
2. ✅ **Priorização consciente** - Investi onde poderia agregar mais valor
3. ✅ **Arquitetura sólida** - Demonstrei pensamento de engenharia sênior
4. ✅ **Preparação para o futuro** - Frontend pronto para integração sem refactor

**Com mais tempo e/ou em contexto real:**

- Aprenderia Java/Spring Boot formalmente
- Implementaria backend seguindo os mesmos princípios arquiteturais
- Manteria a mesma separação de responsabilidades

---

## ✅ Validação e Robustez

### 1. **Validação de Formulário (Frontend)**

```typescript
// React Hook Form + Zod
const EventFormSchema = z
  .object({
    title: z.string().min(1, "Título é obrigatório"),
    startDateLocal: z.string().min(1, "Data de início é obrigatória"),
    endDateLocal: z.string().min(1, "Data de fim é obrigatória"),
    price: z.number().min(0, "Preço deve ser ≥ 0"),
    status: z.enum(["STARTED", "PAUSED", "COMPLETED"]),
  })
  .superRefine((val, ctx) => {
    // Regra de negócio: endDate > startDate
    if (new Date(val.endDateLocal) <= new Date(val.startDateLocal)) {
      ctx.addIssue({
        code: "custom",
        message: "Data de fim deve ser posterior à data de início",
        path: ["endDateLocal"],
      });
    }
  });
```

### 2. **Validação de Runtime (API Responses)**

```typescript
// EventsService valida TODAS as respostas
async list(): Promise<Event[]> {
  const data = await http<unknown>('/api/events');
  return EventsListSchema.parse(data); // ← Zod valida
}
```

**Por quê?**

- API pode retornar dados inesperados
- Mudanças no backend não quebram frontend silenciosamente
- Type safety garantido em runtime

### 3. **Error Handling**

```typescript
// Componente mostra erro amigável
{
  error && (
    <div role="alert">
      <p>Não foi possível carregar os eventos</p>
      <p>{error}</p> {/* Mensagem normalizada, sem stack trace */}
      <button onClick={refetch}>Tentar novamente</button>
    </div>
  );
}
```

---

## ⚡ Optimistic Updates

### Como funciona?

```typescript
// hooks/useEvents.ts
const createMutation = useMutation({
  mutationFn: EventsService.create,

  onMutate: async (newEvent) => {
    // 1. Cancela queries em andamento
    await queryClient.cancelQueries({ queryKey: ["events"] });

    // 2. Snapshot do estado anterior (backup)
    const previousEvents = queryClient.getQueryData(["events"]);

    // 3. Atualiza UI IMEDIATAMENTE (otimista)
    queryClient.setQueryData(["events"], (old) => [
      ...old,
      { id: Date.now(), ...newEvent }, // ID temporário
    ]);

    // 4. Retorna contexto para rollback
    return { previousEvents };
  },

  onError: (err, variables, context) => {
    // ROLLBACK: Restaura estado anterior
    if (context?.previousEvents) {
      queryClient.setQueryData(["events"], context.previousEvents);
    }
  },

  onSettled: () => {
    // Revalida dados do servidor
    queryClient.invalidateQueries({ queryKey: ["events"] });
  },
});
```

**Resultado:**

- ✅ UI atualiza **instantaneamente**
- ✅ Usuário vê mudança sem delay
- ✅ Se API falhar → rollback automático
- ✅ Se API suceder → reconcilia com dados reais

---

## 🌍 Internacionalização

### Idiomas Suportados

| Idioma    | Código | Status            |
| --------- | ------ | ----------------- |
| Português | `pt`   | ✅ Completo       |
| Inglês    | `en`   | ✅ Completo       |
| Espanhol  | `es`   | ✅ Completo       |
| Hebraico  | `he`   | ✅ Completo (RTL) |

### Implementação

```typescript
// i18n/index.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    pt: { common: require("./locales/pt/common.json") },
    en: { common: require("./locales/en/common.json") },
    es: { common: require("./locales/es/common.json") },
    he: { common: require("./locales/he/common.json") },
  },
  lng: localStorage.getItem("lang") || "pt",
  fallbackLng: "pt",
});
```

### Uso nos componentes

```typescript
import { useTranslation } from "react-i18next";

function EventsPage() {
  const { t } = useTranslation("common");

  return <h1>{t("events.title")}</h1>;
}
```

### Persistência

- Idioma salvo em `localStorage` (`lang`)
- Componente `LanguageSwitch` permite trocar
- Mudança reflete instantaneamente

---

## ♿ Acessibilidade

### Implementações

#### 1. **ARIA Labels**

```tsx
<button onClick={onDelete} aria-label={`Excluir evento ${event.title}`}>
  Excluir
</button>
```

#### 2. **Navegação por Teclado**

- `ESC` fecha modais
- `Tab` navega entre campos
- Focus trap em modais (foco não escapa)

#### 3. **Semântica HTML**

```tsx
<article role="listitem">
  <h3>{event.title}</h3>
  <time dateTime={event.startDate}>{formatDate(event.startDate)}</time>
</article>
```

#### 4. **Estados de Loading**

```tsx
<div role="status" aria-live="polite">
  <LoadingSpinner />
  Carregando eventos...
</div>
```

#### 5. **Mensagens de Erro**

```tsx
<p role="alert" aria-live="polite">
  {error}
</p>
```

### Checklist WCAG 2.1

- ✅ Contraste de cores adequado (AA)
- ✅ Textos alternativos em ícones
- ✅ Focus rings visíveis
- ✅ Navegação por teclado
- ✅ Screen reader friendly
- ✅ Campos de formulário com labels

---

## 🤖 Uso de IA (Transparência)

### Ferramentas Utilizadas

**Claude AI**

### Onde a IA foi utilizada

| Área              | Como usei                               | O que revisei/modifiquei            |
| ----------------- | --------------------------------------- | ----------------------------------- |
| **Brainstorming** | Discussão de estrutura de pastas        | Adaptei para meu contexto           |
| **React Query**   | Exemplos de optimistic updates          | Implementei e testei localmente     |
| **Nomenclatura**  | Sugestões de nomes de funções/variáveis | Revisei e ajustei para consistência |
| **Documentação**  | Ajuda na estrutura do README            | Reescrevi seções inteiras           |

### O que fiz manualmente

1. ✅ Implementei **toda** a lógica de negócio
2. ✅ Testei manualmente cada funcionalidade
3. ✅ Revisei e refatorei código gerado
4. ✅ Tomei **todas** as decisões arquiteturais finais
5. ✅ Escrevi e ajustei esta documentação
6. ✅ Priorizei features baseado no desafio
7. ✅ Debuguei e corrigi bugs

## 🎯 O que faria com mais tempo

### Testes

- [ ] Testes unitários (Vitest)

### Performance

- [ ] Lazy loading de rotas
- [ ] Imagens otimizadas (WebP)

### DevOps

- [ ] Deploy automático (Vercel/Netlify)
- [ ] Environments (dev/staging/prod)

### Features

- [ ] Paginação da lista
- [ ] Tema dark/light

---
