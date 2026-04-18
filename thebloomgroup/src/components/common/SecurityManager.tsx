import React, { useEffect } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { useVisualEditor } from '@/context/VisualEditorContext';

/**
 * SecurityManager handles global website protection settings.
 * Currently supports: Disable content selection, right-click, and copy shortcuts.
 */
const SecurityManager: React.FC = () => {
    const { settings } = useSettings();
    const { editMode } = useVisualEditor();

    useEffect(() => {
        // Only apply protection if enabled in settings and NOT in edit mode
        const isProtected = settings['security_disable_copy'] === 'true' && !editMode;

        if (isProtected) {
            // 1. Prevent Right Click
            const preventContextMenu = (e: MouseEvent) => {
                e.preventDefault();
                return false;
            };

            // 2. Prevent Copy shortcut and DevTools shortcuts
            const preventShortcuts = (e: KeyboardEvent) => {
                // Ctrl+C, Ctrl+V, Ctrl+U (View Source), Ctrl+S (Save), Ctrl+P (Print)
                if (e.ctrlKey && (['c', 'v', 'u', 's', 'p', 'a'].includes(e.key.toLowerCase()))) {
                    e.preventDefault();
                    return false;
                }
                
                // Mac Cmd equivalents
                if (e.metaKey && (['c', 'v', 'u', 's', 'p', 'a'].includes(e.key.toLowerCase()))) {
                    e.preventDefault();
                    return false;
                }

                // F12, Ctrl+Shift+I (Inspect), Ctrl+Shift+J (Console), Ctrl+Shift+C (Inspect Element)
                if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase()))) {
                    e.preventDefault();
                    return false;
                }
            };

            // 3. Prevent Drag and Drop
            const preventDrag = (e: DragEvent) => {
                e.preventDefault();
                return false;
            };

            // Apply CSS to prevent selection
            const style = document.createElement('style');
            style.id = 'security-prevent-select';
            style.innerHTML = `
                * {
                    -webkit-user-select: none !important;
                    -moz-user-select: none !important;
                    -ms-user-select: none !important;
                    user-select: none !important;
                }
                input, textarea {
                    -webkit-user-select: text !important;
                    -moz-user-select: text !important;
                    -ms-user-select: text !important;
                    user-select: text !important;
                }
            `;
            document.head.appendChild(style);

            // Add Event Listeners
            document.addEventListener('contextmenu', preventContextMenu);
            document.addEventListener('keydown', preventShortcuts);
            document.addEventListener('dragstart', preventDrag);

            return () => {
                // Cleanup
                document.removeEventListener('contextmenu', preventContextMenu);
                document.removeEventListener('keydown', preventShortcuts);
                document.removeEventListener('dragstart', preventDrag);
                const styleElement = document.getElementById('security-prevent-select');
                if (styleElement) {
                    styleElement.remove();
                }
            };
        }
    }, [settings, editMode]);

    return null; // This is a logic-only component
};

export default SecurityManager;
