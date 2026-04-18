import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../supabase';
import { registerAllBlocks } from '../components/sections';
import { getBlock } from '../components/admin/builder/SectionRegistry';
import i18n from '../i18n';

interface VisualEditorContextType {
  editMode: boolean;
  contentData: any;
  updateField: (fieldKey: string, value: string) => void;
  updateSectionProps: (id: string, newProps: any) => void;
  addSection: (type: string, index?: number) => void;
  removeSection: (id: string) => void;
  reorderSections: (newSections: any[]) => void;
  moveSection: (id: string, direction: 'up' | 'down') => void;
  syncSections: (sections: any[]) => void;
  selectedSectionId: string | null;
  setSelectedSectionId: (id: string | null) => void;
  requestImageChange: (fieldKey: string) => void;
  isLoading: boolean;
  isPageActive: boolean;
  slug: string;
}

const VisualEditorContext = createContext<VisualEditorContextType>({
  editMode: false,
  contentData: {},
  updateField: () => {},
  updateSectionProps: () => {},
  addSection: () => {},
  removeSection: () => {},
  reorderSections: () => {},
  moveSection: () => {},
  syncSections: () => {},
  selectedSectionId: null,
  setSelectedSectionId: () => {},
  requestImageChange: () => {},
  isLoading: false,
  isPageActive: true,
  slug: '',
});

export const useVisualEditor = () => useContext(VisualEditorContext);

interface VisualEditorProviderProps {
  children: ReactNode;
  slug?: string;
}

