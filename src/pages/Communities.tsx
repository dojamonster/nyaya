import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Plus, 
  Search,
  TrendingUp,
  Shield,
  Briefcase,
  Home as HomeIcon,
  GraduationCap,
  Scale
} from 'lucide-react';
import { Input } from '@/components/ui/input';

const communities = [
  {
    id: 'workplace',
    name: 'Workplace Harassment',
    description: 'Support and guidance for workplace-related issues, discrimination, and harassment.',
    members: 1247,
    posts: 342,
    icon: Briefcase,
    color: 'bg-community-workplace',
    joined: false,
    trending: true
  },
  {
    id: 'domestic',
    name: 'Domestic Violence Support',
    description: 'A safe space for survivors and those seeking help with domestic violence situations.',
    members: 892,
    posts: 156,
    icon: HomeIcon,
    color: 'bg-community-domestic', 
    joined: true,
    trending: true
  },
  {
    id: 'legal',
    name: 'Legal Help & Rights',
    description: 'Legal advice, know your rights, and connect with legal professionals.',
    members: 634,
    posts: 89,
    icon: Scale,
    color: 'bg-community-legal',
    joined: false,
    trending: false
  },
  {
    id: 'college',
    name: 'College & Campus Issues',
    description: 'Support for students facing harassment, discrimination, or unsafe situations on campus.',
    members: 543,
    posts: 67,
    icon: GraduationCap,
    color: 'bg-community-college',
    joined: true,
    trending: false
  }
];

const Communities = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [joinedCommunities, setJoinedCommunities] = useState(
    new Set(communities.filter(c => c.joined).map(c => c.id))
  );

  const handleJoinToggle = (communityId: string) => {
    const newJoined = new Set(joinedCommunities);
    if (newJoined.has(communityId)) {
      newJoined.delete(communityId);
    } else {
      newJoined.add(communityId);
    }
    setJoinedCommunities(newJoined);
  };

  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Communities</h1>
          <p className="text-muted-foreground">
            Join supportive communities where you can connect with others who understand your experiences.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-xl p-6 shadow-soft border">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Total Members</span>
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">3,316</p>
          </div>
          
          <div className="bg-card rounded-xl p-6 shadow-soft border">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Active Posts</span>
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">654</p>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-soft border">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Safe Spaces</span>
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">{communities.length}</p>
          </div>
        </div>

        {/* Communities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCommunities.map((community) => {
            const Icon = community.icon;
            const isJoined = joinedCommunities.has(community.id);
            
            return (
              <div key={community.id} className="bg-card rounded-xl p-6 shadow-soft border hover:shadow-medium transition-all duration-200">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg ${community.color} text-white flex items-center justify-center`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-foreground">{community.name}</h3>
                        {community.trending && (
                          <Badge variant="secondary" className="text-xs">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{community.description}</p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{community.members.toLocaleString()} members</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-muted-foreground">{community.posts} posts</span>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  variant={isJoined ? "secondary" : "default"}
                  className="w-full"
                  onClick={() => handleJoinToggle(community.id)}
                >
                  {isJoined ? (
                    <>
                      <Users className="h-4 w-4 mr-2" />
                      Joined
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Join Community
                    </>
                  )}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredCommunities.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No communities found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or browse all available communities.
            </p>
          </div>
        )}

        {/* Create Community CTA */}
        <div className="mt-12 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Don't see the community you need?
          </h3>
          <p className="text-muted-foreground mb-4">
            We're always looking to add new safe spaces for different experiences.
          </p>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Suggest New Community
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Communities;