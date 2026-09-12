'use client'

import { CircleQuestionMark } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

type BusinessRulesTopic =
  | 'products'
  | 'models'
  | 'batches'
  | 'returns'
  | 'transfers'
  | 'sales'
  | 'shipments'
  | 'users'
  | 'customers'
  | 'suppliers'

type Rule = {
  label: string
  description: string
}

type TopicContent = {
  title: string
  description: string
  flow: string[]
  rules: Rule[]
}

const topics: Record<BusinessRulesTopic, TopicContent> = {
  products: {
    title: 'Regras de produtos',
    description: 'Como produtos são criados, disponibilizados e vendidos.',
    flow: ['Lote criado', 'Produto em estoque', 'Atribuído', 'Vendido'],
    rules: [
      {
        label: 'Criação',
        description:
          'Produtos são gerados automaticamente a partir dos itens de um lote, com número de série único.'
      },
      {
        label: 'Edição',
        description:
          'Custo, preço e status podem ser ajustados conforme as permissões do usuário.'
      },
      {
        label: 'Disponibilidade',
        description:
          'Somente produtos em estoque ficam disponíveis para novas atribuições ou vendas.'
      }
    ]
  },
  models: {
    title: 'Regras de modelos',
    description:
      'Modelos organizam os produtos por categoria e características.',
    flow: [
      'Categoria criada',
      'Modelo criado',
      'Produtos vinculados',
      'Catálogo'
    ],
    rules: [
      {
        label: 'Dependência',
        description: 'Todo modelo deve pertencer a uma categoria existente.'
      },
      {
        label: 'Produtos',
        description:
          'O modelo define nome, descrição e imagem usados pelos produtos vinculados.'
      },
      {
        label: 'Exclusão',
        description:
          'Modelos em uso não devem ser removidos enquanto existirem produtos vinculados.'
      }
    ]
  },
  batches: {
    title: 'Regras de lotes',
    description:
      'Lotes registram a entrada de produtos recebidos de fornecedores.',
    flow: ['Fornecedor', 'Lote', 'Itens do lote', 'Produtos em estoque'],
    rules: [
      {
        label: 'Entrada',
        description:
          'Cada item informa modelo, quantidade, custo e preço de venda.'
      },
      {
        label: 'Numeração',
        description:
          'A quantidade gera números de série sequenciais a partir da data e do lote.'
      },
      {
        label: 'Estoque',
        description: 'Produtos recém-criados começam com status Em estoque.'
      }
    ]
  },
  returns: {
    title: 'Regras de devoluções',
    description:
      'Devoluções passam por aprovação antes de retornar ao estoque.',
    flow: ['Pendente', 'Aprovada', 'Devolvida'],
    rules: [
      {
        label: 'Transições',
        description:
          'Pendente pode ir para Aprovada ou Cancelada; Aprovada pode ir para Devolvida ou Cancelada.'
      },
      {
        label: 'Estado final',
        description:
          'Devolvida e Cancelada encerram o fluxo e não possuem nova transição.'
      },
      {
        label: 'Produtos',
        description:
          'A devolução referencia os produtos envolvidos e registra o revendedor responsável.'
      }
    ]
  },
  transfers: {
    title: 'Regras de transferências',
    description: 'Transferências movimentam produtos entre revendedores.',
    flow: ['Pendente', 'Aprovada', 'Finalizada'],
    rules: [
      {
        label: 'Transições',
        description:
          'Pendente pode ser aprovada ou cancelada; Aprovada pode ser finalizada ou cancelada.'
      },
      {
        label: 'Participantes',
        description:
          'A origem e o destino devem ser revendedores válidos e diferentes.'
      },
      {
        label: 'Estado final',
        description: 'Finalizada e Cancelada encerram a transferência.'
      }
    ]
  },
  sales: {
    title: 'Regras de vendas',
    description:
      'Vendas controlam pagamento, parcelas e confirmação de produtos.',
    flow: ['Pendente', 'Confirmada', 'Parcelas pagas'],
    rules: [
      {
        label: 'Criação',
        description:
          'Uma venda reúne revendedor, cliente, produtos e forma de pagamento.'
      },
      {
        label: 'Parcelas',
        description:
          'O fluxo pode passar por Parcelas pendentes, Parcelas pagas ou Parcelas vencidas.'
      },
      {
        label: 'Cancelamento',
        description:
          'Vendas pendentes ou confirmadas podem ser canceladas conforme a operação.'
      }
    ]
  },
  shipments: {
    title: 'Regras de romaneios',
    description: 'Romaneios acompanham o envio de produtos para o revendedor.',
    flow: ['Pendente', 'Aprovado', 'Entregue'],
    rules: [
      {
        label: 'Transições',
        description:
          'Pendente pode ser aprovado ou cancelado; Aprovado pode ser entregue ou cancelado.'
      },
      {
        label: 'Produtos',
        description:
          'O romaneio lista produtos vinculados ao revendedor destinatário.'
      },
      {
        label: 'Estado final',
        description: 'Entregue e Cancelado encerram o fluxo.'
      }
    ]
  },
  users: {
    title: 'Regras de usuários',
    description:
      'Usuários precisam estar ativos para acessar as áreas permitidas.',
    flow: ['Cadastro', 'Pendente', 'Ativo'],
    rules: [
      {
        label: 'Aprovação',
        description: 'Novos revendedores aguardam aprovação administrativa.'
      },
      {
        label: 'Acesso',
        description: 'O acesso depende do papel do usuário e do status Ativo.'
      },
      {
        label: 'Permissões',
        description:
          'Administradores gerenciam cadastros; revendedores operam seu espaço.'
      }
    ]
  },
  customers: {
    title: 'Regras de clientes',
    description:
      'Clientes são vinculados às vendas e devem ter contato válido.',
    flow: ['Cadastro', 'Disponível para venda', 'Histórico de compras'],
    rules: [
      {
        label: 'Cadastro',
        description:
          'Nome e telefone são necessários para identificar o cliente.'
      },
      {
        label: 'Vendas',
        description: 'Um cliente pode ser selecionado ao criar uma venda.'
      }
    ]
  },
  suppliers: {
    title: 'Regras de fornecedores',
    description: 'Fornecedores são a origem dos lotes de entrada.',
    flow: ['Cadastro', 'Lote recebido', 'Produtos em estoque'],
    rules: [
      {
        label: 'Cadastro',
        description:
          'O fornecedor precisa estar cadastrado antes da entrada de um lote.'
      },
      {
        label: 'Rastreabilidade',
        description:
          'Cada lote mantém o fornecedor associado à entrada dos produtos.'
      }
    ]
  }
}

export function BusinessRulesHelp({ topic }: { topic: BusinessRulesTopic }) {
  const content = topics[topic]

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Ver regras de negócio: ${content.title}`}
          title={`Ver regras de negócio: ${content.title}`}
        >
          <CircleQuestionMark className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{content.title}</DialogTitle>
          <DialogDescription>{content.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-sm font-semibold">Fluxo principal</h3>
            <div className="flex flex-wrap items-center gap-2">
              {content.flow.map((step, index) => (
                <div key={step} className="flex items-center gap-2">
                  <span className="rounded-md border bg-muted px-3 py-2 text-xs font-medium">
                    {step}
                  </span>
                  {index < content.flow.length - 1 && (
                    <span className="text-muted-foreground" aria-hidden="true">
                      →
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {content.rules.map((rule) => (
              <div key={rule.label} className="border-l-2 border-primary pl-3">
                <h3 className="text-sm font-semibold">{rule.label}</h3>
                <p className="text-muted-foreground text-sm">
                  {rule.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
