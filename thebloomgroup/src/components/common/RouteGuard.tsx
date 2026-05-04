import React, { useEffect, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { navigationService } from '@/services/navigationService';
import { Loader2 } from 'lucide-react';

interface RouteGuardProps {
    children: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
    const location = useLocation();
    const [isBlocked, setIsBlocked] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showLoader, setShowLoader] = useState(false);

    useEffect(() => {
        const checkRouteAccess = async () => {
            const searchParams = new URLSearchParams(location.search);
            const isEditModeParam = searchParams.get('edit_mode') === 'true';
            const isAuthorizedEdit = isEditModeParam; // In preview/edit mode, we allow access to facilitate design
            
            if (location.pathname === '/' || location.pathname === '/404' || isAuthorizedEdit) {
                setIsBlocked(false);
                setIsLoading(false);
                setShowLoader(false);
                return;
            }

            // Start loading state but delay the actual spinner to avoid flickering on fast connections
            setIsLoading(true);
            const loaderTimeout = setTimeout(() => setShowLoader(true), 300);

            try {
                // Add a timeout to the status check to prevent infinite stalling
                const statusPromise = navigationService.checkRouteStatus(location.pathname);
                const timeoutPromise = new Promise<{ isBlocked: boolean }>((resolve) => 
                    setTimeout(() => resolve({ isBlocked: false }), 2000)
                );

                const { isBlocked: blocked } = await Promise.race([statusPromise, timeoutPromise]);
                setIsBlocked(blocked);
            } catch (err) {
                console.error('RouteGuard error:', err);
                setIsBlocked(false);
            } finally {
                clearTimeout(loaderTimeout);
                setIsLoading(false);
                setShowLoader(false);
            }
        };

        checkRouteAccess();
    }, [location.pathname, location.search]);

    if (isLoading && showLoader) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isBlocked) {
        return <Navigate to="/404" replace />;
    }

    return <>{children}</>;
};

export default RouteGuard;
