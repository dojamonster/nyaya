import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Flag, 
  MoreHorizontal,
  Sparkles
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
      <div className="flex flex-wrap gap-2 mt-3">
        {post.tags.map((tag, index) => (
          <span 
            key={index}
            className="text-xs bg-gradient-to-r from-primary/10 to-pink-500/10 text-primary px-3 py-1 rounded-full hover:from-primary/20 hover:to-pink-500/20 transition-all cursor-pointer transform hover:scale-105 font-medium"
          >
            {tag}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="group bg-card/80 backdrop-blur-sm rounded-xl p-6 shadow-soft border border-purple-100/50 transition-all duration-300 hover:shadow-strong hover:border-purple-200 hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-pink-500/20 flex items-center justify-center text-lg transform group-hover:scale-110 transition-transform duration-200">
            {post.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-foreground">{post.author}</h4>
              <Sparkles className="h-3 w-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-sm text-muted-foreground">{post.timestamp}</p>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
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
      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onLike}
            className={`flex items-center space-x-2 transition-all hover:scale-110 ${
              post.liked 
                ? 'text-red-500 hover:text-red-600' 
                : 'hover:text-red-500'
            }`}
          >
            <Heart className={`h-5 w-5 transition-all ${
              post.liked ? 'fill-current animate-pulse' : ''
            }`} />
            <span className="font-semibold">{post.likes}</span>
          </Button>

          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 hover:text-primary hover:scale-110 transition-all"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="font-semibold">{post.comments}</span>
          </Button>

          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleShare}
            className="flex items-center space-x-2 hover:text-primary hover:scale-110 transition-all"
          >
            <Share2 className="h-5 w-5" />
            <span className="text-sm font-medium">Share</span>
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