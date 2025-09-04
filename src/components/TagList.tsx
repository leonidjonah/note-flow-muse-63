import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface TagListProps {
  tags: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  onTagRemove?: (tag: string) => void;
  editable?: boolean;
  className?: string;
}

export const TagList = ({ 
  tags, 
  selectedTags, 
  onTagSelect, 
  onTagRemove,
  editable = false, 
  className = "" 
}: TagListProps) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => {
        const isSelected = selectedTags.includes(tag);
        return (
          <Badge
            key={tag}
            variant={isSelected ? "default" : "outline"}
            className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
              isSelected 
                ? 'bg-secondary text-secondary-foreground hover:bg-secondary-dark' 
                : 'hover:bg-accent hover:text-accent-foreground'
            }`}
            onClick={() => onTagSelect(tag)}
          >
            #{tag}
            {editable && onTagRemove && (
              <X 
                className="ml-1 h-3 w-3 hover:text-destructive transition-colors" 
                onClick={(e) => {
                  e.stopPropagation();
                  onTagRemove(tag);
                }}
              />
            )}
          </Badge>
        );
      })}
    </div>
  );
};