/**
 * Mock data — used as fallback while backend is being built.
 * Every api.* call in page components catches errors and falls back to these.
 * When backend is fully live, the catches will simply never trigger.
 */

import type {
  HeroContent,
  Category,
  NewsArticle,
  Testimonial,
  AboutContent,
  GalleryItem,
  Project,
} from "@/types";

export const mockHero: HeroContent = {
  candidate_name: "Elphas Shilosio",
  tagline: "Building a better Murhanda — together.",
  bio_short:
    "Proven leadership, real projects, and a bold agenda for every resident of Murhanda Ward.",
  photo_url: null,
  stats: [
    { label: "Projects completed", value: "18+" },
    { label: "Sectors served",     value: "14"  },
    { label: "Residents reached",  value: "5K+" },
    { label: "Years active",       value: "3"   },
  ],
  video_url:   "https://www.youtube.com/embed/YOUR_VIDEO_ID",
  video_title: "Murhanda Rising — Our Work in Action",
};

export const mockCategories: Category[] = [
  { id: 1,  name: "Health",              slug: "health",       icon: "H",  project_count: 2,  order: 1  },
  { id: 2,  name: "Education",           slug: "education",    icon: "E",  project_count: 2,  order: 2  },
  { id: 3,  name: "Transport & Roads",   slug: "transport",    icon: "T",  project_count: 2,  order: 3  },
  { id: 4,  name: "Water & Sanitation",  slug: "water",        icon: "W",  project_count: 2,  order: 4  },
  { id: 5,  name: "Agriculture",         slug: "agriculture",  icon: "A",  project_count: 2,  order: 5  },
  { id: 6,  name: "Security & Lighting", slug: "security",     icon: "S",  project_count: 1,  order: 6  },
  { id: 7,  name: "Youth & Sports",      slug: "youth",        icon: "Y",  project_count: 1,  order: 7  },
  { id: 8,  name: "Women Empowerment",   slug: "women",        icon: "WE", project_count: 1,  order: 8  },
  { id: 9,  name: "Environment",         slug: "environment",  icon: "Ev", project_count: 1,  order: 9  },
  { id: 10, name: "Bursaries",           slug: "bursary",      icon: "B",  project_count: 1,  order: 10 },
  { id: 11, name: "Social Protection",   slug: "social",       icon: "SP", project_count: 1,  order: 11 },
  { id: 12, name: "Trade & Markets",     slug: "trade",        icon: "Tr", project_count: 1,  order: 12 },
  { id: 13, name: "ICT & Digital",       slug: "ict",          icon: "I",  project_count: 1,  order: 13 },
];

