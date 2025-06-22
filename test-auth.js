// Test script pour vérifier l'authentification avec Appwrite Cloud
import { Client, Databases, Query } from 'appwrite';

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('68586340002f83db8623');

const databases = new Databases(client);
const DATABASE_ID = 'whatsapp_chatbot_db';

async function testAuth() {
  console.log('Testing authentication with Appwrite Cloud...\n');

  try {
    // 1. Vérifier que la collection admins existe
    console.log('1. Checking admins collection...');
    try {
      await databases.listDocuments(DATABASE_ID, 'admins', [Query.limit(1)]);
      console.log('✅ Admins collection exists\n');
    } catch (error) {
      console.log('❌ Admins collection not found\n');
      return;
    }

    // 2. Lister les admins
    console.log('2. Listing admins...');
    const admins = await databases.listDocuments(
      DATABASE_ID,
      'admins',
      [Query.limit(10)]
    );
    console.log(`✅ Found ${admins.total} admin(s)`);
    
    if (admins.documents.length > 0) {
      admins.documents.forEach(admin => {
        console.log(`   - Phone: ${admin.phoneNumber}, Name: ${admin.name || 'N/A'}`);
      });
    }
    console.log('');

    // 3. Vérifier l'admin par défaut
    console.log('3. Checking default admin...');
    const defaultAdmin = await databases.listDocuments(
      DATABASE_ID,
      'admins',
      [Query.equal('phoneNumber', '2250703079410')]
    );
    
    if (defaultAdmin.documents.length > 0) {
      console.log('✅ Default admin exists');
      console.log(`   PIN configured: ${defaultAdmin.documents[0].pin ? 'Yes' : 'No'}`);
    } else {
      console.log('❌ Default admin not found');
      console.log('   You need to create it with: phoneNumber=2250703079410, pin=1471');
    }
    console.log('');

    // 4. Vérifier les autres collections
    console.log('4. Checking other collections...');
    const collections = [
      'conversations',
      'messages',
      'bot_config',
      'admin_audit',
      'tickets',
      'documents'
    ];

    for (const collectionId of collections) {
      try {
        await databases.listDocuments(DATABASE_ID, collectionId, [Query.limit(1)]);
        console.log(`✅ ${collectionId} collection exists`);
      } catch (error) {
        console.log(`❌ ${collectionId} collection missing`);
      }
    }

    console.log('\n✅ Authentication test completed!');
    console.log('\nYou can now login to the web interface with:');
    console.log('Phone: 2250703079410');
    console.log('PIN: 1471');

  } catch (error) {
    console.error('❌ Error during test:', error.message);
    console.error('Make sure Appwrite is properly configured and accessible');
  }
}

testAuth();