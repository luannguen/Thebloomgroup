import { useState, useEffect } from 'react';
import { navigationService } from '../services/navigationService';
import { NavigationItem } from '../components/data/types';

export const useNavigation = (position: 'header' | 'footer' = 'header') => {
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);
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
          setNavItems(roots);
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

  const homeItem = navItems.length > 0 ? navItems[0] : null;

  return {
    navItems,
    isLoading,
    error,
    homeItem,
    homePath: homeItem?.path || '/'
  };
};
