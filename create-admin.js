// Script pour créer l'admin par défaut
import { Client, Databases, ID } from 'appwrite';

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('68586340002f83db8623');

const databases = new Databases(client);
const DATABASE_ID = 'whatsapp_chatbot_db';

async function createDefaultAdmin() {
  console.log('Creating default admin...\n');

  try {
    const adminData = {
      phoneNumber: '2250703079410',
      pin: '1471',
      name: 'Admin Principal',
      createdAt: new Date().toISOString(),
      lastAuth: null,
      sessionExpiry: null
    };

    const admin = await databases.createDocument(
      DATABASE_ID,
      'admins',
      ID.unique(),
      adminData
    );

    console.log('✅ Admin created successfully!');
    console.log('Admin ID:', admin.$id);
    console.log('Phone:', admin.phoneNumber);
    console.log('Name:', admin.name);
    console.log('PIN:', admin.pin);
    console.log('\nYou can now login with these credentials.');

  } catch (error) {
    if (error.code === 409) {
      console.log('❌ Admin already exists with this phone number');
    } else {
      console.error('❌ Error creating admin:', error.message);
    }
  }
}

createDefaultAdmin();