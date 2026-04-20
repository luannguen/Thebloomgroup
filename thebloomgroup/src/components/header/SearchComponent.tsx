import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X, ArrowRight, Package, FolderOpen, FileText, Newspaper, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { productService } from '@/services/productService';
import { projectService } from '@/services/projectService';
import { pageService } from '@/services/pageService';
import { Product, Project } from '@/components/data/types';
import { useAntiSpam } from '@/hooks/useAntiSpam';

interface SearchComponentProps {
  isMobile?: boolean;
  isScrolled?: boolean;
}

interface SuggestionGroup {
  type: 'product' | 'project' | 'page';
  icon: React.ReactNode;
  label: string;
  items: { id: string; name: string; slug: string; image_url?: string | null }[];
}

const SearchComponent = ({ isMobile = false, isScrolled = false }: SearchComponentProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestionGroup[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  const { HoneypotField, isBot } = useAntiSpam();

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Debounced live search
  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const [productResult, projectResult, pagesResult] = await Promise.all([
        productService.getProducts({ search: query }),
        projectService.getProjects({ search: query, limit: 3 }),
        pageService.getAllPages({ search: query }).catch(() => [])
      ]);

      const groups: SuggestionGroup[] = [];

      if (productResult.success && productResult.data.length > 0) {
        groups.push({
          type: 'product',
          icon: <Package size={14} className="text-blue-500" />,
          label: t('search_products'),
          items: productResult.data.slice(0, 3).map(p => ({
            id: p.id, name: p.name, slug: p.slug, image_url: p.image_url
          }))
        });
      }

      if (projectResult.success && projectResult.data.length > 0) {
        groups.push({
          type: 'project',
          icon: <FolderOpen size={14} className="text-emerald-500" />,
          label: t('search_projects'),
          items: projectResult.data.slice(0, 3).map(p => ({
            id: p.id, name: p.name, slug: p.slug, image_url: p.image_url
          }))
        });
      }

      if (Array.isArray(pagesResult) && pagesResult.length > 0) {
        groups.push({
          type: 'page',
          icon: <FileText size={14} className="text-purple-500" />,
          label: t('search_services'),
          items: pagesResult.slice(0, 3).map(p => ({
            id: p.id, name: p.title, slug: p.slug, image_url: p.image_url
          }))
        });
      }

      setSuggestions(groups);
    } catch (err) {
      console.error('Search suggestions error:', err);
    } finally {
      setIsSearching(false);
    }
  }, [t]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (searchQuery.trim().length >= 2) {
      // Anti-spam: Don't trigger suggestions for bots
      if (isBot()) {
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      debounceRef.current = setTimeout(() => {
        fetchSuggestions(searchQuery);
      }, 350);
    } else {
      setSuggestions([]);
      setIsSearching(false);
    }

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, fetchSuggestions]);

  const toggleSearch = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setSearchQuery('');
      setSuggestions([]);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isBot()) {
      console.warn('Search attempt blocked: Bot detected');
      setIsOpen(false);
      setSearchQuery('');
      return;
    }

    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
      setSearchQuery('');
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (type: string, slug: string) => {
    const pathMap: Record<string, string> = {
      product: `/products/${slug}`,
      project: `/project-details/${slug}`,
      page: `/page/${slug}`
    };
    navigate(pathMap[type] || `/search?q=${encodeURIComponent(slug)}`);
    setIsOpen(false);
    setSearchQuery('');
    setSuggestions([]);
  };

  const tags = [
    { label: t('tag_cold_storage'), value: 'Kho lạnh' },
    { label: t('tag_air_conditioner'), value: 'Điều hòa' },
    { label: t('tag_maintenance'), value: 'Bảo trì' },
    { label: t('tag_energy_saving'), value: 'Tiết kiệm năng lượng' },
    { label: t('tag_chiller'), value: 'Chiller' }
  ];

  const hasSuggestions = suggestions.length > 0;
  const showSuggestions = searchQuery.trim().length >= 2;

  return (
    <div className="relative" ref={searchContainerRef}>
      <button
        className={`navbar-link relative z-50 transition-colors ${
          isOpen 
            ? 'text-accent' 
            : (isScrolled ? 'text-slate-900' : 'text-white hover:text-white/80')
        }`}
        onClick={toggleSearch}
        aria-label={t('search_button')}
      >
        <motion.div
          animate={isOpen ? { rotate: 90 } : { rotate: 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <X size={20} /> : <Search size={20} />}
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Search container */}
            <motion.div
              initial={{ width: "0%", opacity: 0 }}
              animate={{ opacity: 1, width: isMobile ? "92%" : "680px" }}
              exit={{ opacity: 0, width: "0%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`
                fixed ${isMobile ? 'top-16 right-4' : 'top-16 left-1/2 -translate-x-1/2'}
                bg-white dark:bg-gray-800 rounded-xl shadow-2xl
                border border-gray-200/60 dark:border-gray-700/50
                z-50 overflow-hidden
              `}
            >
              {/* Search Input */}
              <form onSubmit={handleSearch} className="flex items-center p-3 border-b border-gray-100 dark:border-gray-700">
                <HoneypotField />
                <div className="flex-1 flex items-center relative">
                  <Search size={18} className="absolute left-3 text-gray-400" />
                  <motion.input
                    ref={searchInputRef}
                    type="text"
                    placeholder={t('search_placeholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 p-3 pl-10 bg-gray-50 dark:bg-gray-700/50 rounded-lg
                              border-none focus:ring-2 focus:ring-primary/30
                              outline-none text-gray-800 dark:text-white w-full
                              placeholder-gray-400 dark:placeholder-gray-500
                              text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    autoFocus
                  />
                  {isSearching && (
                    <Loader2 size={16} className="absolute right-3 text-primary animate-spin" />
                  )}
                </div>

                <motion.button
                  type="submit"
                  className="ml-3 p-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg
                            shadow-sm hover:shadow-md transition-all
                            flex items-center justify-center gap-1.5 text-sm font-medium
                            disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!searchQuery.trim()}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <Search size={15} />
                  <span className="hidden sm:inline">{t('search_button')}</span>
                </motion.button>
              </form>

              {/* Live Suggestions */}
              <AnimatePresence mode="wait">
                {showSuggestions && (hasSuggestions || isSearching) && (
                  <motion.div
                    key="suggestions"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="max-h-[360px] overflow-y-auto"
                  >
                    {suggestions.map((group) => (
                      <div key={group.type} className="border-b border-gray-50 dark:border-gray-700/50 last:border-b-0">
                        <div className="px-4 py-2 bg-gray-50/70 dark:bg-gray-700/30 flex items-center gap-2">
                          {group.icon}
                          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            {group.label}
                          </span>
                        </div>
                        {group.items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleSuggestionClick(group.type, item.slug)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors text-left group/item"
                          >
                            {item.image_url ? (
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-10 h-10 rounded-md object-cover flex-shrink-0 border border-gray-100"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                                {group.icon}
                              </div>
                            )}
                            <span className="text-sm text-gray-700 dark:text-gray-200 group-hover/item:text-primary transition-colors line-clamp-1 flex-1">
                              {item.name}
                            </span>
                            <ArrowRight size={14} className="text-gray-300 group-hover/item:text-primary transition-colors flex-shrink-0" />
                          </button>
                        ))}
                      </div>
                    ))}

                    {/* View All Results Link */}
                    {hasSuggestions && (
                      <button
                        onClick={handleSearch as any}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
                      >
                        {t('search_view_all_results')} "{searchQuery}"
                        <ArrowRight size={14} />
                      </button>
                    )}
                  </motion.div>
                )}

                {/* No results state */}
                {showSuggestions && !isSearching && !hasSuggestions && (
                  <motion.div
                    key="no-results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="px-4 py-8 text-center"
                  >
                    <Search size={32} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('search_no_results')}
                    </p>
                    <button
                      onClick={handleSearch as any}
                      className="mt-3 text-sm text-primary hover:underline inline-flex items-center gap-1"
                    >
                      {t('search_view_all_results')} <ArrowRight size={14} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Popular tags - show only when no query */}
              {!showSuggestions && (
                <motion.div
                  className="px-4 py-3 flex flex-wrap gap-2 items-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-xs text-gray-400 dark:text-gray-500 mr-1">{t('popular_searches')}</span>
                  {tags.map((tag) => (
                    <button
                      key={tag.value}
                      onClick={() => {
                        setSearchQuery(tag.value);
                        searchInputRef.current?.focus();
                      }}
                      className="text-xs py-1.5 px-3 bg-gray-100 dark:bg-gray-700
                                text-gray-600 dark:text-gray-300 rounded-full
                                hover:bg-primary/10 hover:text-primary transition-all
                                border border-transparent hover:border-primary/20"
                    >
                      {tag.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchComponent;
