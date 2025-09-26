import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Hash, 
  X,
  Image,
  Lock
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
    <div className="bg-card rounded-xl p-6 shadow-soft border">
      <div className="flex items-center space-x-2 mb-4">
        {isSecure && <Lock className="h-5 w-5 text-primary" />}
        <h3 className="font-semibold text-foreground">
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
          className="min-h-[120px] resize-none border-input focus:border-primary"
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
                variant="secondary"
                className="flex items-center space-x-1"
              >
                <Hash className="h-3 w-3" />
                <span>{tag}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTag(tag)}
                  className="h-4 w-4 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
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
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:border-primary focus:outline-none"
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
                    className="text-xs"
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
            className="flex items-center space-x-2"
          >
            <Send className="h-4 w-4" />
            <span>{isSecure ? 'Post Securely' : 'Post'}</span>
          </Button>
        </div>
      </form>
    </div>
  );
};