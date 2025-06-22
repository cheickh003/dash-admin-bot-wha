import { Client, Databases, Account, Query } from 'appwrite';

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('68586340002f83db8623');

export const databases = new Databases(client);
export const account = new Account(client);

export const DATABASE_ID = 'whatsapp_chatbot_db';

export const COLLECTIONS = {
  CONVERSATIONS: 'conversations',
  MESSAGES: 'messages',
  ADMINS: 'admins',
  ADMIN_AUDIT: 'admin_audit',
  BOT_CONFIG: 'bot_config',
  ADMIN_ACTIONS_LOG: 'admin_actions_log',
  TICKETS: 'tickets',
  DOCUMENTS: 'documents',
  PROJECTS: 'projects',
  REMINDERS: 'reminders',
} as const;

export { Query };

export const appwriteService = {
  client,
  databases,
  account,
};