# Guia Rápido: Sistema de Onboarding

## 🎯 O que foi implementado?

Um sistema completo de onboarding interativo com animações suaves para dar boas-vindas aos usuários do Luxis.

## 📦 Pacotes instalados

```bash
npm install nextstepjs motion
npx shadcn@latest add progress
```

## 🗂️ Arquivos criados

### Componentes de Onboarding

- `src/components/onboarding/onboarding-provider.tsx` - Provider de contexto
- `src/components/onboarding/onboarding-modal.tsx` - Modal do tour
- `src/components/onboarding/feature-spotlight.tsx` - Destaque de features
- `src/components/onboarding/onboarding-settings.tsx` - Configurações
- `src/components/onboarding/index.ts` - Exports centralizados

### Componentes UI

- `src/components/ui/progress.tsx` - Barra de progresso (shadcn)

### Documentação

- `ONBOARDING.md` - Documentação completa

## 🔧 Integrações realizadas

### 1. Layout Principal

```tsx
// src/app/layout.tsx
import { OnboardingProvider } from '@/components/onboarding/onboarding-provider'

// Envolve a aplicação com o provider
;<OnboardingProvider>{children}</OnboardingProvider>
```

### 2. Layout de Admin

```tsx
// src/app/[locale]/home/layout.tsx
import { OnboardingModal } from '@/components/onboarding/onboarding-modal'

// Adiciona o modal ao layout
;<SidebarProvider>
  <AdminSidebar />
  <SidebarInset>{children}</SidebarInset>
  <OnboardingModal />
</SidebarProvider>
```

### 3. Layout de Revendedor

```tsx
// src/app/[locale]/my-space/layout.tsx
import { OnboardingModal } from '@/components/onboarding/onboarding-modal'

// Adiciona o modal ao layout
;<SidebarProvider>
  <ResellerSidebar />
  <SidebarInset>{children}</SidebarInset>
  <OnboardingModal />
</SidebarProvider>
```

### 4. Página de Configurações

```tsx
// src/components/settings/settings-page.tsx
import { OnboardingSettings } from '@/components/onboarding/onboarding-settings'

// Adiciona na aba de Aparência
;<TabsContent value="appearance">
  <Card>
    <AppearanceForm />
  </Card>
  <OnboardingSettings />
</TabsContent>
```

## 🌍 Traduções adicionadas

### Português (`src/messages/pt.json`)

```json
{
  "Onboarding": {
    "welcome": {
      "title": "Bem-vindo ao Luxis! ✨",
      "description": "..."
    },
    "inventory": { ... },
    "customers": { ... },
    "sales": { ... },
    "dashboard": { ... },
    "step": "Passo",
    "of": "de",
    "next": "Próximo",
    "previous": "Anterior",
    "getStarted": "Começar",
    "skip": "Pular"
  }
}
```

### Inglês (`src/messages/en.json`)

Similar ao português, mas traduzido.

## ✨ Funcionalidades

### Modal de Onboarding

- ✅ 5 passos interativos
- ✅ Animações suaves com Framer Motion
- ✅ Barra de progresso
- ✅ Navegação anterior/próximo
- ✅ Opção de pular
- ✅ Ícones coloridos para cada passo
- ✅ Indicadores visuais (dots)
- ✅ Armazenamento no localStorage

### Provider de Contexto

- ✅ Gerenciamento de estado global
- ✅ Persistência no localStorage
- ✅ Funções para iniciar/completar/pular

### Configurações

- ✅ Opção de reiniciar o tour
- ✅ Feedback visual do status
- ✅ Integrado na página de configurações

## 🚀 Como testar

1. **Limpe o localStorage** (opcional, para simular primeiro acesso):

   ```javascript
   localStorage.removeItem('luxis-onboarding-complete')
   ```

2. **Faça login** como admin ou revendedor

3. **O modal de onboarding aparecerá** automaticamente

4. **Navegue pelos passos** ou pule o tour

5. **Para ver novamente**:
   - Vá em Configurações > Aparência
   - Clique em "Iniciar Novamente"

## 🎨 Customização

### Adicionar novo passo

Edite `src/components/onboarding/onboarding-modal.tsx`:

```tsx
const steps: OnboardingStep[] = [
  // ... passos existentes
  {
    title: t('newStep.title'),
    description: t('newStep.description'),
    icon: <YourIcon className="text-color-500 h-16 w-16" />
  }
]
```

Adicione a tradução em `src/messages/pt.json`:

```json
{
  "Onboarding": {
    "newStep": {
      "title": "Título do Novo Passo",
      "description": "Descrição do novo passo"
    }
  }
}
```

### Alterar número de passos

Atualize `totalSteps` no `OnboardingProvider` para corresponder ao número de itens no array `steps`.

## 📝 Notas importantes

- O onboarding é mostrado **apenas na primeira vez** que o usuário acessa
- O estado é **persistido no localStorage** com a chave `luxis-onboarding-complete`
- O modal está integrado nos **layouts de admin e revendedor**
- É possível **reiniciar o tour** nas configurações

## 🔮 Próximos passos sugeridos

1. Adicionar screenshots/imagens aos passos
2. Implementar Feature Spotlight em páginas específicas
3. Criar tours contextuais para diferentes seções
4. Adicionar analytics para medir engajamento

## 💡 Dicas de uso

- **Não force**: Sempre permita pular o onboarding
- **Seja breve**: Mantenha entre 5-7 passos
- **Use imagens**: Adicione screenshots quando apropriado
- **Teste**: Verifique em diferentes tamanhos de tela
- **Atualize**: Mantenha as traduções sincronizadas
