import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { PostCard } from '@/components/PostCard';
import { CreatePost } from '@/components/CreatePost';
import { Button } from '@/components/ui/button';
import { Hash, TrendingUp, Users, Sparkles, Shield, Heart, MessageCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/30 to-pink-50/30">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="mb-8 animate-slide-up">
          <div className="relative overflow-hidden rounded-2xl gradient-hero p-8 md:p-12 shadow-strong">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-float" />
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-10 w-10 text-white" />
                <Sparkles className="h-6 w-6 text-white animate-pulse" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Welcome to Nyaya
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-6">
                A safe, supportive space to share experiences, connect with understanding communities, and find your voice.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <Users className="h-5 w-5 text-white" />
                  <span className="text-white font-semibold">2,847 Members</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <MessageCircle className="h-5 w-5 text-white" />
                  <span className="text-white font-semibold">156 Posts Today</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <Heart className="h-5 w-5 text-white" />
                  <span className="text-white font-semibold">Unlimited Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">

            <div className="animate-scale-in" style={{ animationDelay: '200ms' }}>
              <CreatePost onSubmit={handleNewPost} />
            </div>

            <div className="space-y-4">
              {posts.map((post, index) => (
                <div 
                  key={post.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                  <PostCard 
                    post={post} 
                    onLike={() => handleLike(post.id)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Tags */}
            <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 shadow-medium border border-purple-100 hover:shadow-strong transition-all duration-300 animate-scale-in" style={{ animationDelay: '300ms' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-gradient-to-br from-primary to-pink-500 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-foreground">Trending Topics</h3>
              </div>
              <div className="space-y-2">
                {trendingTags.map((tag, index) => (
                  <Button 
                    key={index}
                    variant="ghost" 
                    size="sm"
                    className="w-full justify-start text-left p-3 h-auto hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:scale-105 transition-all duration-200 group"
                  >
                    <Hash className="h-4 w-4 mr-2 text-primary group-hover:scale-110 transition-transform" />
                    <span className="group-hover:text-primary transition-colors">{tag.slice(1)}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-card to-purple-50/50 rounded-xl p-6 shadow-medium border border-purple-100 hover:shadow-strong transition-all duration-300 animate-scale-in" style={{ animationDelay: '400ms' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-gradient-to-br from-primary to-pink-500 rounded-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-foreground">Community Stats</h3>
              </div>
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-lg bg-white/50 p-3 hover:bg-white/80 transition-all group">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">Active Members</span>
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">2,847</span>
                  </div>
                  <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100" />
                </div>
                <div className="relative overflow-hidden rounded-lg bg-white/50 p-3 hover:bg-white/80 transition-all group">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">Posts Today</span>
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">156</span>
                  </div>
                  <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100" />
                </div>
                <div className="relative overflow-hidden rounded-lg bg-white/50 p-3 hover:bg-white/80 transition-all group">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">Support Given</span>
                    <span className="text-2xl font-bold text-primary">∞</span>
                  </div>
                  <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100" />
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