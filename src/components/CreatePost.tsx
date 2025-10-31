import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Hash, 
  X,
  Image,
  Lock,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreatePostProps {
  onSubmit: (content: string, tags: string[]) => void;
  isSecure?: boolean;
}

const suggestedTags = [
  'WorkplaceHarassment',
  'DomesticViolence', 
  'LegalHelp',
  'CollegeIssues',
  'Solidarity',
  'SupportNetworks',
  'KnowYourRights',
  'MentalHealth'
];

export const CreatePost = ({ onSubmit, isSecure = false }: CreatePostProps) => {
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please write something before posting",
        variant: "destructive"
      });
      return;
    }

    const tagsWithHash = selectedTags.map(tag => `#${tag}`);
    onSubmit(content, tagsWithHash);
    
    // Reset form
    setContent('');
    setSelectedTags([]);
    setCustomTag('');

    toast({
      title: "Post created",
      description: "Your post has been shared with the community",
    });
  };

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag) && selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const addCustomTag = () => {
    const cleanTag = customTag.trim().replace(/^#/, '');
    if (cleanTag && !selectedTags.includes(cleanTag)) {
      addTag(cleanTag);
      setCustomTag('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addCustomTag();
    }
  };

  return (
    <div className="bg-gradient-to-br from-card to-purple-50/30 rounded-xl p-6 shadow-medium border border-purple-100 hover:shadow-strong transition-all duration-300">
      <div className="flex items-center space-x-2 mb-4">
        {isSecure ? (
          <div className="p-2 bg-gradient-to-br from-primary to-pink-500 rounded-lg">
            <Lock className="h-5 w-5 text-white" />
          </div>
        ) : (
          <div className="p-2 bg-gradient-to-br from-primary to-pink-500 rounded-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
        )}
        <h3 className="font-semibold text-foreground text-lg">
          {isSecure ? 'Share Secure Evidence' : 'Share Your Voice'}
        </h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Content Input */}
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={isSecure 
            ? "Share evidence or important information securely..." 
            : "What's on your mind? Share your experience, offer support, or ask for help..."
          }
          className="min-h-[120px] resize-none border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-white/50"
          maxLength={500}
        />
        
        <div className="text-sm text-muted-foreground text-right">
          {content.length}/500 characters
        </div>

        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <Badge 
                key={tag} 
                className="flex items-center space-x-1 bg-gradient-to-r from-primary/90 to-pink-500/90 text-white hover:from-primary hover:to-pink-500 transition-all animate-scale-in"
              >
                <Hash className="h-3 w-3" />
                <span>{tag}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTag(tag)}
                  className="h-4 w-4 p-0 ml-1 hover:bg-white/20 text-white"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}

        {/* Custom Tag Input */}
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add custom tag"
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-white/50"
            />
          </div>
          <Button 
            type="button"
            variant="outline"
            size="sm"
            onClick={addCustomTag}
            disabled={!customTag.trim() || selectedTags.length >= 5}
          >
            Add Tag
          </Button>
        </div>

        {/* Suggested Tags */}
        {selectedTags.length < 5 && (
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Suggested tags:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedTags
                .filter(tag => !selectedTags.includes(tag))
                .slice(0, 6)
                .map((tag) => (
                  <Button
                    key={tag}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addTag(tag)}
                    className="text-xs hover:bg-gradient-to-r hover:from-primary/10 hover:to-pink-500/10 hover:text-primary hover:border-primary/50 transition-all hover:scale-105"
                  >
                    <Hash className="h-3 w-3 mr-1" />
                    {tag}
                  </Button>
                ))
              }
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center space-x-2">
            <Button type="button" variant="ghost" size="sm">
              <Image className="h-4 w-4 mr-2" />
              Photo
            </Button>
          </div>
          
          <Button 
            type="submit" 
            disabled={!content.trim()}
            className="flex items-center space-x-2 bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-500/90 shadow-medium hover:shadow-strong transition-all hover:scale-105"
          >
            <Send className="h-4 w-4" />
            <span>{isSecure ? 'Post Securely' : 'Post'}</span>
          </Button>
        </div>
      </form>
    </div>
  );
};