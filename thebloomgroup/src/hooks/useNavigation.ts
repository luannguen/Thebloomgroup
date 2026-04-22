import { useState, useEffect } from 'react';
import { navigationService } from '../services/navigationService';
import { NavigationItem } from '../components/data/types';

export const useNavigation = (position: 'header' | 'footer' = 'header') => {
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);
  const [homeItem, setHomeItem] = useState<NavigationItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNav = async () => {
      setIsLoading(true);
      try {
        const result = await navigationService.getNavigationItems();
        if (result.success && result.data) {
          // 1. Filter for position
          const filteredItems = result.data.filter(item => 
            (item.position === position || (!item.position && position === 'header'))
          );

          // 2. Build the tree
          const itemMap: Record<string, NavigationItem> = {};
          const roots: NavigationItem[] = [];

          filteredItems.forEach(item => {
            itemMap[item.id] = { ...item, children: [] };
          });

          filteredItems.forEach(item => {
            const mappedItem = itemMap[item.id];
            if (item.parent_id && itemMap[item.parent_id]) {
              itemMap[item.parent_id].children?.push(mappedItem);
            } else if (!item.parent_id) {
              roots.push(mappedItem);
            }
          });

          // 3. Sort
          const sortItems = (items: NavigationItem[]) => {
            items.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
            items.forEach(item => {
              if (item.children && item.children.length > 0) {
                sortItems(item.children);
              }
            });
          };

          sortItems(roots);
          
          // Identify the home item from ALL active roots (regardless of menu visibility)
          const primaryHome = roots.length > 0 ? roots[0] : null;
          
          // 4. Mutual Exclusion for Home Items: If multiple home-like items exist, only keep the first one visible
          const homePaths = ['/', '/home', '/home-v2', '/home_v2'];
          let homeFound = false;
          
          const visibleRoots = roots.filter(item => {
              // Standard visibility filter
              if (item.show_in_menu === false) return false;
              
              // Mutual exclusion logic for home paths
              if (homePaths.includes(item.path || '')) {
                  if (homeFound) return false; // Hide subsequent home items
                  homeFound = true;
              }
              return true;
          });
          
          // Also filter children
          const filterVisibleChildren = (items: NavigationItem[]) => {
            items.forEach(item => {
              if (item.children) {
                item.children = item.children.filter(c => c.show_in_menu !== false);
                filterVisibleChildren(item.children);
              }
            });
          };
          filterVisibleChildren(visibleRoots);

          setNavItems(visibleRoots);
          setHomeItem(primaryHome);
        } else {
          setError('Failed to load navigation');
        }
      } catch (err) {
        console.error('useNavigation error:', err);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNav();
  }, [position]);

  return {
    navItems,
    isLoading,
    error,
    homeItem,
    homePath: homeItem?.path || '/'
  };
};
