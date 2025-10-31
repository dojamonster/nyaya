import { useState, useEffect } from 'react';
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
  Shield,
  Sparkles
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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'glass-effect shadow-medium' 
        : 'bg-card/80 backdrop-blur-sm border-b border-border/50'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Shield className="h-8 w-8 text-primary transition-transform group-hover:scale-110 group-hover:rotate-6" />
              <Sparkles className="h-3 w-3 text-primary absolute -top-1 -right-1 animate-pulse" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
              Nyaya
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link 
                  key={item.name} 
                  to={item.path}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Button 
                    variant={isActive ? "secondary" : "ghost"} 
                    size="sm"
                    className={`flex items-center space-x-2 transition-all duration-200 ${
                      isActive 
                        ? 'shadow-soft scale-105' 
                        : 'hover:scale-105 hover:-translate-y-0.5'
                    }`}
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
              className={`flex items-center space-x-1 transition-all duration-200 ${
                showPanicConfirm 
                  ? 'animate-pulse shadow-strong' 
                  : 'hover:scale-105'
              }`}
            >
              <AlertTriangle className={`h-4 w-4 ${showPanicConfirm ? 'animate-bounce' : ''}`} />
              <span className="hidden sm:inline">
                {showPanicConfirm ? 'Click again to exit' : 'Panic'}
              </span>
            </Button>

            {/* Logout */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-1 transition-all hover:scale-105"
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