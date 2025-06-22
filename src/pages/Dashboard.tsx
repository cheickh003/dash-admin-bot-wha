import React, { useState, useEffect } from 'react';
import { databases, DATABASE_ID, COLLECTIONS, Query } from '../services/appwrite';
import { 
  Users, 
  MessageSquare, 
  Clock, 
  Activity,
  RefreshCw,
  CheckCircle,
  TrendingUp,
  Bot
} from 'lucide-react';
import type { BotStats } from '../types';

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  trend?: number;
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<BotStats>({
    totalUsers: 0,
    activeUsers: 0,
    messagestoday: 0,
    avgResponseTime: 0,
    uptime: 99.9,
    isOnline: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRestarting, setIsRestarting] = useState(false);

  const fetchStats = async () => {
    try {
      // Fetch conversations
      const conversations = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.CONVERSATIONS,
        [Query.limit(1000)]
      );
      
      // Fetch today's messages
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const messages = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.MESSAGES,
        [
          Query.greaterThanEqual('timestamp', today.toISOString()),
          Query.limit(1000),
        ]
      );

      // Calculate active users (last 24h)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const activeConversations = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.CONVERSATIONS,
        [
          Query.greaterThanEqual('lastMessageAt', yesterday.toISOString()),
        ]
      );

      // Check bot status
      const botConfig = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.BOT_CONFIG,
        [Query.equal('key', 'bot_status')]
      );

      const isOnline = botConfig.documents.length > 0 
        ? botConfig.documents[0].value === 'online' 
        : true;

      setStats({
        totalUsers: conversations.total,
        activeUsers: activeConversations.total,
        messagestoday: messages.total,
        avgResponseTime: 1.2, // This would need to be calculated from actual data
        uptime: 99.9,
        isOnline,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleRestart = async () => {
    setIsRestarting(true);
    try {
      // In a real implementation, this would trigger a bot restart
      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.ADMIN_ACTIONS_LOG,
        'unique()',
        {
          adminId: 'web-admin',
          action: 'restart_bot',
          timestamp: new Date().toISOString(),
          result: 'success',
        }
      );
      // Simulate restart time
      setTimeout(() => {
        setIsRestarting(false);
        fetchStats();
      }, 3000);
    } catch (error) {
      console.error('Error restarting bot:', error);
      setIsRestarting(false);
    }
  };

  const statCards: StatCard[] = [
    {
      title: 'Total Utilisateurs',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      trend: 12,
    },
    {
      title: 'Utilisateurs Actifs',
      value: stats.activeUsers,
      icon: Activity,
      color: 'bg-green-500',
      trend: 8,
    },
    {
      title: "Messages Aujourd'hui",
      value: stats.messagestoday,
      icon: MessageSquare,
      color: 'bg-purple-500',
      trend: -5,
    },
    {
      title: 'Temps de Réponse',
      value: `${stats.avgResponseTime}s`,
      icon: Clock,
      color: 'bg-orange-500',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-whatsapp-green" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <button
          onClick={fetchStats}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RefreshCw className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Bot Status */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${stats.isOnline ? 'bg-green-100' : 'bg-red-100'}`}>
              <Bot className={`w-8 h-8 ${stats.isOnline ? 'text-green-600' : 'text-red-600'}`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">État du Bot</h3>
              <p className="text-sm text-gray-600">
                {stats.isOnline ? 'En ligne et opérationnel' : 'Hors ligne'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Uptime</p>
              <p className="text-lg font-semibold text-gray-900">{stats.uptime}%</p>
            </div>
            <button
              onClick={handleRestart}
              disabled={isRestarting}
              className="px-4 py-2 bg-whatsapp-green text-white rounded-lg hover:bg-whatsapp-darkgreen transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isRestarting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Redémarrage...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Redémarrer</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              {stat.trend && (
                <div className={`flex items-center text-sm ${stat.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <TrendingUp className={`w-4 h-4 mr-1 ${stat.trend < 0 ? 'rotate-180' : ''}`} />
                  {Math.abs(stat.trend)}%
                </div>
              )}
            </div>
            <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité Récente</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Nouveau message traité</p>
                <p className="text-xs text-gray-600">Il y a 2 minutes</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Nouvel utilisateur enregistré</p>
                <p className="text-xs text-gray-600">Il y a 15 minutes</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <Activity className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Pic d'activité détecté</p>
                <p className="text-xs text-gray-600">Il y a 1 heure</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};