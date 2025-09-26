import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { PostCard } from '@/components/PostCard';
import { CreatePost } from '@/components/CreatePost';
import { Button } from '@/components/ui/button';
import { Hash, TrendingUp, Users } from 'lucide-react';

// Dummy data for posts
const initialPosts = [
  {
    id: '1',
    author: 'SafeVoice47',
    avatar: '🌸',
    content: 'Finding the strength to speak up about workplace harassment. Remember, your voice matters and you are not alone. #WorkplaceHarassment #Solidarity',
    timestamp: '2h ago',
    likes: 23,
    comments: 5,
    tags: ['#WorkplaceHarassment', '#Solidarity'],
    liked: false
  },
  {
    id: '2',
    author: 'Warrior_123',
    avatar: '🦋',
    content: 'To anyone struggling with domestic violence - there are resources and people who want to help. You deserve safety and peace. #DomesticViolence #SupportNetworks',
    timestamp: '4h ago',
    likes: 31,
    comments: 8,
    tags: ['#DomesticViolence', '#SupportNetworks'],
    liked: true
  },
  {
    id: '3',
    author: 'LegalEagle_99',
    avatar: '⚖️',
    content: 'Free legal consultation available for harassment cases this Friday. Knowledge is power - know your rights! #LegalHelp #KnowYourRights',
    timestamp: '6h ago',
    likes: 45,
    comments: 12,
    tags: ['#LegalHelp', '#KnowYourRights'],
    liked: false
  }
];

const trendingTags = [
  '#WorkplaceHarassment',
  '#LegalHelp', 
  '#SupportNetworks',
  '#Solidarity',
  '#KnowYourRights'
];

const Home = () => {
  const [posts, setPosts] = useState(initialPosts);

  const handleNewPost = (content: string, tags: string[]) => {
    const newPost = {
      id: Date.now().toString(),
      author: 'You',
      avatar: '🌺',
      content,
      timestamp: 'now',
      likes: 0,
      comments: 0,
      tags,
      liked: false
    };
    setPosts([newPost, ...posts]);
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-xl p-6 shadow-soft border">
              <h1 className="text-2xl font-bold text-foreground mb-2">Welcome to Nyaya</h1>
              <p className="text-muted-foreground mb-4">
                A safe space to share, support, and connect with others who understand your journey.
              </p>
            </div>

            <CreatePost onSubmit={handleNewPost} />

            <div className="space-y-4">
              {posts.map(post => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onLike={() => handleLike(post.id)}
                />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Tags */}
            <div className="bg-card rounded-xl p-6 shadow-soft border">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Trending Topics</h3>
              </div>
              <div className="space-y-2">
                {trendingTags.map((tag, index) => (
                  <Button 
                    key={index}
                    variant="ghost" 
                    size="sm"
                    className="w-full justify-start text-left p-2 h-auto"
                  >
                    <Hash className="h-4 w-4 mr-2 text-primary" />
                    {tag.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-card rounded-xl p-6 shadow-soft border">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Community</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active Members</span>
                  <span className="font-semibold text-foreground">2,847</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Posts Today</span>
                  <span className="font-semibold text-foreground">156</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Support Given</span>
                  <span className="font-semibold text-primary">∞</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;