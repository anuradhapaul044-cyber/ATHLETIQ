import { addRecentActivity } from './admin';

export type OpportunityCategory = 'Sports Opportunity' | 'Trial' | 'Competition' | 'Scholarship' | 'Government Scheme';

export type Opportunity = {
  id: string;
  title: string;
  organization: string;
  category: OpportunityCategory;
  sport: string;
  location: string;
  deadline: string;
  eligibility: string;
  description: string;
  actionLabel: string;
  actionUrl: string;
  match: number;
  source: 'demo' | 'official';
  status?: string;
};

export const opportunityCategories: OpportunityCategory[] = [
  'Sports Opportunity',
  'Trial',
  'Competition',
  'Scholarship',
  'Government Scheme',
];

const OPPORTUNITY_STORAGE_KEY = 'athletiq_opportunities';

const defaultOpportunities: Opportunity[] = [
  {
    id: 'sa-1',
    title: 'SAI National Athletics Trials 2025',
    organization: 'Sports Authority of India',
    category: 'Trial',
    sport: 'Athletics',
    location: 'New Delhi',
    deadline: 'Mar 15, 2025',
    eligibility: 'Open to athletes in the relevant age groups with valid identification and recent performance records.',
    description: 'National talent identification trials for aspiring athletes across sprint, jump, and middle-distance events.',
    actionLabel: 'Apply',
    actionUrl: '#',
    match: 94,
    source: 'official',
    status: 'Trial open',
  },
  {
    id: 'sch-1',
    title: 'Reliance Foundation Youth Sports Scholarship',
    organization: 'Reliance Foundation',
    category: 'Scholarship',
    sport: 'Multiple',
    location: 'Pan India',
    deadline: 'Apr 30, 2025',
    eligibility: 'Applicants should demonstrate active participation in sport and academic continuity.',
    description: 'Merit-based support for promising young athletes balancing sports development with education.',
    actionLabel: 'Learn More',
    actionUrl: '#',
    match: 87,
    source: 'official',
    status: 'Rolling intake',
  },
  {
    id: 'comp-1',
    title: 'Khelo India Youth Games',
    organization: 'Ministry of Youth Affairs & Sports',
    category: 'Competition',
    sport: 'Multiple',
    location: 'Multiple cities',
    deadline: 'Jan 30, 2025',
    eligibility: 'Open to athletes selected through district and state qualifying pathways aligned to sport categories.',
    description: 'A multi-sport youth competition designed to strengthen grassroots participation and identify emerging talent.',
    actionLabel: 'View Schedule',
    actionUrl: '#',
    match: 91,
    source: 'official',
    status: 'Selection phase',
  },
  {
    id: 'gov-1',
    title: 'National Sports Development Scheme',
    organization: 'Government of India',
    category: 'Government Scheme',
    sport: 'Multiple',
    location: 'State level outreach',
    deadline: 'May 15, 2025',
    eligibility: 'Eligibility varies by scheme and may include age, district representation, and sport-specific conditions.',
    description: 'Government support initiative for youth sports development, grassroots athlete promotion, and talent retention.',
    actionLabel: 'Learn More',
    actionUrl: '#',
    match: 82,
    source: 'official',
    status: 'Program window',
  },
];

function ensureSeededOpportunities(): void {
  if (typeof window === 'undefined') return;
  const existing = localStorage.getItem(OPPORTUNITY_STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(OPPORTUNITY_STORAGE_KEY, JSON.stringify(defaultOpportunities));
  }
}

export function getOpportunities(): Opportunity[] {
  if (typeof window === 'undefined') return defaultOpportunities;
  ensureSeededOpportunities();

  try {
    const raw = localStorage.getItem(OPPORTUNITY_STORAGE_KEY);
    if (!raw) return defaultOpportunities;
    const parsed = JSON.parse(raw) as Partial<Opportunity>[];
    if (!Array.isArray(parsed)) return defaultOpportunities;
    return parsed.filter((item): item is Opportunity => (
      typeof item?.id === 'string'
      && typeof item?.title === 'string'
      && typeof item?.organization === 'string'
      && typeof item?.category === 'string'
      && typeof item?.sport === 'string'
      && typeof item?.location === 'string'
      && typeof item?.deadline === 'string'
      && typeof item?.eligibility === 'string'
      && typeof item?.description === 'string'
      && typeof item?.actionLabel === 'string'
      && typeof item?.actionUrl === 'string'
      && typeof item?.match === 'number'
    ));
  } catch {
    return defaultOpportunities;
  }
}

export function saveOpportunities(next: Opportunity[]): void {
  localStorage.setItem(OPPORTUNITY_STORAGE_KEY, JSON.stringify(next));
}

export function addOpportunity(opportunity: Omit<Opportunity, 'id' | 'source'> & { id?: string; source?: Opportunity['source'] }): Opportunity {
  const opportunities = getOpportunities();
  const item: Opportunity = {
    id: opportunity.id || `${Date.now()}-${Math.random()}`,
    title: opportunity.title,
    organization: opportunity.organization,
    category: opportunity.category,
    sport: opportunity.sport,
    location: opportunity.location,
    deadline: opportunity.deadline,
    eligibility: opportunity.eligibility,
    description: opportunity.description,
    actionLabel: opportunity.actionLabel,
    actionUrl: opportunity.actionUrl,
    match: opportunity.match,
    source: opportunity.source || 'demo',
    status: opportunity.status || 'Open',
  };

  const next = [item, ...opportunities];
  saveOpportunities(next);
  addRecentActivity({
    actor: 'admin',
    role: 'admin',
    action: 'Opportunity created',
    details: `${item.title} was added to the shared opportunities list.`,
    type: 'info',
  });
  return item;
}

export function updateOpportunity(id: string, updates: Partial<Opportunity>): Opportunity | null {
  const opportunities = getOpportunities();
  const index = opportunities.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const next = opportunities.map((item) => item.id === id ? { ...item, ...updates } : item);
  saveOpportunities(next);
  addRecentActivity({
    actor: 'admin',
    role: 'admin',
    action: 'Opportunity updated',
    details: `Opportunity record ${id} was updated.`,
    type: 'info',
  });
  return next[index];
}

export function deleteOpportunity(id: string): void {
  const next = getOpportunities().filter((item) => item.id !== id);
  saveOpportunities(next);
  addRecentActivity({
    actor: 'admin',
    role: 'admin',
    action: 'Opportunity removed',
    details: `Opportunity ${id} was removed from the shared catalogue.`,
    type: 'warning',
  });
}

export const studentOpportunities = getOpportunities();
