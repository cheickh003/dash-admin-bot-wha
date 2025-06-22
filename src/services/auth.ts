import { databases, DATABASE_ID, COLLECTIONS, Query } from './appwrite';
import { Admin } from '../types';

export const authService = {
  async login(phoneNumber: string, pin: string): Promise<Admin | null> {
    try {
      // Format phone number
      const formattedPhone = phoneNumber.replace(/\D/g, '');
      
      // Query admin by phone number
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.ADMINS,
        [Query.equal('phoneNumber', formattedPhone)]
      );

      if (response.documents.length === 0) {
        throw new Error('Admin not found');
      }

      const admin = response.documents[0] as Admin;
      
      // Verify PIN (in production, this should be done server-side)
      // For now, we'll do a simple comparison
      if (admin.pin !== pin) {
        throw new Error('Invalid PIN');
      }

      // Update last auth and session expiry
      const sessionExpiry = new Date();
      sessionExpiry.setMinutes(sessionExpiry.getMinutes() + 15);

      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.ADMINS,
        admin.$id,
        {
          lastAuth: new Date().toISOString(),
          sessionExpiry: sessionExpiry.toISOString(),
        }
      );

      // Log the authentication
      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.ADMIN_AUDIT,
        'unique()',
        {
          adminId: admin.$id,
          action: 'login',
          details: { source: 'web' },
          timestamp: new Date().toISOString(),
        }
      );

      return admin;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async logout(adminId: string): Promise<void> {
    try {
      // Clear session
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.ADMINS,
        adminId,
        {
          sessionExpiry: new Date().toISOString(),
        }
      );

      // Log the logout
      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.ADMIN_AUDIT,
        'unique()',
        {
          adminId: adminId,
          action: 'logout',
          details: { source: 'web' },
          timestamp: new Date().toISOString(),
        }
      );
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  async verifySession(adminId: string): Promise<boolean> {
    try {
      const admin = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.ADMINS,
        adminId
      ) as Admin;

      if (!admin.sessionExpiry) return false;

      const expiry = new Date(admin.sessionExpiry);
      return expiry > new Date();
    } catch (error) {
      return false;
    }
  },

  async refreshSession(adminId: string): Promise<void> {
    try {
      const sessionExpiry = new Date();
      sessionExpiry.setMinutes(sessionExpiry.getMinutes() + 15);

      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.ADMINS,
        adminId,
        {
          sessionExpiry: sessionExpiry.toISOString(),
        }
      );
    } catch (error) {
      console.error('Session refresh error:', error);
    }
  },
};