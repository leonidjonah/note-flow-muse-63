import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { parseNoteSections, joinNoteSections, createEmptySection, NoteSection } from '@/utils/markdown';

interface MarkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
}

export const MarkdownEditor = ({ content, onChange, className = "" }: MarkdownEditorProps) => {
  const [sections, setSections] = useState<NoteSection[]>([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Parse content into sections
  useEffect(() => {
    const parsedSections = parseNoteSections(content);
    setSections(parsedSections);
    if (currentSectionIndex >= parsedSections.length) {
      setCurrentSectionIndex(Math.max(0, parsedSections.length - 1));
    }
  }, [content, currentSectionIndex]);

  // Update content when sections change
  const updateContent = (newSections: NoteSection[]) => {
    const joinedContent = joinNoteSections(newSections);
    onChange(joinedContent);
  };

  // Handle section content change
  const handleSectionChange = (newContent: string) => {
    const newSections = [...sections];
    if (newSections[currentSectionIndex]) {
      newSections[currentSectionIndex] = {
        ...newSections[currentSectionIndex],
        content: newContent
      };
      setSections(newSections);
      updateContent(newSections);
    }
  };

  // Navigation functions
  const goToPreviousSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  const goToNextSection = () => {
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };

  // Add new section
  const addNewSection = () => {
    const newSection: NoteSection = {
      content: "# New Section\n\nAdd your content here...",
      index: sections.length
    };
    const newSections = [...sections, newSection];
    setSections(newSections);
    updateContent(newSections);
    setCurrentSectionIndex(sections.length);
  };

  // Delete current section
  const deleteCurrentSection = () => {
    if (sections.length > 1) {
      const newSections = sections.filter((_, index) => index !== currentSectionIndex);
      const updatedSections = newSections.map((section, index) => ({
        ...section,
        index
      }));
      setSections(updatedSections);
      updateContent(updatedSections);
      if (currentSectionIndex >= updatedSections.length) {
        setCurrentSectionIndex(Math.max(0, updatedSections.length - 1));
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            goToPreviousSection();
            break;
          case 'ArrowRight':
            e.preventDefault();
            goToNextSection();
            break;
          case 'n':
            e.preventDefault();
            addNewSection();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSectionIndex, sections.length]);

  const currentSection = sections[currentSectionIndex];

  if (!currentSection) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="text-center py-8 text-muted-foreground">
          <p>No content yet. Start typing to create your first section.</p>
        </div>
        <Textarea
          ref={textareaRef}
          value=""
          onChange={(e) => onChange(e.target.value)}
          placeholder="# My First Note

Start writing your markdown content here...

Use --- to create new sections that you can navigate like slides!"
          className="min-h-[300px] font-mono text-sm"
        />
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Section Navigation Header */}
      <div className="flex items-center justify-between bg-muted/30 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPreviousSection}
            disabled={currentSectionIndex === 0}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-sm font-medium">
            Section {currentSectionIndex + 1} of {sections.length}
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={goToNextSection}
            disabled={currentSectionIndex === sections.length - 1}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`h-8 px-3 ${isPreviewMode ? 'bg-secondary text-secondary-foreground' : ''}`}
          >
            {isPreviewMode ? <Edit className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={addNewSection}
            className="h-8 px-3 hover:bg-secondary hover:text-secondary-foreground"
          >
            <Plus className="h-4 w-4" />
          </Button>
          
          {sections.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={deleteCurrentSection}
              className="h-8 px-3 hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Section Content */}
      <div className="min-h-[400px]">
        {isPreviewMode ? (
          <Card className="p-6 min-h-[400px] bg-card">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {currentSection.content}
              </ReactMarkdown>
            </div>
          </Card>
        ) : (
          <Textarea
            ref={textareaRef}
            value={currentSection.content}
            onChange={(e) => handleSectionChange(e.target.value)}
            placeholder="# Section Title

Write your markdown content here...

**Tips:**
- Use --- to create new sections
- Press Alt + ← → to navigate sections
- Press Alt + N to add new section"
            className="min-h-[400px] font-mono text-sm resize-none"
          />
        )}
      </div>

      {/* Section Indicators */}
      {sections.length > 1 && (
        <div className="flex justify-center gap-2">
          {sections.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSectionIndex(index)}
              className={`h-2 rounded-full transition-all duration-200 ${
                index === currentSectionIndex
                  ? 'w-8 bg-secondary'
                  : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
      )}

      {/* Help Text */}
      <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
        Use Alt + ← → to navigate sections • Alt + N for new section • Toggle preview mode with the eye icon
      </div>
    </div>
  );
};