export const mockProjects: Project[] = [
  {
    id: 1,  title: "Dispensary Upgrade",       slug: "dispensary-upgrade",
    description: "Renovated Murhanda Ward dispensary, added a maternity wing and essential medical equipment — now serving 3,000+ residents around the clock.",
    year: 2023, cover_image: null, images: [],
    category: mockCategories[0], is_featured: true,
  },
  {
    id: 2,  title: "Mobile Health Clinic",     slug: "mobile-health-clinic",
    description: "Fortnightly mobile clinic reaching all remote villages, bringing free consultations, drugs, and maternal health services directly to residents.",
    year: 2022, cover_image: null, images: [],
    category: mockCategories[0], is_featured: false,
  },
  {
    id: 3,  title: "School Renovation",        slug: "school-renovation",
    description: "Rebuilt four classrooms, installed new desks, and provided clean water at Murhanda Primary School.",
    year: 2022, cover_image: null, images: [],
    category: mockCategories[1], is_featured: true,
  },
  {
    id: 4,  title: "School Feeding Programme", slug: "school-feeding",
    description: "Daily nutritious meals for 600 pupils across two primary schools, reducing dropout rates and improving academic performance.",
    year: 2023, cover_image: null, images: [],
    category: mockCategories[1], is_featured: false,
  },
  {
    id: 5,  title: "Access Road — Sector B",   slug: "access-road-sector-b",
    description: "Graded and murram-surfaced 4.5 km of the main access road connecting Sector B to the tarmac, cutting travel time significantly.",
    year: 2023, cover_image: null, images: [],
    category: mockCategories[2], is_featured: false,
  },
  {
    id: 6,  title: "Bridge Repair",            slug: "bridge-repair",
    description: "Rebuilt the river crossing destroyed by floods, restoring safe passage for residents and farm produce transport.",
    year: 2022, cover_image: null, images: [],
    category: mockCategories[2], is_featured: false,
  },
  {
    id: 7,  title: "Borehole Installation",    slug: "borehole",
    description: "Drilled and equipped a solar-powered borehole serving 500 households with clean drinking water throughout the year.",
    year: 2022, cover_image: null, images: [],
    category: mockCategories[3], is_featured: true,
  },
  {
    id: 8,  title: "Market Sanitation Block",  slug: "market-sanitation",
    description: "Constructed modern sanitation facilities at the market centre, significantly improving hygiene for all traders and visitors.",
    year: 2023, cover_image: null, images: [],
    category: mockCategories[3], is_featured: false,
  },
  {
    id: 9,  title: "Farmers Input Programme",  slug: "farmers-input",
    description: "Subsidised fertiliser and certified seeds distributed to 800 smallholder farmers ahead of the long rains season.",
    year: 2023, cover_image: null, images: [],
    category: mockCategories[4], is_featured: false,
  },
  {
    id: 10, title: "Irrigation Scheme",        slug: "irrigation",
    description: "Installed a gravity-fed irrigation channel covering 30 acres, enabling year-round farming for 120 families.",
    year: 2022, cover_image: null, images: [],
    category: mockCategories[4], is_featured: false,
  },
  {
    id: 11, title: "Solar Street Lights",      slug: "solar-lights",
    description: "Installed 40 solar-powered streetlights along the main market road, improving safety and enabling extended evening trading.",
    year: 2023, cover_image: null, images: [],
    category: mockCategories[5], is_featured: false,
  },
  {
    id: 12, title: "Youth Football Grounds",   slug: "youth-football",
    description: "Cleared and levelled a community football pitch, and provided kits for three youth teams across the ward.",
    year: 2022, cover_image: null, images: [],
    category: mockCategories[6], is_featured: false,
  },
  {
    id: 13, title: "Women Sacco Seed Fund",    slug: "women-sacco",
    description: "Provided a KES 500,000 seed fund to the Murhanda Women Sacco, enabling 200 women to access affordable credit.",
    year: 2023, cover_image: null, images: [],
    category: mockCategories[7], is_featured: false,
  },
  {
    id: 14, title: "Tree Planting Drive",      slug: "tree-planting",
    description: "Mobilised residents to plant 5,000 indigenous trees along river banks and school compounds across the ward.",
    year: 2023, cover_image: null, images: [],
    category: mockCategories[8], is_featured: false,
  },
  {
    id: 15, title: "Ward Bursary Awards",      slug: "ward-bursary",
    description: "Awarded bursaries to 180 needy students from primary to university level, funded through ward development allocations.",
    year: 2023, cover_image: null, images: [],
    category: mockCategories[9], is_featured: true,
  },
  {
    id: 16, title: "Elder Care Support",       slug: "elder-care",
    description: "Distributed food hampers and blankets to 120 elderly and vulnerable households during the cold season.",
    year: 2022, cover_image: null, images: [],
    category: mockCategories[10], is_featured: false,
  },
  {
    id: 17, title: "Market Stall Construction",slug: "market-stalls",
    description: "Built 30 permanent market stalls at the main market centre, formalising trade and increasing vendor incomes.",
    year: 2022, cover_image: null, images: [],
    category: mockCategories[11], is_featured: false,
  },
  {
    id: 18, title: "Community ICT Hub",        slug: "ict-hub",
    description: "Set up a 20-computer ICT centre at the ward hall, offering free digital literacy classes to youth and adults.",
    year: 2023, cover_image: null, images: [],
    category: mockCategories[12], is_featured: false,
  },
];

