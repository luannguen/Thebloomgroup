import React from 'react';

interface GridBlockProps {
  columns?: number;
  gap?: number;
  padding?: 'none' | 'small' | 'medium' | 'large';
  children?: React.ReactNode;
}

export const GridBlock = ({ 
  columns = 2, 
  gap = 8,
  padding = 'medium',
  children 
}: GridBlockProps) => {
  const paddingClasses = {
    none: 'py-0',
    small: 'py-8',
    medium: 'py-16',
    large: 'py-24'
  };

  const gapClasses = {
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
    12: 'gap-12'
  };

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`container-custom ${paddingClasses[padding]}`}>
      <div className={`grid ${gridCols[columns as keyof typeof gridCols] || 'grid-cols-1'} ${gapClasses[gap as keyof typeof gapClasses] || 'gap-8'}`}>
        {children}
      </div>
    </div>
  );
};