export const VisualEditorProvider = ({ children, slug = '' }: VisualEditorProviderProps) => {
  const [editMode, setEditMode] = useState(false);
  const [contentData, setContentData] = useState<any>({});
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPageActive, setIsPageActive] = useState(true);

  // Initialize blocks
  useEffect(() => {
    registerAllBlocks();
  }, []);

  const syncWithParent = React.useCallback((newData: any) => {
    if (!editMode) return;
    
    window.parent.postMessage(
      {
        type: 'VISUAL_EDIT_UPDATE',
        slug,
        data: newData,
      },
      '*'
    );
  }, [slug, editMode]);

  // Handle updates from EditableElement (Legacy/Simple)
  const updateField = React.useCallback((fieldKey: string, value: string) => {
    if (!editMode) return;
    
    setContentData((prev: any) => {
      const newData = { ...prev, [fieldKey]: value };
      syncWithParent(newData);
      return newData;
    });
  }, [editMode, syncWithParent]);

  // Builder Methods
  const addSection = React.useCallback((type: string, index?: number) => {
    if (!editMode) return;
    const blockDef = getBlock(type);
    if (!blockDef) return;

    const newSection = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      props: { ...blockDef.defaultProps }
    };

    setContentData((prev: any) => {
      const sections = [...(prev.sections || [])];
      if (typeof index === 'number') {
        sections.splice(index, 0, newSection);
      } else {
        sections.push(newSection);
      }
      const newData = { ...prev, sections };
      syncWithParent(newData);
      return newData;
    });
  }, [editMode, syncWithParent]);

  const removeSection = React.useCallback((id: string) => {
    if (!editMode) return;
    setContentData((prev: any) => {
      const sections = (prev.sections || []).filter((s: any) => s.id !== id);
      const newData = { ...prev, sections };
      syncWithParent(newData);
      return newData;
    });
  }, [editMode, syncWithParent]);

  const reorderSections = React.useCallback((newSections: any[]) => {
    if (!editMode) return;
    setContentData((prev: any) => {
      const newData = { ...prev, sections: newSections };
      syncWithParent(newData);
      return newData;
    });
  }, [editMode, syncWithParent]);

  const moveSection = React.useCallback((id: string, direction: 'up' | 'down') => {
    if (!editMode) return;
    setContentData((prev: any) => {
      const sections = [...(prev.sections || [])];
      const index = sections.findIndex((s: any) => s.id === id);
      if (index === -1) return prev;

      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= sections.length) return prev;

      // Swap
      [sections[index], sections[newIndex]] = [sections[newIndex], sections[index]];

      const newData = { ...prev, sections };
      syncWithParent(newData);
      return newData;
    });
  }, [editMode, syncWithParent]);

  const syncSections = React.useCallback((sections: any[]) => {
    setContentData((prev: any) => {
      // Only initialize if context doesn't have sections yet
      if (!prev.sections || prev.sections.length === 0) {
        const sectionsWithIds = sections.map((s: any, idx: number) => ({
          ...s,
          id: s.id || `sec_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 4)}`
        }));
        console.log('[VisualEditorContext] Hydrating context with sections:', sectionsWithIds.length);
        return { ...prev, sections: sectionsWithIds };
      }
      return prev;
    });
  }, []);

  const updateSectionProps = React.useCallback((id: string, newProps: any) => {
    if (!editMode) return;
    setContentData((prev: any) => {
      const currentSections = prev.sections || [];
      const sections = currentSections.map((s: any) => 
        s.id === id ? { ...s, props: { ...s.props, ...newProps } } : s
      );
      const newData = { ...prev, sections };
      syncWithParent(newData);
      return newData;
    });
  }, [editMode, syncWithParent]);

  // Handle image pick requests
  const requestImageChange = React.useCallback((fieldKey: string) => {
    if (!editMode) return;
    
    window.parent.postMessage({
      type: 'VISUAL_EDIT_PICK_IMAGE',
      fieldKey,
      sectionId: selectedSectionId,
      slug
    }, '*');
  }, [editMode, slug, selectedSectionId]);

  // Check URL params for edit_mode
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('edit_mode') === 'true') {
      setEditMode(true);
    }
  }, []);

  // Listen for messages from Admin
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type, fieldKey, imageUrl, sectionId, props, blockType, index, direction, sections } = event.data;
      
      switch (type) {
        case 'VISUAL_EDIT_UPDATE_DATA':
          if (sections) {
            console.log('[VisualEditorContext] Updating data from parent:', sections.length);
            setContentData((prev: any) => ({ ...prev, sections }));
          }
          break;
        case 'VISUAL_EDIT_IMAGE_SELECTED':
          if (sectionId) {
            updateSectionProps(sectionId, { [fieldKey]: imageUrl });
          } else {
            updateField(fieldKey, imageUrl);
          }
          break;
        case 'VISUAL_EDIT_ADD_SECTION':
          addSection(blockType, index);
          break;
        case 'VISUAL_EDIT_REMOVE_SECTION':
          removeSection(sectionId);
          break;
        case 'VISUAL_EDIT_UPDATE_SECTION_PROPS':
          updateSectionProps(sectionId, props);
          break;
        case 'VISUAL_EDIT_REORDER_SECTIONS':
          if (direction) {
            moveSection(sectionId, direction);
          } else if (sections) {
            reorderSections(sections);
          }
          break;
        case 'VISUAL_EDIT_SELECT_SECTION':
          setSelectedSectionId(sectionId);
          break;
        case 'VISUAL_EDIT_CHANGE_LANGUAGE':
          if (event.data.lng) {
            console.log('[VisualEditorContext] Changing language to:', event.data.lng);
            i18n.changeLanguage(event.data.lng);
          }
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [updateField, addSection, removeSection, updateSectionProps, reorderSections, moveSection]);

  // Fetch initial content
  useEffect(() => {
    const fetchContent = async () => {
      // If in editMode, we wait for parent to push initial data
      if (editMode) {
        console.log('[VisualEditor Child] In edit_mode, skipping internal fetch, waiting for parent.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error: fetchError } = await supabase
          .from('static_pages')
          .select('content, is_active')
          .eq('slug', slug)
          .single();

        if (data) {
          setIsPageActive(data.is_active ?? true);
          if (data.content) {
            try {
              const parsed = JSON.parse(data.content);
              setContentData(parsed);
            } catch (e) {
              console.log('Content is not JSON. Starting with empty visual data.');
              setContentData({});
            }
          }
        }
      } catch (err) {
        console.error('Failed to load content', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [slug, editMode]);

  // Handle signalling Readiness to Admin
  useEffect(() => {
    if (editMode && !isLoading) {
      console.log('[VisualEditor Child] Signalling READY to parent for slug:', slug);
      window.parent.postMessage({ type: 'VISUAL_EDIT_READY', slug }, '*');
      
      // Also request initial data sync just in case
      window.parent.postMessage({ type: 'VISUAL_EDIT_SYNC_REQUEST', slug }, '*');
    }
  }, [editMode, isLoading, slug]);

  return (
    <VisualEditorContext.Provider value={{ 
      editMode, contentData, updateField, updateSectionProps, 
      addSection, removeSection, reorderSections, moveSection, syncSections,
      selectedSectionId, setSelectedSectionId,
      requestImageChange, isLoading, isPageActive, slug 
    }}>
      {children}
    </VisualEditorContext.Provider>
  );
};
