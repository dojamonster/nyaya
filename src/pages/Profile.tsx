import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Edit, 
  Save, 
  Shield, 
  Clock, 
  Heart, 
  Users, 
  MessageSquare,
  Settings,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock user data
const initialUserData = {
  username: 'SafeVoice47',
  avatar: '🌸',
  joinDate: 'March 2024',
  lastActive: '2 hours ago',
  postsCount: 15,
  likesReceived: 143,
  communitiesJoined: 3,
  supportGiven: 28
};

const communityMemberships = [
  { name: 'Workplace Harassment', role: 'Member', joinDate: 'Mar 2024' },
  { name: 'Domestic Violence Support', role: 'Member', joinDate: 'Mar 2024' },
  { name: 'Legal Help & Rights', role: 'Contributor', joinDate: 'Apr 2024' }
];

const recentActivity = [
  { action: 'Posted in Workplace Harassment', time: '2h ago' },
  { action: 'Liked post by Guardian_Voice', time: '4h ago' },
  { action: 'Joined Legal Help community', time: '1d ago' },
  { action: 'Commented on support post', time: '2d ago' }
];

const Profile = () => {
  const [userData, setUserData] = useState(initialUserData);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: userData.username,
    avatar: userData.avatar
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    setUserData({
      ...userData,
      username: editForm.username,
      avatar: editForm.avatar
    });
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been saved successfully",
    });
  };

  const handleAvatarRefresh = () => {
    const avatars = ['🌸', '🦋', '🌺', '🌻', '🌷', '🌹', '🌿', '🍀', '🌙', '⭐', '💫', '🌈'];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    setEditForm({ ...editForm, avatar: randomAvatar });
  };

  const handleExportData = () => {
    toast({
      title: "Data export started",
      description: "Your data will be downloaded shortly",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account deletion",
      description: "Please contact support to delete your account",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Basic Profile Card */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Profile</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Avatar */}
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center text-3xl">
                    {isEditing ? editForm.avatar : userData.avatar}
                  </div>
                  {isEditing && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleAvatarRefresh}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      New Avatar
                    </Button>
                  )}
                </div>

                {/* Username */}
                <div>
                  <Label htmlFor="username">Username</Label>
                  {isEditing ? (
                    <Input
                      id="username"
                      value={editForm.username}
                      onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-foreground font-semibold mt-1">{userData.username}</p>
                  )}
                </div>

                {/* Member Since */}
                <div>
                  <Label>Member Since</Label>
                  <p className="text-muted-foreground mt-1">{userData.joinDate}</p>
                </div>

                {/* Last Active */}
                <div>
                  <Label>Last Active</Label>
                  <p className="text-muted-foreground mt-1">{userData.lastActive}</p>
                </div>

                {isEditing && (
                  <Button onClick={handleSave} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Privacy & Security */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-primary" />
                  Privacy & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Anonymous Mode</span>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Profile Visibility</span>
                  <Badge variant="secondary">Community Only</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Data Encryption</span>
                  <Badge variant="secondary">Enabled</Badge>
                </div>
                <Separator />
                <Button variant="outline" size="sm" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Privacy Settings
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="shadow-soft">
                <CardContent className="p-4 text-center">
                  <MessageSquare className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{userData.postsCount}</p>
                  <p className="text-sm text-muted-foreground">Posts</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-soft">
                <CardContent className="p-4 text-center">
                  <Heart className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{userData.likesReceived}</p>
                  <p className="text-sm text-muted-foreground">Likes</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-soft">
                <CardContent className="p-4 text-center">
                  <Users className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{userData.communitiesJoined}</p>
                  <p className="text-sm text-muted-foreground">Communities</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-soft">
                <CardContent className="p-4 text-center">
                  <Shield className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{userData.supportGiven}</p>
                  <p className="text-sm text-muted-foreground">Support Given</p>
                </CardContent>
              </Card>
            </div>

            {/* Community Memberships */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Community Memberships</CardTitle>
                <CardDescription>Communities you're part of</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {communityMemberships.map((community, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <h4 className="font-semibold text-foreground">{community.name}</h4>
                        <p className="text-sm text-muted-foreground">Joined {community.joinDate}</p>
                      </div>
                      <Badge variant="outline">{community.role}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <span className="text-foreground">{activity.action}</span>
                      <span className="text-sm text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Advanced Settings */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  <span>Advanced Settings</span>
                  {showAdvanced ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </CardTitle>
              </CardHeader>
              {showAdvanced && (
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button 
                      variant="outline"
                      onClick={handleExportData}
                      className="flex items-center justify-center"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export My Data
                    </Button>
                    
                    <Button 
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      className="flex items-center justify-center"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Data Export:</strong> Download all your posts, comments, and account data.<br/>
                      <strong>Account Deletion:</strong> Permanently remove your account and all associated data.
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;