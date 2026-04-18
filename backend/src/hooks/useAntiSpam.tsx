import { useState, useCallback, useRef } from 'react';

/**
 * useAntiSpam hook provides Honeypot and Timing Analysis protection for forms.
 * Ported to Backend project to protect Admin Login.
 */
export const useAntiSpam = () => {
    const [loadTime] = useState<number>(Date.now());
    const [honeypotValue, setHoneypotValue] = useState<string>('');
    const honeypotRef = useRef<HTMLInputElement>(null);

    /**
     * HoneypotField component - renders a hidden input that bots will fill.
     */
    const HoneypotField = useCallback(() => (
        <div style={{ 
            opacity: 0, 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            height: 0, 
            width: 0, 
            zIndex: -1, 
            overflow: 'hidden', 
            pointerEvents: 'none' 
        }}>
            <label htmlFor="b_address">Please leave this field empty</label>
            <input
                ref={honeypotRef}
                id="b_address"
                name="b_address"
                type="text"
                tabIndex={-1}
                autoComplete="new-password"
                value={honeypotValue}
                onChange={(e) => setHoneypotValue(e.target.value)}
            />
        </div>
    ), [honeypotValue]);

    /**
     * Validates if the submission is likely from a bot.
     */
    const isBot = useCallback(() => {
        const now = Date.now();
        const duration = (now - loadTime) / 1000;

        // 1. Check Honeypot
        if (honeypotValue.length > 0) {
            console.warn('Anti-Spam: Honeypot triggered');
            return true;
        }

        // 2. Check Timing
        // Backend login might be faster, but human-speed is still > 1s for typing email/pass
        if (duration < 1.5) {
            console.warn(`Anti-Spam: Submission too fast (${duration.toFixed(2)}s)`);
            return true;
        }

        return false;
    }, [loadTime, honeypotValue]);

    return { HoneypotField, isBot, honeypotValue };
};
