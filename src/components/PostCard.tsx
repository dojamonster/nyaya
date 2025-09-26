import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Flag, 
  MoreHorizontal 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';

interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  tags: string[];
  liked: boolean;
}

interface PostCardProps {
  post: Post;
  onLike: () => void;
}

export const PostCard = ({ post, onLike }: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const { toast } = useToast();

  const handleShare = () => {
    navigator.clipboard.writeText(`${post.content} - shared from Nyaya`);
    toast({
      title: "Post shared",
      description: "Link copied to clipboard",
    });
  };

  const handleReport = () => {
    toast({
      title: "Post reported",
      description: "Thank you for keeping our community safe",
    });
  };

  const renderTags = () => {
    if (post.tags.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1 mt-3">
        {post.tags.map((tag, index) => (
          <span 
            key={index}
            className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-soft border transition-all duration-200 hover:shadow-medium">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-lg">
            {post.avatar}
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{post.author}</h4>
            <p className="text-sm text-muted-foreground">{post.timestamp}</p>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleReport}>
              <Flag className="h-4 w-4 mr-2" />
              Report Post
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-foreground leading-relaxed">{post.content}</p>
        {renderTags()}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onLike}
            className={`flex items-center space-x-2 ${post.liked ? 'text-destructive' : ''}`}
          >
            <Heart className={`h-4 w-4 ${post.liked ? 'fill-current' : ''}`} />
            <span>{post.likes}</span>
          </Button>

          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{post.comments}</span>
          </Button>

          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleShare}
            className="flex items-center space-x-2"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm text-muted-foreground text-center">
              Comments feature coming soon...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};