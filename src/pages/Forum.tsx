import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { CreatePost } from '@/components/CreatePost';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Lock, 
  Unlock, 
  Search, 
  Shield, 
  AlertTriangle,
  Eye,
  EyeOff,
  Key
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SecurePost {
  id: string;
  author: string;
  avatar: string;
  title: string;
  preview: string;
  timestamp: string;
  category: string;
  isUnlocked: boolean;
  password?: string;
  fullContent?: string;
}

const securePosts: SecurePost[] = [
  {
    id: '1',
    author: 'Anonymous_Legal',
    avatar: '⚖️',
    title: 'Evidence of Workplace Discrimination',
    preview: 'Documented incidents of systematic harassment and discriminatory practices...',
    timestamp: '3h ago',
    category: 'Workplace',
    isUnlocked: false,
    password: 'justice123',
    fullContent: 'Documented incidents of systematic harassment and discriminatory practices at XYZ Corp. Including email evidence, witness statements, and pattern of behavior over 6 months. All documentation has been properly preserved with timestamps and metadata.'
  },
  {
    id: '2',
    author: 'SafeWitness_47',
    avatar: '👁️',
    title: 'Campus Safety Incident Report',
    preview: 'Detailed account of safety incident on university campus with supporting evidence...',
    timestamp: '1d ago',
    category: 'College',
    isUnlocked: false,
    password: 'campus2024',
    fullContent: 'Detailed account of safety incident on university campus with supporting evidence including security footage timestamps, witness contact information, and official incident report numbers. Location: Library parking lot, Date: March 15th, 2024.'
  },
  {
    id: '3',
    author: 'Guardian_Voice',
    avatar: '🛡️',
    title: 'Legal Consultation Resources',
    preview: 'Comprehensive list of pro-bono legal services and consultation resources...',
    timestamp: '2d ago',
    category: 'Legal',
    isUnlocked: false,
    password: 'help2024',
    fullContent: 'Comprehensive list of pro-bono legal services and consultation resources including: 1) National Legal Aid hotlines, 2) State-specific victim advocacy programs, 3) Emergency legal assistance contacts, 4) Documentation best practices for evidence preservation.'
  }
];

const Forum = () => {
  const [posts, setPosts] = useState(securePosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<SecurePost | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const handleNewSecurePost = (content: string, tags: string[]) => {
    // In a real app, this would involve proper encryption
    const newPost: SecurePost = {
      id: Date.now().toString(),
      author: 'You',
      avatar: '🔒',
      title: 'New Secure Evidence',
      preview: content.substring(0, 100) + '...',
      timestamp: 'now',
      category: 'General',
      isUnlocked: true,
      fullContent: content
    };
    setPosts([newPost, ...posts]);
  };

  const handleUnlockPost = (post: SecurePost) => {
    if (passwordInput === post.password) {
      const updatedPosts = posts.map(p => 
        p.id === post.id ? { ...p, isUnlocked: true } : p
      );
      setPosts(updatedPosts);
      setSelectedPost({ ...post, isUnlocked: true });
      setPasswordInput('');
      toast({
        title: "Post unlocked",
        description: "You can now view the full content",
      });
    } else {
      toast({
        title: "Incorrect password",
        description: "Please check the password and try again",
        variant: "destructive"
      });
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Secure Forum</h1>
              <p className="text-muted-foreground">
                Encrypted space for sharing sensitive evidence and information
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-warning/10 border border-warning/20 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-warning">Security Notice</h3>
                <p className="text-sm text-warning/80 mt-1">
                  This is a secure area for sharing sensitive information. Posts are password-protected 
                  and only accessible to those with the correct credentials.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search secure posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Create Secure Post */}
        <div className="mb-8">
          <CreatePost onSubmit={handleNewSecurePost} isSecure={true} />
        </div>

        {/* Secure Posts */}
        <div className="space-y-4">
          {filteredPosts.map(post => (
            <div key={post.id} className="bg-card rounded-xl p-6 shadow-soft border">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-lg">
                    {post.avatar}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-foreground">{post.author}</h4>
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{post.timestamp}</p>
                  </div>
                </div>
                
                {post.isUnlocked ? (
                  <Unlock className="h-5 w-5 text-success" />
                ) : (
                  <Lock className="h-5 w-5 text-muted-foreground" />
                )}
              </div>

              {/* Content */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground mb-2">{post.title}</h3>
                <div className={`${post.isUnlocked ? '' : 'blur-sm select-none'} transition-all duration-200`}>
                  <p className="text-foreground">
                    {post.isUnlocked && post.fullContent ? post.fullContent : post.preview}
                  </p>
                </div>
              </div>

              {/* Actions */}
              {!post.isUnlocked && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center space-x-2"
                      onClick={() => setSelectedPost(post)}
                    >
                      <Key className="h-4 w-4" />
                      <span>Unlock Post</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Unlock Secure Post</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Enter the password to unlock this secure post and view its contents.
                      </p>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter password"
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleUnlockPost(post)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          onClick={() => handleUnlockPost(post)}
                          disabled={!passwordInput.trim()}
                          className="flex-1"
                        >
                          <Unlock className="h-4 w-4 mr-2" />
                          Unlock
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No secure posts found</h3>
            <p className="text-muted-foreground">
              Be the first to share secure evidence or information in this forum.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Forum;