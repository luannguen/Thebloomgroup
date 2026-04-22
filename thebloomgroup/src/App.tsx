import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import SEOHelmet from "@/components/common/SEOHelmet";
import MainLayout from "./components/layouts/MainLayout";
import { registerAllBlocks } from "./components/sections";
import SecurityManager from "./components/common/SecurityManager";

// Register all visual editor blocks
registerAllBlocks();

// Loading component
const PageLoader = () => {
  const siteAcronym = "THE BLOOM";
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
      <div className="flex flex-col items-center gap-6">
        <div className="text-4xl font-extrabold tracking-tighter text-primary animate-pulse">{siteAcronym}</div>
        <div className="w-10 h-10 border-3 border-primary/10 border-t-primary rounded-full animate-spin"></div>
        <p className="text-sm uppercase tracking-widest text-muted-foreground animate-pulse">Đang tải...</p>
      </div>
    </div>
  );
};

// Public pages - Lazy loaded
const Index = lazy(() => import("./pages/Index"));
const StaticPage = lazy(() => import("./pages/StaticPage"));
const About = lazy(() => import("./pages/About"));
const AboutUsV2 = lazy(() => import("./pages/AboutUsV2"));
const Products = lazy(() => import("./pages/Products"));
const Projects = lazy(() => import("./pages/Projects"));
const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Installation = lazy(() => import("./pages/Installation"));
const Maintenance = lazy(() => import("./pages/Maintenance"));
const Repair = lazy(() => import("./pages/Repair"));
const Consulting = lazy(() => import("./pages/Consulting"));
const ServiceSupport = lazy(() => import("./pages/ServiceSupport"));
const Technologies = lazy(() => import("./pages/Technologies"));
const EnergyEfficiency = lazy(() => import("./pages/technologies/EnergyEfficiency"));
const News = lazy(() => import("./pages/News"));
const NewsDetail = lazy(() => import("./pages/NewsDetail"));
const Contact = lazy(() => import("./pages/Contact"));
const TeamPage = lazy(() => import("./pages/TeamPage"));
const Events = lazy(() => import("./pages/Events"));
const EventDetail = lazy(() => import("./pages/EventDetail"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const JobDetail = lazy(() => import("./pages/JobDetail"));

// Legal pages
const Privacy = lazy(() => import("./pages/legal/Privacy"));
const Terms = lazy(() => import("./pages/legal/Terms"));
const Cookies = lazy(() => import("./pages/legal/Cookies"));
const Sitemap = lazy(() => import("./pages/legal/Sitemap"));

// Data & Resources pages
const Statistics = lazy(() => import("./pages/data/Statistics"));
const Tools = lazy(() => import("./pages/data/Tools"));
const ResourceCategory = lazy(() => import("./pages/data/ResourceCategory"));
const ResourceDetail = lazy(() => import("./pages/data/ResourceDetail"));

// Publication pages
const Publications = lazy(() => import("./pages/publications/Index"));
const InverterTechnology = lazy(() => import("./pages/publications/InverterTechnology"));
const HeatRecoverySolutions = lazy(() => import("./pages/publications/HeatRecoverySolutions"));
const GreenBuildingStandards = lazy(() => import("./pages/publications/GreenBuildingStandards"));
const EnergyEfficiencyReport = lazy(() => import("./pages/publications/EnergyEfficiencyReport"));

// Product pages
const IndustrialProducts = lazy(() => import("./pages/products/Industrial"));
const CommercialProducts = lazy(() => import("./pages/products/Commercial"));
const ResidentialProducts = lazy(() => import("./pages/products/Residential"));
const ColdStorageProducts = lazy(() => import("./pages/products/ColdStorage"));
const AuxiliaryProducts = lazy(() => import("./pages/products/Auxiliary"));

// Project pages
const IndustrialProjects = lazy(() => import("./pages/projects/Industrial"));
const CommercialProjects = lazy(() => import("./pages/projects/Commercial"));
const SpecializedProjects = lazy(() => import("./pages/projects/Specialized"));
const ProjectCategory = lazy(() => import("./pages/ProjectCategory"));

const App = () => (
  <TooltipProvider>
    <HelmetProvider>
      <SEOHelmet />
      <SecurityManager />
      <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Index />} />
              <Route path="about" element={<Navigate to="/about-us" replace />} />
              <Route path="gioi-thieu" element={<Navigate to="/about-us" replace />} />
              <Route path="about-us" element={<About />} />
              <Route path="about-us-v2" element={<AboutUsV2 />} />
              <Route path="about-vvc" element={<Navigate to="/about-us" replace />} />
              <Route path="intro" element={<StaticPage slug="intro" />} />
              <Route path="page/:slug" element={<StaticPage />} />
              <Route path="products" element={<Products />} />
              <Route path="products/industrial" element={<IndustrialProducts />} />
              <Route path="products/commercial" element={<CommercialProducts />} />
              <Route path="products/residential" element={<ResidentialProducts />} />
              <Route path="products/cold-storage" element={<ColdStorageProducts />} />
              <Route path="products/auxiliary" element={<AuxiliaryProducts />} />
              <Route path="projects" element={<StaticPage slug="projects" />} />
              <Route path="projects/category/:slug" element={<ProjectCategory />} /> {/* Dynamic Category Route */}
              <Route path="projects/industrial" element={<IndustrialProjects />} />
              <Route path="projects/commercial" element={<CommercialProjects />} />
              <Route path="projects/specialized" element={<SpecializedProjects />} />
              <Route path="services" element={<Services />} />
              <Route path="services/:slug" element={<ServiceDetail />} /> {/* Dynamic Service Detail */}
              <Route path="installation" element={<Installation />} />
              <Route path="maintenance" element={<Maintenance />} />
              <Route path="repair" element={<Repair />} />
              <Route path="consulting" element={<Consulting />} />
              <Route path="service-support" element={<ServiceSupport />} />
              <Route path="technologies" element={<Technologies />} />
              <Route path="technologies/energy-efficiency" element={<EnergyEfficiency />} />
              <Route path="technology" element={<Navigate to="/technologies" replace />} />
              <Route path="news" element={<News />} />
              <Route path="news/category/:category" element={<News />} />
              <Route path="news/tag/:tag" element={<News />} />
              <Route path="news/:slug" element={<NewsDetail />} />
              <Route path="events" element={<Events />} />
              <Route path="event-details/:id" element={<EventDetail />} />
              <Route path="project-details/:id" element={<ProjectDetail />} />
              <Route path="search" element={<SearchResults />} />
              <Route path="publications" element={<Publications />} />
              <Route path="publications/inverter-technology" element={<InverterTechnology />} />
              <Route path="publications/heat-recovery-solutions" element={<HeatRecoverySolutions />} />
              <Route path="publications/green-building-standards" element={<GreenBuildingStandards />} />
              <Route path="publications/energy-efficiency-report" element={<EnergyEfficiencyReport />} />
              <Route path="contact" element={<StaticPage slug="contact" />} />
              <Route path="team" element={<StaticPage slug="team" />} />
              <Route path="recruitment/:slug" element={<JobDetail />} />
              <Route path="legal/privacy" element={<Privacy />} />
              <Route path="legal/terms" element={<Terms />} />
              <Route path="legal/cookies" element={<Cookies />} />
              <Route path="legal/sitemap" element={<Sitemap />} />

              {/* Dynamic Data Resources Routes */}
              <Route path="data/statistics" element={<Statistics />} />
              <Route path="data/tools" element={<Tools />} />
              <Route path="data/:slug" element={<ResourceCategory />} />
              <Route path="data/:category/:slug" element={<ResourceDetail />} />

              {/* Catch-all dynamic slug for static pages at root level */}
              <Route path=":slug" element={<StaticPage />} />

              {/* <Route path="login" element={<Login />} /> */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
        <Toaster />
        <Sonner />
      </BrowserRouter>
    </HelmetProvider>
  </TooltipProvider >
);

export default App;
