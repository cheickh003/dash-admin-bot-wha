const { Client, Databases, ID } = require('appwrite');

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('68586340002f83db8623');

const databases = new Databases(client);

const DATABASE_ID = 'whatsapp_chatbot_db';
const ADMINS_COLLECTION = 'admins';

async function createAdmin() {
  try {
    // Créer un nouvel admin
    const admin = await databases.createDocument(
      DATABASE_ID,
      ADMINS_COLLECTION,
      ID.unique(),
      {
        phoneNumber: '2250703079410',
        pin: '1471', // En production, ceci devrait être hashé
        name: 'Admin Principal',
        createdAt: new Date().toISOString()
      }
    );

    console.log('Admin créé avec succès !');
    console.log('ID:', admin.$id);
    console.log('Téléphone:', admin.phoneNumber);
    console.log('PIN:', admin.pin);
    console.log('Nom:', admin.name);
    
  } catch (error) {
    console.error('Erreur lors de la création de l\'admin:', error);
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    console.error('Type:', error.type);
  }
}

createAdmin();