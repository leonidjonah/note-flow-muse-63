import { useState } from 'react';
import { Calendar, Users, Edit3, Trash2, Star } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TagList } from './TagList';
import { Note } from '@/types/note';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onToggleStar: (id: string) => void;
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  isKeyboardFocused?: boolean;
  className?: string;
}

export const NoteCard = ({ 
  note, 
  onEdit, 
  onDelete, 
  onToggleStar,
  selectedTags, 
  onTagSelect,
  isKeyboardFocused = false,
  className = "" 
}: NoteCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isKeyboardFocused) {
      onEdit(note);
    }
    if (e.key === 'Delete' && isKeyboardFocused) {
      onDelete(note.id);
    }
    if (e.key === 's' && isKeyboardFocused) {
      e.preventDefault();
      onToggleStar(note.id);
    }
  };

  return (
    <Card 
      className={`note-card shadow-card group cursor-pointer ${
        isKeyboardFocused ? 'keyboard-focus' : ''
      } ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onEdit(note)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2 flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(note.id);
              }}
              className={`h-6 w-6 p-0 transition-all duration-200 ${
                note.starred 
                  ? 'text-secondary hover:text-secondary-dark' 
                  : 'text-muted-foreground hover:text-secondary'
              }`}
            >
              <Star className={`h-4 w-4 ${note.starred ? 'fill-current' : ''}`} />
            </Button>
            <h3 className="font-semibold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors flex-1">
              {note.title}
            </h3>
          </div>
          <div className={`flex gap-1 transition-opacity duration-200 ${
            isHovered || isKeyboardFocused ? 'opacity-100' : 'opacity-0'
          }`}>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(note);
              }}
              className="h-8 w-8 p-0 hover:bg-secondary hover:text-secondary-foreground"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
              className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
          {note.content}
        </p>
        
        {note.tags.length > 0 && (
          <TagList
            tags={note.tags}
            selectedTags={selectedTags}
            onTagSelect={onTagSelect}
          />
        )}
        
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
          <div className="flex items-center gap-4">
            {note.meeting && (
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{note.meeting}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{note.createdAt.toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};