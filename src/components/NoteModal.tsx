import { useState, useEffect } from 'react';
import { X, Save, Tag, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MarkdownEditor } from './MarkdownEditor';
import { Note, NoteFormData } from '@/types/note';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NoteFormData) => void;
  note?: Note;
  title: string;
}

export const NoteModal = ({ isOpen, onClose, onSave, note, title }: NoteModalProps) => {
  const [formData, setFormData] = useState<NoteFormData>({
    title: '',
    content: '',
    tags: [],
    meeting: '',
    starred: false
  });
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title,
        content: note.content,
        tags: [...note.tags],
        meeting: note.meeting || '',
        starred: note.starred
      });
    } else {
      setFormData({
        title: '',
        content: '',
        tags: [],
        meeting: '',
        starred: false
      });
    }
  }, [note, isOpen]);

  const handleSave = () => {
    if (formData.title.trim() && formData.content.trim()) {
      onSave(formData);
      onClose();
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto animate-scaleIn" onKeyDown={handleKeyDown}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-primary">
              {title}
            </DialogTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setFormData(prev => ({ ...prev, starred: !prev.starred }))}
              className={`transition-all duration-200 ${
                formData.starred 
                  ? 'text-secondary hover:text-secondary-dark' 
                  : 'text-muted-foreground hover:text-secondary'
              }`}
            >
              <Star className={`h-5 w-5 ${formData.starred ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter note title..."
                className="transition-all duration-200 focus:search-focus"
                autoFocus
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="meeting" className="text-sm font-medium">
                Meeting (Optional)
              </Label>
              <Input
                id="meeting"
                value={formData.meeting}
                onChange={(e) => setFormData(prev => ({ ...prev, meeting: e.target.value }))}
                placeholder="Meeting name or topic..."
                className="transition-all duration-200 focus:search-focus"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Content * <span className="text-muted-foreground font-normal">(Markdown supported)</span>
            </Label>
            <MarkdownEditor
              content={formData.content}
              onChange={(content) => setFormData(prev => ({ ...prev, content }))}
            />
          </div>
          
          <div className="space-y-3">
            <Label className="text-sm font-medium">Tags</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Add a tag..."
                  className="pl-10"
                />
              </div>
              <Button onClick={addTag} variant="outline" className="px-4">
                Add
              </Button>
            </div>
            
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="pr-1 hover:bg-secondary-dark transition-colors"
                  >
                    #{tag}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer hover:text-destructive transition-colors"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!formData.title.trim() || !formData.content.trim()}
            className="bg-gradient-secondary hover:opacity-90 transition-opacity"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Note
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
          Press Ctrl+Enter to save • Press Escape to cancel • Click star to favorite
        </div>
      </DialogContent>
    </Dialog>
  );
};