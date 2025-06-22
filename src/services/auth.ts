import { account } from './appwrite';
import { ID } from 'appwrite';

export const authService = {
  async login(email: string, password: string) {
    try {
      const session = await account.createEmailPasswordSession(email, password);
      return session;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async logout() {
    try {
      await account.deleteSession('current');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  async getCurrentUser() {
    try {
      const user = await account.get();
      return user;
    } catch (error) {
      return null;
    }
  },

  async register(email: string, password: string, name: string) {
    try {
      const user = await account.create(ID.unique(), email, password, name);
      await account.createEmailPasswordSession(email, password);
      return user;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async checkSession() {
    try {
      const session = await account.getSession('current');
      return !!session;
    } catch (error) {
      return false;
    }
  }
};