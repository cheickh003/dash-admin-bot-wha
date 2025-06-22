# Configuration de l'authentification Appwrite

L'interface admin utilise maintenant l'authentification native d'Appwrite au lieu de gérer manuellement les admins.

## Configuration dans Appwrite Console

1. **Activer l'authentification Email/Password**
   - Allez dans votre projet Appwrite
   - Auth > Settings
   - Activez "Email/Password"

2. **Créer votre premier compte admin**
   - Option 1: Via l'interface web (recommandé)
     - Accédez à votre interface admin
     - Cliquez sur "Pas de compte ? S'inscrire"
     - Créez votre compte avec email et mot de passe
   
   - Option 2: Via Appwrite Console
     - Auth > Users > Create User
     - Entrez email, mot de passe et nom

3. **Gérer les permissions** (optionnel)
   - Créez un team "admins" dans Appwrite
   - Ajoutez votre utilisateur au team
   - Configurez les permissions des collections pour ce team

## Utilisation

### Connexion
- Email: votre-email@example.com
- Mot de passe: minimum 8 caractères

### Inscription
- L'interface permet de créer de nouveaux comptes admin
- Chaque admin aura accès complet à l'interface

### Sessions
- Les sessions sont gérées automatiquement par Appwrite
- Durée de session par défaut: 365 jours
- Déconnexion manuelle disponible

## Avantages de l'authentification Appwrite

1. **Sécurité renforcée**
   - Mots de passe hashés automatiquement
   - Sessions sécurisées
   - Protection contre les attaques brute-force

2. **Fonctionnalités intégrées**
   - Récupération de mot de passe (à implémenter)
   - Vérification d'email (optionnel)
   - OAuth providers (Google, GitHub, etc.)

3. **Gestion simplifiée**
   - Pas de code personnalisé pour la sécurité
   - Audit logs automatiques
   - Interface de gestion dans Appwrite Console

## Migration depuis l'ancien système

Si vous aviez des admins créés avec l'ancien système (phoneNumber + PIN), vous devez :
1. Créer de nouveaux comptes avec email/password
2. L'ancien système n'est plus utilisé

## Prochaines étapes possibles

- Ajouter la récupération de mot de passe
- Implémenter la vérification d'email
- Ajouter l'authentification 2FA
- Intégrer des providers OAuth