export const mockNews: NewsArticle[] = [
  {
    id: 1,
    title: "Murhanda Dispensary Officially Commissioned",
    slug: "dispensary-commissioned",
    excerpt: "The newly renovated Murhanda Ward dispensary opened this week, adding a maternity wing and modern equipment now serving over 3,000 residents.",
    content: "<p>The newly renovated Murhanda Ward dispensary was officially commissioned this week in a ceremony attended by county officials and hundreds of residents. The facility now features a modern maternity wing, updated examination rooms, and a well-stocked pharmacy.</p><p>Over 3,000 residents will benefit from improved healthcare services that were previously only accessible 10km away at the sub-county hospital.</p>",
    body: "<p>Full article body — update via admin panel.</p>",
    cover_image: null,
    published_at: "2024-03-15T10:00:00Z",
    author: "Campaign Team",
  },
  {
    id: 2,
    title: "180 Students Receive Ward Bursaries",
    slug: "bursary-awards-2024",
    excerpt: "Elphas Shilosio handed bursaries to 180 students from primary to university level, funded through ward development allocations.",
    content: "<p>In a ceremony held at the ward office, 180 students received bursary awards ranging from KES 5,000 for primary school pupils to KES 25,000 for university students.</p><p>The bursary programme, funded through ward development allocations, has been expanded this year to cover more students across all villages in Murhanda Ward.</p>",
    body: "<p>Full article body — update via admin panel.</p>",
    cover_image: null,
    published_at: "2024-02-28T09:00:00Z",
    author: "Campaign Team",
  },
  {
    id: 3,
    title: "40 Solar Street Lights Illuminate Market Road",
    slug: "solar-lights-market-road",
    excerpt: "Forty solar-powered streetlights now line the ward market road, improving safety and enabling extended evening trading hours.",
    content: "<p>Forty solar-powered streetlights have been installed along the 2km market road stretch, bringing light to an area that was previously dark and unsafe after sunset.</p><p>Traders report that business hours have extended significantly, with evening markets now active until 9pm. Security incidents along the road have also reduced markedly since installation.</p>",
    body: "<p>Full article body — update via admin panel.</p>",
    cover_image: null,
    published_at: "2024-02-10T08:00:00Z",
    author: "Campaign Team",
  },
];

export const mockTestimonials: Testimonial[] = [
  { id: 1, quote: "The dispensary upgrade saved lives. We no longer travel 10km for basic care.",        author: "Mary A.",   location: "Sector C" },
  { id: 2, quote: "My children now study in proper classrooms. Elphas delivered what others promised.", author: "John K.",   location: "Murhanda" },
  { id: 3, quote: "The borehole changed everything. Clean water right here in our village.",            author: "Grace W.",  location: "Sector A" },
  { id: 4, quote: "He shows up at the baraza, at ground-breaking, and again at completion. Rare.",      author: "Elijah M.", location: "Sector B" },
];

export const mockAbout: AboutContent = {
  bio: "Elphas Shilosio was born and raised in Murhanda Ward and has dedicated his life to its upliftment. With a background in community development and local governance, he has built a track record of turning challenges into completed projects that residents can see and feel every day.",
  vision: "A Murhanda where every child attends a well-equipped school, every family accesses quality healthcare within reach, every road connects opportunity, and every household has clean water. His agenda puts people before politics and delivery before promises.",
  commitment: "Elphas believes in servant leadership — showing up, listening, and working. He holds regular community barazas, publishes ward fund expenditure reports, and maintains an open-door approach to every constituent regardless of political affiliation.",
  photo_url: null,
  timeline: [
    { year: "2021", event: "Elected MCA for Murhanda Ward. Initiated first ward development plan."      },
    { year: "2022", event: "Delivered 8 projects across health, water, education and transport."        },
    { year: "2023", event: "Expanded to agriculture, women empowerment, youth, and ICT sectors."       },
    { year: "2024", event: "Ward bursary programme doubled. 18+ completed projects across 14 sectors." },
  ],
  values: [
    { title: "Accountability", description: "Every shilling of ward funds accounted for publicly."     },
    { title: "Inclusivity",    description: "No village left behind. Every sector represented."        },
    { title: "Transparency",   description: "Open books, open barazas, open communication."           },
    { title: "Delivery",       description: "Promises made are promises kept — in concrete and iron." },
  ],
};

export const mockGallery: GalleryItem[] = [
  { id: 1,  url: null, caption: "Dispensary inauguration ceremony",    type: "photo", tag: "events"   },
  { id: 2,  url: null, caption: "Borehole installation — Sector A",    type: "photo", tag: "projects" },
  { id: 3,  url: null, caption: "School renovation — completed block", type: "photo", tag: "projects" },
  { id: 4,  url: null, caption: "Road grading works in progress",      type: "photo", tag: "projects" },
  { id: 5,  url: null, caption: "Bursary awards ceremony 2024",        type: "photo", tag: "events"   },
  { id: 6,  url: null, caption: "Women Sacco seed fund handover",      type: "photo", tag: "events"   },
  { id: 7,  url: null, caption: "Solar streetlight installation",      type: "photo", tag: "projects" },
  { id: 8,  url: null, caption: "Community baraza — Sector B",         type: "photo", tag: "community"},
  { id: 9,  url: null, caption: "Market stall construction",           type: "photo", tag: "projects" },
  { id: 10, url: null, caption: "ICT Hub opening day",                 type: "photo", tag: "events"   },
  { id: 11, url: null, caption: "Tree planting drive 2023",            type: "photo", tag: "community"},
  { id: 12, url: null, caption: "Youth football pitch levelling",      type: "photo", tag: "community"},
];
