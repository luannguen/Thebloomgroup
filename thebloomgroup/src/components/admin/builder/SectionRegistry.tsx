import React from 'react';

export interface SectionProps {
  [key: string]: any;
}

export interface SectionMetadata {
  id: string;
  type: string;
  props: SectionProps;
}

export interface PageData {
  sections: SectionMetadata[];
}

export interface SectionField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'image' | 'color' | 'rich-text' | 'list';
  options?: { label: string; value: any }[]; // For select types
  placeholder?: string;
  helperText?: string;
  itemSchema?: SectionField[]; // For list types
  default?: any;
}

export interface BlockDefinition {
  type: string;
  name: string;
  icon?: string;
  component: React.ComponentType<any>;
  defaultProps: SectionProps;
  fields: SectionField[];
}

// Registry of available blocks
const registry: Record<string, BlockDefinition> = {};

export const registerBlock = (definition: BlockDefinition) => {
  registry[definition.type] = definition;
};

export const getBlock = (type: string): BlockDefinition | undefined => {
  return registry[type];
};

export const getAllBlocks = () => Object.values(registry);
