export interface NoteSection {
  content: string;
  index: number;
}

export const parseNoteSections = (content: string): NoteSection[] => {
  const sections = content.split('---').map((section, index) => ({
    content: section.trim(),
    index
  })).filter(section => section.content.length > 0);
  
  return sections.length > 0 ? sections : [{ content: content.trim(), index: 0 }];
};

export const joinNoteSections = (sections: NoteSection[]): string => {
  return sections.map(section => section.content).join('\n\n---\n\n');
};

export const createEmptySection = (): string => {
  return "\n\n---\n\n# New Section\n\nAdd your content here...";
};