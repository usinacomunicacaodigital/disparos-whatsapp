import { Contact, Message, Campaign, Audience, CampaignRecipient, MessageTemplate, Flow } from './types';

export const MOCK_TEMPLATES: MessageTemplate[] = [
  { id: 'tpl1', name: 'Boas-vindas Cliente', category: 'Utilidade', body: 'Olá {{1}}! Seja bem-vindo à nossa plataforma. Estamos felizes em ter você aqui! 🎉' },
  { id: 'tpl2', name: 'Cupom de Aniversário', category: 'Marketing', body: 'Feliz aniversário, {{1}}! 🎂 Use o cupom ANIVERSARIO20 para ganhar 20% de desconto em sua próxima compra.' },
  { id: 'tpl3', name: 'Lembrete de Carrinho', category: 'Marketing', body: 'Olá! Notamos que você deixou alguns itens no seu carrinho. Finalize sua compra agora e não perca nossos produtos incríveis!' },
  { id: 'tpl4', name: 'Confirmação de Agendamento', category: 'Utilidade', body: 'Seu agendamento para o dia {{1}} às {{2}} foi confirmado com sucesso. Até breve!' },
];

export const MOCK_CONTACTS: Contact[] = [
  { id: '1', name: 'Alice', avatarUrl: 'https://picsum.photos/seed/alice/100/100', phone: '+55 11 98765-4321', tags: ['vip', 'ativo'], lastActivity: '2 dias atrás', audiences: ['Clientes VIP'] },
  { id: '2', name: 'Bruno', avatarUrl: 'https://picsum.photos/seed/bruno/100/100', phone: '+55 21 91234-5678', tags: ['novo', 'lead'], lastActivity: '5 horas atrás', audiences: ['Leads - Feira de TI 2024'] },
  { id: '3', name: 'Carla', avatarUrl: 'https://picsum.photos/seed/carla/100/100', phone: '+55 31 99876-5432', tags: ['inativo'], lastActivity: '3 meses atrás', audiences: ['Clientes Inativos', 'Newsletter Assinantes'] },
  { id: '4', name: 'Daniel', avatarUrl: 'https://picsum.photos/seed/daniel/100/100', phone: '+55 41 98765-1234', tags: ['ativo'], lastActivity: '1 semana atrás', audiences: ['Newsletter Assinantes'] },
  { id: '5', name: 'Elena', avatarUrl: 'https://picsum.photos/seed/elena/100/100', phone: '+55 51 91234-8765', tags: ['vip', 'recorrente'], lastActivity: 'Ontem', audiences: ['Clientes VIP', 'Newsletter Assinantes'] },
];

export const MOCK_AUDIENCE_CONTACTS: Contact[] = [
    ...MOCK_CONTACTS,
    { id: '6', name: 'Fernanda', avatarUrl: 'https://picsum.photos/seed/fernanda/100/100', phone: '+55 61 98888-7777', tags: ['vip'], lastActivity: '3 dias atrás', audiences: ['Clientes VIP'] },
    { id: '7', name: 'Gustavo', avatarUrl: 'https://picsum.photos/seed/gustavo/100/100', phone: '+55 71 97777-6666', tags: ['ativo'], lastActivity: 'Hoje', audiences: ['Newsletter Assinantes'] },
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  '1': [
    { id: 'm1-1', text: 'Oi, tudo bem?', timestamp: '10:30', sender: 'contact' },
    { id: 'm1-2', text: 'Tudo ótimo! E com você?', timestamp: '10:31', sender: 'me' },
    { id: 'm1-3', text: 'Tudo certo também. Vamos marcar aquele café?', timestamp: '10:31', sender: 'contact' },
  ],
  '2': [
    { id: 'm2-1', text: 'E aí, Bruno! Aquele projeto ficou pronto?', timestamp: '09:15', sender: 'me' },
    { id: 'm2-2', text: 'Quase lá! Te mando até o final do dia.', timestamp: '09:16', sender: 'contact' },
  ],
  '3': [
    { id: 'm3-1', text: 'Feliz aniversário, Carla!! 🎉', timestamp: '00:01', sender: 'me' },
  ]
};

export const MOCK_AUDIENCES: Audience[] = [
  { id: 'aud1', name: 'Clientes VIP', contactCount: 50 },
  { id: 'aud2', name: 'Leads - Feira de TI 2024', contactCount: 250 },
  { id: 'aud3', name: 'Newsletter Assinantes', contactCount: 1200 },
  { id: 'aud4', name: 'Clientes Inativos', contactCount: 88 },
];

