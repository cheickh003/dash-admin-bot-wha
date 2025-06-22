import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Bot, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) {
          setError('Le nom est requis');
          setIsLoading(false);
          return;
        }
        await register(email, password, name);
      } else {
        await login(email, password);
      }
      navigate('/');
    } catch (error: any) {
      if (error.code === 401) {
        setError('Email ou mot de passe incorrect');
      } else if (error.code === 409) {
        setError('Un compte existe déjà avec cet email');
      } else if (error.code === 400) {
        setError('Email ou mot de passe invalide');
      } else {
        setError('Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-whatsapp-green to-whatsapp-darkgreen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-whatsapp-light rounded-full mb-4">
            <Bot className="w-8 h-8 text-whatsapp-darkgreen" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isRegister ? 'Créer un compte admin' : 'Connexion Admin'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isRegister 
              ? 'Créez votre compte administrateur' 
              : 'Connectez-vous pour gérer le bot WhatsApp'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegister && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-green focus:border-transparent outline-none transition-colors"
                  placeholder="Votre nom"
                  required={isRegister}
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-green focus:border-transparent outline-none transition-colors"
                placeholder="admin@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-green focus:border-transparent outline-none transition-colors"
                placeholder={isRegister ? "Minimum 8 caractères" : "••••••••"}
                required
                minLength={isRegister ? 8 : undefined}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-whatsapp-green hover:bg-whatsapp-darkgreen text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>
                  {isRegister ? 'Création du compte...' : 'Connexion...'}
                </span>
              </>
            ) : (
              <span>
                {isRegister ? 'Créer le compte' : 'Se connecter'}
              </span>
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
                setEmail('');
                setPassword('');
                setName('');
              }}
              className="text-sm text-whatsapp-darkgreen hover:underline"
            >
              {isRegister 
                ? 'Déjà un compte ? Se connecter' 
                : "Pas de compte ? S'inscrire"
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};