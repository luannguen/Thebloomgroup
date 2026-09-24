import React from 'react';

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  hasBanner?: boolean;
}

/**
 * Standardized PageContainer that guarantees content will never be obscured by the fixed header.
 * Use this wrapper for any page or route that does not have an explicit PageBanner or full-bleed hero.
 */
export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = '',
  hasBanner = false
}) => {
  return (
    <div className={`w-full ${hasBanner ? '' : 'pt-header-safe'} ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer;