export const MOCK_RECIPIENTS: CampaignRecipient[] = [
  { id: 'rec1', contactName: 'Fernanda Lima', phone: '+55 11 91111-1111', status: 'Lida', lastUpdate: '2024-07-15 10:30' },
  { id: 'rec2', contactName: 'Gustavo Ribeiro', phone: '+55 21 92222-2222', status: 'Lida', lastUpdate: '2024-07-15 10:32' },
  { id: 'rec3', contactName: 'Heloísa Costa', phone: '+55 31 93333-3333', status: 'Entregue', lastUpdate: '2024-07-15 10:28' },
  // Fix: Use `contactName` instead of `name` to match the CampaignRecipient type.
  { id: 'rec4', contactName: 'Igor Martins', phone: '+55 41 94444-4444', status: 'Falhou', lastUpdate: '2024-07-15 10:25' },
  // Fix: Use `contactName` instead of `name` to match the CampaignRecipient type.
  { id: 'rec5', contactName: 'Juliana Alves', phone: '+55 51 95555-5555', status: 'Enviada', lastUpdate: '2024-07-15 10:25' },
];

export const MOCK_CAMPAIGNS: Campaign[] = [
  { 
    id: 'camp1', name: 'Promoção de Aniversário', status: 'Ativa', audience: 'Clientes VIP', 
    templateId: 'tpl2', sent: 48, total: 50, delivered: 45, read: 40
  },
  { 
    id: 'camp2', name: 'Lançamento Produto X', status: 'Concluída', audience: 'Leads - Feira de TI 2024', 
    templateId: 'tpl3', sent: 250, total: 250, recipients: MOCK_RECIPIENTS, delivered: 240, read: 180
  },
  { 
    id: 'camp3', name: 'Black Friday 2023', status: 'Concluída', audience: 'Newsletter Assinantes', 
    templateId: 'tpl3', sent: 1200, total: 1200, delivered: 1150, read: 900
  },
  { 
    id: 'camp4', name: 'Campanha de Reativação', status: 'Pausada', audience: 'Clientes Inativos', 
    templateId: 'tpl1', sent: 0, total: 88, delivered: 0, read: 0
  },
  { 
    id: 'camp5', name: 'Confirmações de Consultas', status: 'Agendada', audience: 'Clientes VIP', 
    templateId: 'tpl4', sent: 0, total: 50, scheduledAt: '2024-08-01T10:00:00', delivered: 0, read: 0
  },
  // Feature: Add a completed A/B test campaign for the report view.
  {
    id: 'camp6', name: 'Teste A/B: Cupom de Desconto', status: 'Concluída', audience: 'Newsletter Assinantes',
    sent: 1200, total: 1200, delivered: 1152, read: 876,
    variations: [
      { id: 'A', body: 'Olá {{nome}}, temos um presente para você! Use o cupom VIP15 para 15% de desconto. ✨', sent: 600, delivered: 580, read: 406 },
      { id: 'B', body: 'Ei {{nome}}! Que tal 15% de desconto na sua próxima compra? Use o código VIP15 e aproveite. 🛍️', sent: 600, delivered: 572, read: 470 }
    ]
  }
];

// Feature: Add mock data for Automation Flows
export const MOCK_FLOWS: Flow[] = [
  {
    id: 'flow1',
    name: 'Boas-vindas para Leads',
    status: 'Ativo',
    triggerAudience: 'Leads - Feira de TI 2024',
    activeContacts: 180,
    totalEngaged: 245,
    nodes: [
      { id: 'n1', type: 'trigger', position: { x: 0, y: 0 }, data: { label: 'Gatilho: Novo Contato', description: 'Inicia quando um contato entra em "Leads - Feira de TI 2024"', audienceId: 'aud2' } },
      { id: 'n2', type: 'sendMessage', position: { x: 0, y: 120 }, data: { label: 'Enviar Mensagem de Boas-vindas', templateId: 'tpl1' } },
      { id: 'n3', type: 'wait', position: { x: 0, y: 240 }, data: { label: 'Aguardar 3 dias', delayInDays: 3 } },
      { id: 'n4', type: 'condition', position: { x: 0, y: 360 }, data: { label: 'Condição: Mensagem Lida?', conditionField: 'status', conditionOperator: '==', conditionValue: 'Lida' } },
      { id: 'n5', type: 'sendMessage', position: { x: -150, y: 480 }, data: { label: 'Enviar Cupom de Desconto', templateId: 'tpl2' } },
      { id: 'n6', type: 'sendMessage', position: { x: 150, y: 480 }, data: { label: 'Enviar Lembrete Amigável', templateId: 'tpl3' } },
    ],
    edges: [
      { id: 'e1-2', source: 'n1', target: 'n2' },
      { id: 'e2-3', source: 'n2', target: 'n3' },
      { id: 'e3-4', source: 'n3', target: 'n4' },
      { id: 'e4-5', source: 'n4', target: 'n5', label: 'Sim' },
      { id: 'e4-6', source: 'n4', target: 'n6', label: 'Não' },
    ]
  },
  {
    id: 'flow2',
    name: 'Reativação de Clientes Inativos',
    status: 'Pausado',
    triggerAudience: 'Clientes Inativos',
    activeContacts: 0,
    totalEngaged: 22,
    nodes: [],
    edges: []
  }
];