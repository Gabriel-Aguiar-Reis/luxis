# Sistema de Onboarding do Luxis

## Visão Geral

O sistema de onboarding foi implementado usando `nextstepjs` e `motion` (Framer Motion) para fornecer uma experiência de boas-vindas interativa e animada aos usuários do sistema Luxis.

## Estrutura de Arquivos

```
frontend/src/components/onboarding/
├── onboarding-provider.tsx      # Context provider para gerenciar estado do onboarding
├── onboarding-modal.tsx          # Modal principal com os passos do tour
├── feature-spotlight.tsx         # Componente para destacar features específicas (opcional)
└── onboarding-settings.tsx       # Componente de configurações para reiniciar o tour
```

## Funcionalidades

### 1. Modal de Onboarding

- **5 passos interativos** explicando as principais funcionalidades:
  - Boas-vindas ao Luxis
  - Gerenciamento de Estoque
  - Clientes e Portfólio
  - Vendas e Relatórios
  - Dashboard Intuitivo

- **Animações suaves** usando Framer Motion para transições entre passos
- **Barra de progresso** visual mostrando a evolução do tour
- **Indicadores de passo** (dots) para navegação visual
- **Navegação** com botões "Anterior", "Próximo" e "Começar"
- **Opção de pular** o tour a qualquer momento

### 2. Gerenciamento de Estado

O `OnboardingProvider` gerencia:

- Status de conclusão do onboarding (armazenado no localStorage)
- Passo atual do tour
- Funções para iniciar, pular ou completar o onboarding

### 3. Integração

O onboarding está integrado em:

- **Layout de Admin** (`/home`)
- **Layout de Revendedor** (`/my-space`)
- **Página de Configurações** (ambas as áreas)

## Como Usar

### Visualizar o Onboarding

1. Faça login como admin ou revendedor
2. Se for seu primeiro acesso, o modal de onboarding aparecerá automaticamente
3. Navegue pelos passos usando os botões
4. Complete ou pule o tour

### Reiniciar o Onboarding

1. Acesse **Configurações** (sidebar)
2. Vá para a aba **Aparência**
3. Role até o card "Tour de Boas-Vindas"
4. Clique em "Iniciar Novamente"

## Traduções

As traduções estão disponíveis em:

- Português (`src/messages/pt.json`)
- Inglês (`src/messages/en.json`)

Chaves de tradução:

```
Onboarding.welcome.title
Onboarding.welcome.description
Onboarding.inventory.title
Onboarding.inventory.description
Onboarding.customers.title
Onboarding.customers.description
Onboarding.sales.title
Onboarding.sales.description
Onboarding.dashboard.title
Onboarding.dashboard.description
Onboarding.step
Onboarding.of
Onboarding.next
Onboarding.previous
Onboarding.getStarted
Onboarding.skip
```

## Customização

### Adicionar Novos Passos

Edite o array `steps` em `onboarding-modal.tsx`:

```tsx
const steps: OnboardingStep[] = [
  {
    title: t('newStep.title'),
    description: t('newStep.description'),
    icon: <YourIcon className="text-color-500 h-16 w-16" />,
    image: '/path/to/image.png' // opcional
  }
  // ... outros passos
]
```

### Alterar Animações

As animações são configuradas usando Framer Motion:

```tsx
<motion.div
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: -20 }}
  transition={{ duration: 0.3 }}
>
  {/* conteúdo */}
</motion.div>
```

### Feature Spotlight (Opcional)

O componente `FeatureSpotlight` pode ser usado para destacar elementos específicos da UI:

```tsx
<FeatureSpotlight
  targetSelector=".minha-feature"
  title="Nova Feature"
  description="Descrição da feature"
  position="bottom"
  onComplete={() => console.log('Spotlight fechado')}
/>
```

## Armazenamento

O estado do onboarding é persistido no **localStorage** com a chave:

- `luxis-onboarding-complete`: `'true'` quando o usuário completa ou pula o tour

## Dependências

- `nextstepjs@2.1.2`: Framework para criar tours guiados
- `motion@12.23.24`: Biblioteca de animações (Framer Motion)
- `@radix-ui/react-progress`: Componente de barra de progresso
- `@radix-ui/react-dialog`: Componente de modal

## Melhores Práticas

1. **Não force o onboarding**: Sempre dê a opção de pular
2. **Mantenha curto**: 5-7 passos no máximo
3. **Use animações sutis**: Não exagere nas transições
4. **Teste em diferentes tamanhos de tela**: Garanta responsividade
5. **Atualize traduções**: Mantenha consistência entre idiomas

## Próximos Passos (Sugestões)

- [ ] Adicionar imagens/screenshots aos passos do tour
- [ ] Implementar Feature Spotlight em páginas específicas
- [ ] Criar tours contextuais para diferentes áreas do sistema
- [ ] Adicionar analytics para medir engajamento com o onboarding
- [ ] Versionar o onboarding para mostrar novidades em updates
