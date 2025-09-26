import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Users, 
  MessageSquare, 
  Heart, 
  User, 
  LogOut, 
  AlertTriangle,
  Shield
} from 'lucide-react';

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Communities', path: '/communities', icon: Users },
  { name: 'Forum', path: '/forum', icon: MessageSquare },
  { name: 'Support', path: '/support', icon: Heart },
  { name: 'Profile', path: '/profile', icon: User },
];

export const Navigation = () => {
  const location = useLocation();
  const [showPanicConfirm, setShowPanicConfirm] = useState(false);

  const handlePanicButton = () => {
    if (showPanicConfirm) {
      window.location.href = 'https://www.google.com';
    } else {
      setShowPanicConfirm(true);
      setTimeout(() => setShowPanicConfirm(false), 3000);
    }
  };

  const handleLogout = () => {
    // Simple logout for now
    localStorage.removeItem('nyaya-user');
    window.location.href = '/';
  };

  return (
    <nav className="bg-card border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">Nyaya</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.name} to={item.path}>
                  <Button 
                    variant={isActive ? "secondary" : "ghost"} 
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Panic Button */}
            <Button
              variant={showPanicConfirm ? "destructive" : "outline"}
              size="sm"
              onClick={handlePanicButton}
              className="flex items-center space-x-1"
            >
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">
                {showPanicConfirm ? 'Click again to exit' : 'Panic'}
              </span>
            </Button>

            {/* Logout */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-1"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-border">
          <div className="flex justify-around py-2">
            {navItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.name} to={item.path}>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={`flex flex-col items-center space-y-1 ${isActive ? 'text-primary' : ''}`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs">{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};