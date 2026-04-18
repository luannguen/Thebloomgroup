import React from 'react';
import { Link } from 'react-router-dom';

interface AppLinkProps {
    routeKey: string;
    children: React.ReactNode;
    className?: string;
    query?: Record<string, string>;
}

const ROUTES: Record<string, string> = {
    CONTACT: '/contact',
    PRODUCTS: '/products',
    PROJECTS: '/projects',
    SERVICES: '/services',
    HOME: '/',
    ABOUT: '/about',
    INTRO: '/intro',
    NEWS: '/news',
    EVENTS: '/events',
    PUBLICATIONS: '/publications',
};

export const AppLink: React.FC<AppLinkProps> = ({ routeKey, children, className, query }) => {
    let to = ROUTES[routeKey] || '#';
    
    if (query && Object.keys(query).length > 0) {
        const searchParams = new URLSearchParams(query);
        to += `?${searchParams.toString()}`;
    }

    return (
        <Link to={to} className={className}>
            {children}
        </Link>
    );
};
