import React from 'react';
import { useTranslation } from 'react-i18next';
import { EditableElement } from '../admin/EditableElement';
import { MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { useSettings } from '../../hooks/useSettings';

interface AboutV2HeroProps {
  sectionId?: string;
  title?: string;
  backgroundImage?: string;
}

export const AboutV2HeroBlock: React.FC<AboutV2HeroProps> = ({ 
  sectionId,
  title = 'About Us', 
  backgroundImage = '/assets/about-v2/banner.jpg' 
}) => {
  return (
    <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <EditableElement sectionId={sectionId} fieldKey="backgroundImage" defaultContent={backgroundImage || ""} type="image">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-black/50" />
        </EditableElement>
      </div>
      
      <div className="relative z-10 text-center px-4 -mt-12">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 animate-fade-in uppercase tracking-[0.2em]">
          <EditableElement sectionId={sectionId} fieldKey="title" defaultContent={title || ""} />
        </h1>
        <div className="flex items-center justify-center gap-3 text-white font-medium text-base md:text-lg">
          <Link to="/" className="opacity-80 hover:opacity-100 transition-opacity">Home</Link>
          <span className="opacity-40">/</span>
          <span className="text-white">{title}</span>
        </div>
      </div>
    </section>
  );
};

interface AboutV2IntroProps {
  sectionId?: string;
  title?: string;
  description?: string;
  image?: string; // Logo mockup
  backgroundImage?: string; // Industrial background
  memberText?: string;
  memberLogo?: string;
}

export const AboutV2IntroBlock: React.FC<AboutV2IntroProps> = ({
  sectionId,
  title = 'THUONG THIEN TECHNOLOGIES CO. LTD (TTT)',
  description = 'TTT has been in collaboration with Solar Turbines since last 20 year to provide Vietnam customers with the highest quality Gas Turbines, Generators, Compressors and Service Solutions within Oil & Gas and Electricity Power Generation industry.',
  image = '/assets/about-v2/ttt-logo.svg',
  backgroundImage = '/assets/about-v2/intro-bg.jpg',
  memberText = 'TTT is a member of',
  memberLogo = '/assets/about-v2/truong-dinh-logo.svg'
}) => {
  return (
    <section className="relative w-full pb-0 px-4 md:px-8 z-30">
      <div className="max-w-5xl mx-auto relative -mt-24 shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-t-lg overflow-hidden">
        <div className="absolute inset-0 z-0">
        <EditableElement sectionId={sectionId} fieldKey="backgroundImage" defaultContent={backgroundImage || ""} type="image">
          <div 
            className="absolute inset-0 bg-cover bg-fixed bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-gray-900/10 backdrop-blur-[1px]" />
        </EditableElement>
      </div>
      
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-0 relative z-10 w-full p-6 md:p-12">
        {/* Overlapping Content Card */}
        <div className="md:col-span-6 bg-white p-8 md:p-12 shadow-[0_15px_35px_rgba(0,0,0,0.1)] rounded-sm border-t-4 border-[#2a4392]">
          <h2 className="text-2xl md:text-3xl font-bold text-[#2a4392] mb-6 tracking-wider leading-tight">
            <EditableElement sectionId={sectionId} fieldKey="title" defaultContent={title || ""} />
          </h2>
          <div className="text-gray-700 leading-relaxed space-y-4 text-base md:text-lg">
            <EditableElement sectionId={sectionId} fieldKey="description" defaultContent={description || ""} />
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col items-start gap-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">
              <EditableElement sectionId={sectionId} fieldKey="memberText" defaultContent={memberText || ""} />
            </p>
            <div className="h-10">
              <EditableElement sectionId={sectionId} fieldKey="memberLogo" defaultContent={memberLogo || ""} type="image">
                <img src={memberLogo} alt="Member Logo" className="h-10 opacity-90 hover:opacity-100 transition-opacity object-contain" />
              </EditableElement>
            </div>
          </div>
        </div>

        {/* Right side Logo Mockup (Visible on Desktop) */}
        <div className="hidden md:flex md:col-span-6 items-center justify-center p-12">
          <div className="relative group">
            <div className="absolute -inset-10 bg-[#2a4392]/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <EditableElement sectionId={sectionId} fieldKey="image" defaultContent={image || ""} type="image">
              <img 
                src={image} 
                alt="Mockup" 
                className="relative max-h-[350px] w-auto object-contain drop-shadow-[0_25px_25px_rgba(0,0,0,0.25)] transition-transform duration-500 hover:scale-105" 
              />
            </EditableElement>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

interface AboutV2AccordionProps {
  sectionId?: string;
  vTitle?: string;
  vContent?: string;
  mTitle?: string;
  mContent?: string;
  cTitle?: string;
  cContent?: string;
  sideIcon?: string;
}

export const AboutV2AccordionBlock: React.FC<AboutV2AccordionProps> = ({
  sectionId,
  vTitle = 'OUR VISION',
  vContent = 'Become the most Valued Business Partner to the Clients and Principals in Vietnam O&G, Energy and Power Market.',
  mTitle = 'OUR MISSION',
  mContent = 'Provide the highest standardized products with the best quality services to our clients.',
  cTitle = 'CORE VALUES',
  cContent = '<ul><li><strong>INTEGRITY</strong>: Probity, righteous and law abiding attitudes – The company’s greatest value.</li><li><strong>CUSTOMER CARE</strong>: We care about you and your business.</li><li><strong>TRANSPARENCY</strong>: Conducting honesty, straightforwardness and openness in all matters – the company’s most valuable asset.</li></ul>',
  sideIcon = '/assets/about-v2/team-work-svg.svg'
}) => {
  return (
    <section className="bg-transparent py-0 px-4 md:px-8 pb-20 z-20 relative">
      <div className="max-w-5xl mx-auto shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-b-lg overflow-hidden bg-[#2a4392] p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-center gap-16 md:gap-24">
          {/* Side Icon Column */}
          <div className="w-full md:w-1/2 flex justify-center order-2 md:order-1">
            <div className="relative">
              <div className="absolute -inset-8 bg-white/5 blur-2xl rounded-full" />
              <EditableElement sectionId={sectionId} fieldKey="sideIcon" defaultContent={sideIcon || ""} type="image">
                <img src={sideIcon} alt="Team" className="relative w-64 h-64 md:w-80 md:h-80 object-contain" />
              </EditableElement>
            </div>
          </div>

          {/* Accordion Column */}
          <div className="w-full md:w-1/2 order-1 md:order-2">
            <Accordion type="single" collapsible className="space-y-6" defaultValue="item-1">
              <AccordionItem value="item-1" className="bg-white/5 border border-white/10 rounded-sm px-8 hover:bg-white/10 transition-colors">
                <AccordionTrigger className="text-white hover:no-underline text-lg font-bold py-8 uppercase tracking-widest border-none">
                  <EditableElement sectionId={sectionId} fieldKey="vTitle" defaultContent={vTitle || ""} />
                </AccordionTrigger>
                <AccordionContent className="text-white/80 pb-8 leading-relaxed text-lg border-none">
                  <EditableElement sectionId={sectionId} fieldKey="vContent" defaultContent={vContent || ""} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-white/5 border border-white/10 rounded-sm px-8 hover:bg-white/10 transition-colors">
                <AccordionTrigger className="text-white hover:no-underline text-lg font-bold py-8 uppercase tracking-widest border-none">
                  <EditableElement sectionId={sectionId} fieldKey="mTitle" defaultContent={mTitle || ""} />
                </AccordionTrigger>
                <AccordionContent className="text-white/80 pb-8 leading-relaxed text-lg border-none">
                  <EditableElement sectionId={sectionId} fieldKey="mContent" defaultContent={mContent || ""} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-white/5 border border-white/10 rounded-sm px-8 hover:bg-white/10 transition-colors">
                <AccordionTrigger className="text-white hover:no-underline text-lg font-bold py-8 uppercase tracking-widest border-none">
                  <EditableElement sectionId={sectionId} fieldKey="cTitle" defaultContent={cTitle || ""} />
                </AccordionTrigger>
                <AccordionContent className="text-white/80 pb-8 leading-relaxed border-none">
                  <div 
                    className="prose prose-invert max-w-none text-white/80 text-base" 
                    dangerouslySetInnerHTML={{ __html: cContent }} 
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};

interface Milestone {
  year: string;
  title: string;
  desc: string;
  logo?: string;
}
interface AboutV2TimelineProps {
  sectionId?: string;
  title?: string;
  milestones?: Milestone[];
}

export const AboutV2TimelineBlock: React.FC<AboutV2TimelineProps> = ({ 
  sectionId,
  title = 'THE STORY OF SUCCESS',
  milestones = [] 
}) => {
  console.log('[AboutV2TimelineBlock] Rendering milestones:', milestones.length, milestones[0]?.logo);
  const { getSetting } = useSettings();
  const defaultLogo = getSetting('site_logo', '/assets/about-v2/ttt-logo.svg');

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 text-center mb-20">
        <span className="text-gray-400 text-sm font-bold tracking-[0.3em] uppercase">Our History</span>
        <h2 className="text-3xl md:text-5xl font-black text-[#2a4392] mt-4 uppercase tracking-tighter">
          <EditableElement sectionId={sectionId} fieldKey="title" defaultContent={title || ""} />
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="space-y-0 relative">
          {milestones.map((item, index) => (
            <div key={index} className="group relative">
              {/* Row Container */}
              <div className={`flex flex-col md:flex-row items-center min-h-[280px] ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}>
                
                {/* Logo/Image Side */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12">
                  <div className="relative group/logo">
                    <div className="absolute -inset-4 bg-[#2a4392]/5 rounded-full scale-0 group-hover/logo:scale-100 transition-transform duration-500 blur-xl" />
                    <EditableElement sectionId={sectionId} fieldKey={`milestones.${index}.logo`} defaultContent={item.logo || defaultLogo} type="image">
                      <img 
                        src={item.logo || defaultLogo} 
                        alt="Company Logo" 
                        className="relative h-16 md:h-24 w-auto object-contain grayscale opacity-40 group-hover/logo:grayscale-0 group-hover/logo:opacity-100 transition-all duration-700" 
                      />
                    </EditableElement>
                  </div>
                </div>

                {/* Center Line Side */}
                <div className="hidden md:flex w-24 flex-col items-center self-stretch relative py-8">
                  {/* Vertical line segment with hover glow - Dashed when idle, solid when hovered */}
                  {/* top-8 bottom-8 makes it "segmented" between items */}
                  <div className="absolute top-8 bottom-8 w-0 border-l-2 border-dashed border-gray-200 group-hover:border-solid group-hover:border-[#2a4392] group-hover:shadow-[0_0_15px_rgba(42,67,146,0.4)] transition-all duration-500" />
                  
                  {/* Floating Premium Marker */}
                  <div className="sticky top-1/2 -translate-y-1/2 z-10 py-4 bg-white">
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-100 group-hover:border-[#2a4392] group-hover:bg-[#2a4392] shadow-xl transition-all duration-500 scale-100 group-hover:scale-125 flex items-center justify-center">
                       <div className="w-3 h-3 rounded-full bg-[#2a4392] group-hover:bg-white transition-colors duration-300 shadow-inner" />
                    </div>
                  </div>
                </div>

                {/* Info Side */}
                <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12">
                  <div className={`max-w-md ${index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}>
                    <div className="text-[#2a4392] font-black text-2xl md:text-4xl mb-4 tracking-tighter opacity-90 group-hover:opacity-100 transition-opacity">
                      <EditableElement sectionId={sectionId} fieldKey={`milestones.${index}.year`} defaultContent={item.year || ""} />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#2a4392] transition-colors">
                      <EditableElement sectionId={sectionId} fieldKey={`milestones.${index}.title`} defaultContent={item.title || ""} />
                    </h4>
                    <div className="text-gray-500 leading-relaxed text-lg font-medium">
                      <EditableElement sectionId={sectionId} fieldKey={`milestones.${index}.desc`} defaultContent={item.desc || ""} />
                    </div>
                  </div>
                </div>

              </div>
              
              {/* Connector between items (Broken look - removed for segmented look) */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

interface Location {
  subTitle: string;
  city: string;
  address: string;
  phone: string;
  email: string;
}

interface AboutV2LocationProps {
  sectionId?: string;
  title?: string;
  locations?: Location[];
}

export const AboutV2LocationBlock: React.FC<AboutV2LocationProps> = ({ 
  sectionId,
  title = 'Locations', 
  locations = [] 
}) => {
  const { getSetting } = useSettings();
  
  // Parse branches from settings as fallback
  const contactAddressJson = getSetting('contact_address', '[]');
  let branches = [];
  try {
    branches = JSON.parse(contactAddressJson);
    if (!Array.isArray(branches)) branches = [];
  } catch (e) {
    console.error('Failed to parse contact_address', e);
  }

  // Get branches from settings
  const displayLocations = branches.map((b: any) => ({
    subTitle: b.subtitle || 'Branch',
    city: b.title || '',
    address: b.address || '',
    phone: b.phone || getSetting('contact_phone', ''),
    email: b.email || getSetting('contact_email', '')
  }));

  // Dynamic grid class based on number of locations
  const getGridCols = () => {
    const count = displayLocations.length;
    if (count <= 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-1 md:grid-cols-2';
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  };

  return (
    <section className="py-24 bg-[#f8fafd] relative">
      <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2a4392 0.5px, transparent 0.5px)', backgroundSize: '10px 10px' }} />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <h2 className="text-3xl font-black text-gray-900 mb-20 text-center uppercase tracking-[0.4em]">
          <EditableElement sectionId={sectionId} fieldKey="title" defaultContent={title || ""} />
        </h2>
        
        <div className={`grid ${getGridCols()} gap-16 lg:gap-24`}>
          {displayLocations.map((loc, idx) => (
            <div key={idx} className="flex flex-col space-y-8 animate-fade-in-up" style={{ animationDelay: `${idx * 150}ms` }}>
              <div className="border-b-4 border-gray-900 pb-6">
                <span className="text-[10px] font-black text-[#2a4392] mb-3 block uppercase tracking-[0.5em] opacity-60 font-mono">
                  <EditableElement sectionId={sectionId} fieldKey={`locations.${idx}.subTitle`} defaultContent={loc.subTitle} />
                </span>
                <h3 className="text-xl font-black text-gray-900 tracking-tighter leading-tight uppercase">
                  <EditableElement sectionId={sectionId} fieldKey={`locations.${idx}.city`} defaultContent={loc.city} />
                </h3>
              </div>
              
              <div className="space-y-8">
                <div className="text-gray-600 text-base font-medium leading-relaxed uppercase tracking-tight">
                  <EditableElement 
                    sectionId={sectionId}
                    fieldKey={`locations.${idx}.address`} 
                    defaultContent={loc.address} 
                  />
                </div>
                
                <div className="flex flex-col gap-4 font-mono text-sm">
                  <div className="flex items-center gap-3 text-gray-900 font-bold group hover:text-[#2a4392] transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded bg-white shadow-sm flex items-center justify-center border border-gray-100 group-hover:border-[#2a4392]">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span>
                      <EditableElement 
                        sectionId={sectionId}
                        fieldKey={`locations.${idx}.phone`} 
                        defaultContent={loc.phone} 
                      />
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-900 font-bold group hover:text-[#2a4392] transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded bg-white shadow-sm flex items-center justify-center border border-gray-100 group-hover:border-[#2a4392]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span>
                      <EditableElement 
                        sectionId={sectionId}
                        fieldKey={`locations.${idx}.email`} 
                        defaultContent={loc.email} 
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
