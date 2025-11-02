export interface Contact {
  id: string;
  name: string;
  avatarUrl: string;
  phone: string;
  tags: string[];
  lastActivity: string;
  audiences: string[];
}

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: 'me' | 'contact';
}

export type CampaignStatus = 'Ativa' | 'Pausada' | 'Concluída' | 'Agendada';
export type CampaignRecipientStatus = 'Enviada' | 'Entregue' | 'Lida' | 'Falhou';

export interface CampaignRecipient {
  id: string;
  contactName: string;
  phone: string;
  status: CampaignRecipientStatus;
  lastUpdate: string;
}

export interface CampaignVariation {
  id: 'A' | 'B';
  body: string;
  sent: number;
  delivered: number;
  read: number;
}

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  audience: string;
  templateId?: string; // Made optional for AI-generated campaigns
  sent: number;
  total: number;
  recipients?: CampaignRecipient[];
  scheduledAt?: string;
  delivered?: number;
  read?: number;
  // Feature: Add variations for A/B testing
  variations?: CampaignVariation[];
}

export interface Audience {
  id: string;
  name: string;
  contactCount: number;
}

export interface MessageTemplate {
  id: string;
  name: string;
  category: 'Marketing' | 'Utilidade' | 'Autenticação';
  body: string;
}

// Fix: Add AdminTab type to be used across components.
export type AdminTab = 'dashboard' | 'campaigns' | 'audiences' | 'templates' | 'flows' | 'upload' | 'settings';

// Fix: Add WhatsAppConfig type for settings tab.
export interface WhatsAppConfig {
  status: 'Connected' | 'Disconnected' | 'Pending' | 'AwaitingQRCode' | 'QRCodeReady';
  phoneNumber: string | null;
  accountId: string | null;
  qrCodeData?: string;
}

export interface SmartReplyResponse {
  suggestions: string[];
}

export interface CampaignGenerationResponse {
  variations: Array<{
    id: 'A' | 'B';
    body: string;
  }>
}

// Feature: Add types for Automation Flows
export type FlowNodeType = 'trigger' | 'sendMessage' | 'wait' | 'condition';
export type FlowStatus = 'Ativo' | 'Pausado' | 'Rascunho';

export interface FlowNode {
  id: string;
  type: FlowNodeType;
  position: { x: number; y: number };
  data: {
    label: string;
    description?: string;
    // Specific data for each node type
    templateId?: string;
    delayInDays?: number;
    conditionField?: 'status';
    conditionOperator?: '==';
    conditionValue?: CampaignRecipientStatus;
    audienceId?: string;
  };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  label?: 'Sim' | 'Não'; // For conditional branches
}

export interface Flow {
  id: string;
  name: string;
  status: FlowStatus;
  triggerAudience: string;
  activeContacts: number;
  totalEngaged: number;
  nodes: FlowNode[];
  edges: FlowEdge[];
}
