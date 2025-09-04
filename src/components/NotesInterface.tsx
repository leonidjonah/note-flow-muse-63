import { useState, useEffect, useCallback } from 'react';
import { Plus, Grid, List, Filter, Keyboard, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchBar } from './SearchBar';
import { NoteCard } from './NoteCard';
import { NoteModal } from './NoteModal';
import { TagList } from './TagList';
import { Note, NoteFormData } from '@/types/note';

export const NotesInterface = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [keyboardFocusIndex, setKeyboardFocusIndex] = useState(-1);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  // Sample data
  useEffect(() => {
    const sampleNotes: Note[] = [
      {
        id: '1',
        title: 'Q1 Planning Meeting',
        content: `# Q1 Planning Overview

## Key Objectives
- **Product Roadmap**: Define features for Q1 release
- **Resource Allocation**: Team assignments and budget planning  
- **Timeline**: Critical milestones and deadlines

### Action Items
- [ ] Budget approval process
- [ ] Resource planning document
- [ ] Stakeholder alignment meeting

---

# Budget Planning

## Current Status
- **Allocated**: $150,000
- **Requested**: $200,000
- **Gap**: $50,000

## Breakdown by Category
1. **Engineering**: 60%
2. **Design**: 25% 
3. **Marketing**: 15%

### Next Steps
Need to present business case for additional funding by Friday.

---

# Timeline & Milestones

## Q1 Schedule

### January
- Week 1-2: Planning & Setup
- Week 3-4: Development Sprint 1

### February  
- Week 1-2: Development Sprint 2
- Week 3-4: Testing & QA

### March
- Week 1-2: Bug fixes & polish
- Week 3-4: Release preparation

**Key Deadline**: March 31st - Q1 Release`,
        tags: ['planning', 'q1', 'roadmap'],
        meeting: 'Product Team Sync',
        starred: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
      {
        id: '2',
        title: 'User Research Insights',
        content: `# User Research Findings

## Overview
Conducted 15 user interviews over 2 weeks to understand pain points and feature requests.

### Methodology
- **Participants**: 15 users (mix of free & paid)
- **Duration**: 30-45 minutes each
- **Format**: Virtual interviews via Zoom

---

# Key Findings

## Search Functionality (85% mentioned)
> "I can't find what I'm looking for quickly enough"

### Current Issues:
- Search is too slow
- Results aren't relevant
- No filters or sorting options

### Recommendations:
- Implement instant search
- Add advanced filters
- Improve search algorithm

---

# Mobile Experience (70% feedback)

## Pain Points:
- **Navigation**: Hard to find features on mobile
- **Performance**: App feels slow on older devices  
- **UI Elements**: Buttons too small, text hard to read

## Suggestions:
- Larger touch targets
- Simplified navigation menu
- Performance optimizations
- Better responsive design

---

# Action Items

## High Priority
1. **Search improvements** - Sprint 1
2. **Mobile navigation** - Sprint 2  
3. **Performance optimization** - Sprint 3

## Medium Priority
- Advanced search filters
- Mobile UI improvements
- User onboarding flow

*Next research session planned for end of month*`,
        tags: ['research', 'users', 'insights'],
        meeting: 'UX Research Review',
        starred: false,
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-12'),
      },
      {
        id: '3',
        title: 'Technical Architecture Review',
        content: `# System Architecture Review

## Current State Analysis
Reviewed our existing architecture for scalability and performance issues.

### Architecture Overview
- **Frontend**: React + TypeScript
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Cache**: Redis
- **CDN**: CloudFlare

---

# Identified Issues

## Scalability Concerns

### Database Performance
- Query response times > 500ms
- Missing indexes on frequently queried tables
- No connection pooling implemented

### Server Resources
- CPU usage averaging 85%
- Memory leaks in background processes  
- No horizontal scaling capability

---

# Proposed Solutions

## Phase 1: Immediate Fixes (This Sprint)
- Add database indexes
- Implement connection pooling
- Fix memory leaks
- Add monitoring & alerting

## Phase 2: Scaling Improvements (Next Month)
- **Caching Layer**: Implement Redis caching
- **Load Balancing**: Add multiple server instances
- **Database Migration**: Move to managed PostgreSQL
- **CDN Integration**: Optimize static asset delivery

---

# Implementation Plan

## Timeline
- **Week 1**: Database optimizations
- **Week 2**: Caching implementation  
- **Week 3**: Load balancer setup
- **Week 4**: Testing & monitoring

## Resources Needed
- **DevOps Engineer**: 2 weeks full-time
- **Senior Developer**: 1 week for code changes
- **QA Engineer**: 1 week for testing

**Target completion**: End of February`,
        tags: ['technical', 'architecture', 'database'],
        meeting: 'Engineering All-Hands',
        starred: true,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
      },
    ];
    setNotes(sampleNotes);
  }, []);

  // Filter notes based on search, tags, and starred status
  useEffect(() => {
    let filtered = notes;

    if (showStarredOnly) {
      filtered = filtered.filter(note => note.starred);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.meeting?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(note =>
        selectedTags.some(tag => note.tags.includes(tag))
      );
    }

    // Sort starred notes first
    filtered = filtered.sort((a, b) => {
      if (a.starred && !b.starred) return -1;
      if (!a.starred && b.starred) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setFilteredNotes(filtered);
    setKeyboardFocusIndex(-1);
  }, [notes, searchQuery, selectedTags, showStarredOnly]);

  // Get all unique tags
  const allTags = Array.from(new Set(notes.flatMap(note => note.tags)));

  const handleSaveNote = (data: NoteFormData) => {
    if (editingNote) {
      setNotes(prev => prev.map(note =>
        note.id === editingNote.id
          ? { ...note, ...data, updatedAt: new Date() }
          : note
      ));
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setNotes(prev => [newNote, ...prev]);
    }
    setEditingNote(undefined);
  };

  const handleToggleStar = (id: string) => {
    setNotes(prev => prev.map(note =>
      note.id === id
        ? { ...note, starred: !note.starred, updatedAt: new Date() }
        : note
    ));
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleNewNote = () => {
    setEditingNote(undefined);
    setIsModalOpen(true);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isModalOpen) return;

      switch (e.key) {
        case 'n':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            handleNewNote();
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          setKeyboardFocusIndex(prev =>
            prev < filteredNotes.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setKeyboardFocusIndex(prev => prev > 0 ? prev - 1 : prev);
          break;
        case 'Enter':
          if (keyboardFocusIndex >= 0) {
            handleEditNote(filteredNotes[keyboardFocusIndex]);
          }
          break;
        case 'Escape':
          setKeyboardFocusIndex(-1);
          setSelectedTags([]);
          setSearchQuery('');
          setShowStarredOnly(false);
          break;
        case 's':
          if (keyboardFocusIndex >= 0) {
            e.preventDefault();
            handleToggleStar(filteredNotes[keyboardFocusIndex].id);
          }
          break;
        case '?':
          if (e.shiftKey) {
            setShowKeyboardHelp(!showKeyboardHelp);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, keyboardFocusIndex, filteredNotes, showKeyboardHelp, handleToggleStar]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                Meeting Notes
              </h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Keyboard className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowStarredOnly(!showStarredOnly)}
                className={`transition-all duration-200 ${
                  showStarredOnly 
                    ? 'text-secondary hover:text-secondary-dark' 
                    : 'text-muted-foreground hover:text-secondary'
                }`}
              >
                <Star className={`h-4 w-4 ${showStarredOnly ? 'fill-current' : ''}`} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="text-muted-foreground hover:text-foreground"
              >
                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
              </Button>
              
              <Button 
                onClick={handleNewNote}
                className="bg-gradient-secondary hover:opacity-90 transition-opacity"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Note
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchBar
            onSearch={setSearchQuery}
            className="flex-1"
            placeholder="Search notes, content, or meetings..."
          />
        </div>

        {allTags.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Filter by tags:</span>
            </div>
            <TagList
              tags={allTags}
              selectedTags={selectedTags}
              onTagSelect={handleTagSelect}
            />
          </div>
        )}

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          {filteredNotes.length} of {notes.length} notes
          {showStarredOnly && ' • Showing starred only'}
          {selectedTags.length > 0 && ` • Filtered by: ${selectedTags.join(', ')}`}
        </div>
      </div>

      {/* Notes Grid */}
      <main className="max-w-7xl mx-auto px-6 pb-12">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-16 animate-fadeIn">
            <div className="text-muted-foreground text-lg mb-4">
              {notes.length === 0 ? 'No notes yet' : 'No notes match your search'}
            </div>
            <Button 
              onClick={handleNewNote}
              className="bg-gradient-secondary hover:opacity-90 transition-opacity"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create your first note
            </Button>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1 max-w-4xl mx-auto'
          }`}>
            {filteredNotes.map((note, index) => (
              <div key={note.id} className="note-card-enter">
                <NoteCard
                  note={note}
                  onEdit={handleEditNote}
                  onDelete={handleDeleteNote}
                  onToggleStar={handleToggleStar}
                  selectedTags={selectedTags}
                  onTagSelect={handleTagSelect}
                  isKeyboardFocused={index === keyboardFocusIndex}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Keyboard shortcuts help */}
      {showKeyboardHelp && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center animate-fadeIn">
          <div className="bg-card p-6 rounded-lg shadow-hover max-w-md w-full mx-4">
            <h3 className="font-semibold text-lg mb-4">Keyboard shortcuts</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>New note</span>
                <code className="bg-muted px-2 py-1 rounded">Ctrl+N</code>
              </div>
              <div className="flex justify-between">
                <span>Navigate notes</span>
                <code className="bg-muted px-2 py-1 rounded">↑/↓</code>
              </div>
              <div className="flex justify-between">
                <span>Open note</span>
                <code className="bg-muted px-2 py-1 rounded">Enter</code>
              </div>
              <div className="flex justify-between">
                <span>Star/unstar note</span>
                <code className="bg-muted px-2 py-1 rounded">S</code>
              </div>
              <div className="flex justify-between">
                <span>Clear filters</span>
                <code className="bg-muted px-2 py-1 rounded">Esc</code>
              </div>
              <div className="flex justify-between">
                <span>Toggle help</span>
                <code className="bg-muted px-2 py-1 rounded">?</code>
              </div>
            </div>
            <Button 
              onClick={() => setShowKeyboardHelp(false)}
              className="w-full mt-4"
              variant="outline"
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Note Modal */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingNote(undefined);
        }}
        onSave={handleSaveNote}
        note={editingNote}
        title={editingNote ? 'Edit Note' : 'New Note'}
      />
    </div>
  );
};