export interface Admin {
  $id: string;
  phoneNumber: string;
  name: string;
  pin: string;
  createdAt: string;
  lastAuth?: string;
  sessionExpiry?: string;
}

export interface Conversation {
  $id: string;
  phoneNumber: string;
  createdAt: string;
  lastMessageAt: string;
}

export interface Message {
  $id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'admin';
  content: string;
  timestamp: string;
}

export interface BotConfig {
  $id: string;
  key: string;
  value: any;
  type: string;
  description?: string;
  updatedAt: string;
  updatedBy?: string;
}

export interface AdminAction {
  $id: string;
  adminId: string;
  action: string;
  target?: string;
  details: any;
  timestamp: string;
  result: 'success' | 'failure';
  errorMessage?: string;
}

export interface Ticket {
  $id: string;
  ticketNumber: string;
  userId: string;
  userPhone: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  assignedTo?: string;
  notes?: string;
}

export interface Document {
  $id: string;
  userId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileId: string;
  uploadedAt: string;
  extractedText?: string;
  metadata?: any;
}

export interface BotStats {
  totalUsers: number;
  activeUsers: number;
  messagestoday: number;
  avgResponseTime: number;
  uptime: number;
  isOnline: boolean;
}