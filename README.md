# Jarvis Admin - Interface Web

Interface d'administration web pour le bot WhatsApp Jarvis, hébergée sur Appwrite Cloud.

## Technologies

- **Frontend**: React 18 avec TypeScript
- **Styling**: Tailwind CSS
- **Routage**: React Router v6
- **Backend**: Appwrite Cloud
- **Build**: Vite
- **Icônes**: Lucide React

## Fonctionnalités

- ✅ Authentification sécurisée (PIN)
- ✅ Dashboard avec statistiques temps réel
- ✅ État du bot et redémarrage à distance
- 🚧 Gestion des conversations
- 🚧 Administration des utilisateurs
- 🚧 Système de tickets
- 🚧 Monitoring et logs
- 🚧 Paramètres et configuration

## Installation

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build pour production
npm run build

# Prévisualiser le build
npm run preview
```

## Configuration

La configuration Appwrite se trouve dans `src/services/appwrite.ts`:
- Endpoint: `https://fra.cloud.appwrite.io/v1`
- Project ID: `68586340002f83db8623`

## Déploiement sur Appwrite Sites

1. Build le projet:
   ```bash
   npm run build
   ```

2. Dans Appwrite Console:
   - Aller dans "Hosting" > "Sites"
   - Créer un nouveau site
   - Connecter votre repo GitHub
   - Définir le dossier de build: `dist`

3. Configuration automatique:
   - Commande de build: `npm run build`
   - Dossier de sortie: `dist`

## Structure du projet

```
src/
├── components/     # Composants réutilisables
├── pages/         # Pages de l'application
├── services/      # Services API (Appwrite)
├── hooks/         # Hooks React personnalisés
├── types/         # Types TypeScript
└── utils/         # Fonctions utilitaires
```

## Développement

### Ajouter une nouvelle page

1. Créer le composant dans `src/pages/`
2. Ajouter la route dans `App.tsx`
3. Ajouter le lien dans `Layout.tsx`

### Connexion avec le bot

L'interface communique avec le bot via Appwrite Cloud:
- Lecture des données en temps réel
- Envoi de commandes via documents
- Subscriptions pour les mises à jour

## Authentification

- Login avec numéro de téléphone + PIN
- Sessions de 15 minutes avec refresh automatique
- Stockage sécurisé dans localStorage
- Audit de toutes les actions admin

## Sécurité

- Validation côté client et serveur
- Protection des routes privées
- Rate limiting sur les tentatives de login
- HTTPS obligatoire en production

## Support

Pour toute question ou problème:
- Logs: Console navigateur (F12)
- Backend: Console Appwrite
- Bot: Logs serveur (`./bot-manager.sh logs`)