# Créer l'Admin par défaut

Comme vous utilisez Appwrite Cloud, vous devez créer l'admin manuellement via la console Appwrite.

## Étapes

### 1. Accéder à la console Appwrite
1. Allez sur https://cloud.appwrite.io
2. Connectez-vous à votre compte
3. Sélectionnez votre projet (ID: `68586340002f83db8623`)

### 2. Créer l'admin
1. Dans le menu de gauche, cliquez sur **"Databases"**
2. Sélectionnez la base **"whatsapp_chatbot_db"**
3. Cliquez sur la collection **"admins"**
4. Cliquez sur **"Create document"**
5. Remplissez les champs:
   ```json
   {
     "phoneNumber": "2250703079410",
     "pin": "1471",
     "name": "Admin Principal",
     "createdAt": "2025-06-22T22:30:00.000Z",
     "lastAuth": null,
     "sessionExpiry": null
   }
   ```
6. Cliquez sur **"Create"**

### 3. Vérifier les permissions
1. Allez dans **"Settings"** de la collection `admins`
2. Vérifiez que les permissions permettent:
   - Read: Any
   - Update: Any
   - Delete: Users

### 4. Tester la connexion
1. Ouvrez l'interface web: http://localhost:5173
2. Connectez-vous avec:
   - Téléphone: `2250703079410`
   - PIN: `1471`

## Alternative: Utiliser une clé API

Si vous préférez automatiser la création:

1. Dans Appwrite Console, allez dans **"Overview"** > **"API Keys"**
2. Créez une nouvelle clé API avec les permissions:
   - `databases.write`
   - `databases.read`
3. Modifiez `create-admin.js`:
   ```javascript
   const client = new Client()
     .setEndpoint('https://fra.cloud.appwrite.io/v1')
     .setProject('68586340002f83db8623')
     .setKey('YOUR_API_KEY_HERE'); // Ajoutez cette ligne
   ```
4. Exécutez: `node create-admin.js`

## Troubleshooting

### Erreur "User not authorized"
- Vérifiez les permissions de la collection
- Utilisez une clé API avec les bonnes permissions

### L'admin existe déjà
- Supprimez l'ancien document dans la console
- Ou modifiez le PIN de l'admin existant

### Erreur de connexion
- Vérifiez que le numéro est exactement: `2250703079410`
- Vérifiez que le PIN est exactement: `1471`
- Vérifiez les logs dans la console navigateur (F12)