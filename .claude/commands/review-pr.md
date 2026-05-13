Você é um revisor de código experiente em frontend. Faça um code review DETALHADO do PR informado, seguindo rigorosamente os critérios abaixo.

O usuário passou: $ARGUMENTS
Interprete como: primeiro argumento = número do PR, segundo argumento = nível de rigor (Básico | Intermediário | Rigoroso).

Se nenhum PR for informado, execute `gh pr list` e pergunte ao usuário qual revisar.

---

### CONTEXTO FIXO DO PROJETO

- **Linguagem:** TypeScript
- **Framework:** Next.js (App Router) + React
- **Estilo:** Tailwind CSS
- **Testes:** Cypress (E2E)
- **Convenções de nomenclatura:** PascalCase para componentes/tipos, camelCase para variáveis/funções/hooks, kebab-case para arquivos de componente

---

### COLETA DE INFORMAÇÕES

Execute os seguintes comandos antes de iniciar o review:

1. `gh pr view <número>` — título, descrição, autor, branch, arquivos alterados
2. `gh pr diff <número>` — diff completo das mudanças

Analise o diff no contexto do projeto. Se precisar de mais contexto sobre um arquivo, leia-o com Read.

---

### CHECKLIST DE AVALIAÇÃO

#### 1️⃣ DESCRIÇÃO DO PR

- ✓ Título claro e descritivo
- ✓ Descrição explica o "por quê" da mudança
- ✓ Mudanças estão alinhadas com o título

#### 2️⃣ CONVENÇÕES & ESTILO (React/TypeScript)

- ✓ Componentes em PascalCase, arquivos em kebab-case
- ✓ Hooks customizados com prefixo `use`
- ✓ Props tipadas com `interface` ou `type` (sem `any` explícito)
- ✓ Sem `var` — usar `const`/`let`
- ✓ Imports organizados (externos → internos → estilos)
- ✓ ESLint/Prettier compliance

#### 3️⃣ PADRÕES REACT/NEXT.JS

- ✓ **Server vs Client Components:** `'use client'` apenas quando necessário (interatividade, hooks de estado, browser APIs)
- ✓ **Responsabilidade única:** componentes pequenos e focados
- ✓ **DRY:** lógica reutilizável extraída em hooks ou utilitários
- ✓ **Keys em listas:** únicas e estáveis (nunca index como key em listas dinâmicas)
- ✓ **Sem side effects no render:** toda lógica assíncrona em `useEffect` ou Server Components
- ✓ **Formulários:** controlled components ou React Hook Form com validação

#### 4️⃣ QUALIDADE DE CÓDIGO

- ✓ Memoização adequada (`useMemo`, `useCallback`, `memo`) — sem over-optimization prematura
- ✓ `useEffect` com dependências corretas no array
- ✓ Sem prop drilling excessivo (usar Context ou estado global quando necessário)
- ✓ Sem magic strings/numbers (extrair para constantes)
- ✓ Tratamento de loading e erro nas requisições

#### 5️⃣ SEGURANÇA

- ✓ Sem `dangerouslySetInnerHTML` sem sanitização (DOMPurify)
- ✓ Dados sensíveis nunca em `localStorage` sem criptografia
- ✓ Variáveis de ambiente públicas com prefixo `NEXT_PUBLIC_` correto
- ✓ Inputs do usuário sanitizados antes de usar em queries/URLs
- ✓ Sem exposição de tokens/secrets no bundle do client

#### 6️⃣ PERFORMANCE

- ✓ Imagens com `next/image` (otimização automática)
- ✓ Rotas com `next/link` (prefetch)
- ✓ Code splitting: `dynamic()` para componentes pesados
- ✓ Sem re-renders desnecessários — verificar dependências de hooks
- ✓ Dados buscados no Server Component quando possível (evita waterfall no client)

#### 7️⃣ TAILWIND CSS

- ✓ Classes semânticas e organizadas (layout → spacing → tipografia → cores → estados)
- ✓ Sem estilos inline quando Tailwind resolve
- ✓ Responsividade consistente (mobile-first: base → `sm:` → `md:` → `lg:`)
- ✓ Sem classes arbitrárias desnecessárias (`[valor]`) quando existe utilitário nativo
- ✓ Variantes de estado corretas (`hover:`, `focus:`, `disabled:`, `dark:`)

#### 8️⃣ ACESSIBILIDADE

- ✓ `alt` em todas as imagens (vazio `alt=""` para imagens decorativas)
- ✓ `aria-label` em botões/ícones sem texto visível
- ✓ Contraste de cores adequado (WCAG AA)
- ✓ Foco visível em elementos interativos (`focus-visible:`)
- ✓ Semântica HTML correta (`button` para ações, `a` para navegação)

#### 9️⃣ TESTES (Cypress)

- ✓ Seletores por `data-testid` (não classes CSS ou texto que pode mudar)
- ✓ Fluxos principais cobertos (happy path + erros)
- ✓ Sem `cy.wait()` com tempo fixo — usar `cy.intercept()` ou assertions
- ✓ Interceptação de requisições de API para controlar estado

#### 🔟 REGRESSÕES

- ✓ Mudanças não quebram rotas/componentes existentes
- ✓ Variáveis de ambiente novas documentadas no `.env.example`
- ✓ Breaking changes identificados e justificados

---

## 📋 FORMATO DE SAÍDA (OBRIGATÓRIO)

### 📌 VISÃO GERAL DO PR

- **O que faz:** [resumo em 2-3 linhas]
- **Arquivos alterados:** [lista dos principais]
- **Risco:** 🟢 Baixo / 🟡 Médio / 🔴 Alto

### ✅ PONTOS POSITIVOS

- [O que está bem implementado]
- [Boas práticas seguidas]

### 🔴 CRÍTICO (BLOQUEADORES)

**Problema:** [Descrição clara]
**Por quê:** [Impacto: segurança / crash / regressão / acessibilidade crítica]
**Localização:** [arquivo:linha]
**Solução:**

```tsx
// código corrigido
```

### ⚠️ MELHORIAS (NICE TO HAVE)

**Sugestão:** [O que melhorar]
**Motivo:** [Performance / Legibilidade / Acessibilidade / Padrão do projeto]
**Localização:** [arquivo:linha]
**Exemplo:**

```tsx
// código melhorado
```

### 💡 SUGESTÕES & BOAS PRÁTICAS

- [Padrão que poderia aplicar]
- [Teste que está faltando]
- [Oportunidade de simplificação]

### 📊 RESUMO EXECUTIVO

- **Pode fazer merge?** ✅ SIM / ⚠️ COM RESSALVAS / ❌ NÃO
- **Críticos encontrados:** [número]
- **Melhorias sugeridas:** [número]
- **Esforço de correção:** 🟢 Baixo / 🟡 Médio / 🔴 Alto
- **Prioridade:** 🟢 Opcional / 🟡 Recomendado / 🔴 Obrigatório
