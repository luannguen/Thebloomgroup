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

    useEffect(() => {
        const checkRouteAccess = async () => {
            if (location.pathname === '/' || location.pathname === '/404') {
                setIsBlocked(false);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const { isBlocked: blocked } = await navigationService.checkRouteStatus(location.pathname);
                setIsBlocked(blocked);
            } catch (err) {
                console.error('RouteGuard error:', err);
                setIsBlocked(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkRouteAccess();
    }, [location.pathname]);

    if (isLoading) {
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
