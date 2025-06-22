# Guide de Déploiement - Jarvis Admin Web

## Déploiement sur Appwrite Sites

### 1. Préparer le projet

```bash
# S'assurer que tout fonctionne en local
npm install
npm run dev

# Build de production
npm run build

# Vérifier le build
npm run preview
```

### 2. Configurer dans Appwrite Console

1. Connectez-vous à [Appwrite Cloud Console](https://cloud.appwrite.io)
2. Sélectionnez votre projet (ID: `68586340002f83db8623`)
3. Allez dans **Hosting** > **Sites**

### 3. Créer un nouveau site

1. Cliquez sur **"Create Site"**
2. Remplissez les informations:
   - **Name**: `jarvis-admin`
   - **Git provider**: GitHub
   - **Repository**: Votre repo Git
   - **Branch**: `main` ou `master`
   - **Root directory**: `/web-admin`
   - **Build command**: `npm run build`
   - **Output directory**: `dist`

### 4. Variables d'environnement (si nécessaire)

Pour l'instant, la configuration est codée en dur dans `src/services/appwrite.ts`.
Si vous voulez utiliser des variables d'environnement:

1. Créer `.env.production`:
   ```
   VITE_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
   VITE_APPWRITE_PROJECT_ID=68586340002f83db8623
   ```

2. Modifier `src/services/appwrite.ts`:
   ```typescript
   const client = new Client()
     .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
     .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);
   ```

3. Ajouter les variables dans Appwrite Sites

### 5. Déploiement automatique

Une fois configuré:
- Chaque push sur la branche principale déclenche un build
- Le site est automatiquement déployé
- URL: `https://jarvis-admin-[id].appwrite.global`

### 6. Domaine personnalisé (optionnel)

1. Dans les paramètres du site, cliquez sur **"Add Domain"**
2. Entrez votre domaine: `admin.nourx.com`
3. Configurez les DNS:
   ```
   Type: CNAME
   Name: admin
   Value: jarvis-admin-[id].appwrite.global
   ```

### 7. Post-déploiement

1. **Tester l'authentification**:
   - Numéro: `2250703079410`
   - PIN: `1471`

2. **Vérifier les permissions**:
   - Les collections doivent avoir les bonnes permissions
   - L'admin doit pouvoir lire/écrire

3. **Monitoring**:
   - Vérifier les logs dans Appwrite Console
   - Surveiller les erreurs dans la console navigateur

## Déploiement manuel (alternative)

Si vous préférez un déploiement manuel:

```bash
# Build local
npm run build

# Upload via Appwrite CLI
appwrite storage createFile \
  --bucket-id sites \
  --file-id unique() \
  --file ./dist
```

## Rollback

En cas de problème:
1. Allez dans l'historique des déploiements
2. Cliquez sur une version précédente
3. Sélectionnez **"Rollback to this deployment"**

## Troubleshooting

### Erreur de build
- Vérifier les logs de build dans Appwrite Console
- Tester le build en local: `npm run build`

### Page blanche
- Vérifier la console navigateur (F12)
- S'assurer que les URLs Appwrite sont correctes
- Vérifier les CORS dans Appwrite

### Erreur d'authentification
- Vérifier que la collection `admins` existe
- Vérifier les permissions des collections
- S'assurer que l'admin existe avec le bon PIN

## Support

- Documentation Appwrite: https://appwrite.io/docs
- Console Appwrite: https://cloud.appwrite.io
- Logs du bot: Sur le serveur avec `./bot-manager.sh logs`