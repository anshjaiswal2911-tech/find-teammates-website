import { Link, useLocation, useNavigate } from 'react-router';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Sparkles, 
  User, 
  LogOut,
  Zap,
  MessageCircle,
  Trophy,
  Calendar,
  UserCircle,
  Bell,
  Bot,
  Settings,
  Code2,
  Video,
  Award,
  Rocket
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Assistant', href: '/ai-assistant', icon: Bot },
  { name: 'Find Teammates', href: '/match', icon: Users },
  { name: 'My Teams', href: '/teams', icon: UserCircle },
  { name: 'Messages', href: '/messages', icon: MessageCircle, badge: 2 },
  { name: 'Notifications', href: '/notifications', icon: Bell, badge: 3 },
  { name: 'Events', href: '/events', icon: Calendar },
  { name: 'Event Organizer', href: '/event-organizer', icon: Settings },
  { name: 'Resources', href: '/resources', icon: BookOpen },
  { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
  { name: 'AI Tools', href: '/ai-tools', icon: Sparkles },
  { name: 'Code Challenge', href: '/code-challenge', icon: Code2 },
  { name: 'Meeting Room', href: '/meeting-room', icon: Video },
  { name: 'Achievements', href: '/achievements', icon: Award },
  { name: 'Super Features', href: '/super-features', icon: Rocket },
  { name: 'Profile', href: '/profile', icon: User },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
          <Zap className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-gray-900">CollabNest</h1>
          <p className="text-xs text-gray-500">AI Intelligence Hub</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
              {item.badge && (
                <span className="ml-2 inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-bold text-red-700">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-sm font-semibold text-white">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.college}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}