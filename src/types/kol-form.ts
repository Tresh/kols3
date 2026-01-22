// KOL Onboarding Form Types

export interface SocialPlatform {
  id: string;
  platform: string;
  handle: string;
  followers: number;
  avgViews: number;
  engagementRate: string;
  contentType: string[];
}

export interface PastWork {
  id: string;
  projectName: string;
  campaignType: string;
  whatYouDid: string;
  proofLink: string;
  results: string;
}

export type KOLTier = 'Pioneer' | 'Voyager' | 'Odyssey' | 'Nebula' | 'Cosmos';

export interface KOLFormData {
  // Section A: Identity
  fullName: string;
  displayName: string;
  email: string;
  country: string;
  city: string;
  timezone: string;
  languages: string[];
  profilePhoto: File | null;
  shortBio: string;

  // Section B: Social Platforms
  socialPlatforms: SocialPlatform[];

  // Section C: Tier (auto-calculated)
  calculatedTier: KOLTier;
  totalFollowers: number;

  // Section D: Region & Geo Reach
  primaryCountry: string;
  secondaryCountries: string[];
  continent: string;
  geoLanguages: string[];
  canHostOfflineEvents: boolean;
  hasCampusAccess: boolean;

  // Section E: Niches
  niches: string[];

  // Section F: Deliverables
  deliverables: string[];

  // Section G: Past Work
  pastWork: PastWork[];

  // Section H: Work Preferences
  acceptedProjectTypes: string[];
  rejectedProjectTypes: string[];
  minimumBudget: string;
  preferredPayment: string[];
  availability: string;
  timeCommitment: string;

  // Section I: Retweet Proof
  retweetLink: string;
  quoteTweetLink: string;
  twitterUsername: string;
  proofScreenshot: File | null;

  // Section J: Wallet
  walletAddress: string;
  preferredChain: string;

  // Section K: Agreements
  termsAccepted: boolean;
  escrowAccepted: boolean;
  proofOfWorkAccepted: boolean;
  publicProfileConsent: boolean;
}

export const PLATFORMS = [
  'X (Twitter)',
  'TikTok',
  'YouTube',
  'Telegram',
  'Discord',
  'Instagram',
  'Blog',
  'Podcast',
  'LinkedIn',
];

export const CONTENT_TYPES = [
  'Threads',
  'Videos',
  'Spaces',
  'Tutorials',
  'Memes',
  'Reviews',
  'News',
  'Analysis',
];

export const NICHES = [
  'DeFi',
  'NFTs',
  'Gaming',
  'Infrastructure',
  'AI',
  'Solana',
  'Base',
  'Ethereum',
  'TON',
  'Memecoins',
  'Exchanges',
  'Wallets',
  'SocialFi',
  'Privacy',
  'Trading',
  'Education',
];

export const DELIVERABLES = [
  'Threads',
  'Long-form tweets',
  'TikTok videos',
  'YouTube reviews',
  'AMAs',
  'Twitter spaces',
  'Discord raids',
  'Telegram raids',
  'Referral funnels',
  'Community onboarding',
  'Email funnels',
  'Tutorial content',
  'Demo videos',
  'Walkthroughs',
  'Meme content',
  'Event hosting',
  'Campus activations',
];

export const PROJECT_TYPES = [
  'DeFi protocols',
  'NFT projects',
  'Gaming/GameFi',
  'Infrastructure',
  'AI projects',
  'Exchanges',
  'Wallets',
  'Memecoins',
  'DAOs',
  'SocialFi',
  'Layer 1s',
  'Layer 2s',
];

export const PAYMENT_METHODS = [
  'USDT',
  'USDC',
  'ETH',
  'SOL',
  'BTC',
  'Fiat (Bank)',
];

export const CONTINENTS = [
  'Africa',
  'Asia',
  'Europe',
  'North America',
  'South America',
  'Oceania',
  'Middle East',
];

export const CHAINS = [
  'Ethereum',
  'Solana',
  'Base',
  'Polygon',
  'Arbitrum',
  'BSC',
  'TON',
  'Other',
];

export function calculateTier(totalFollowers: number): KOLTier {
  if (totalFollowers >= 1000000) return 'Cosmos';
  if (totalFollowers >= 200000) return 'Nebula';
  if (totalFollowers >= 50000) return 'Odyssey';
  if (totalFollowers >= 10000) return 'Voyager';
  return 'Pioneer';
}

export function getTierInfo(tier: KOLTier): { range: string; color: string } {
  switch (tier) {
    case 'Pioneer':
      return { range: '1K - 10K', color: 'text-muted-foreground' };
    case 'Voyager':
      return { range: '10K - 50K', color: 'text-foreground' };
    case 'Odyssey':
      return { range: '50K - 200K', color: 'text-foreground' };
    case 'Nebula':
      return { range: '200K - 1M', color: 'text-foreground' };
    case 'Cosmos':
      return { range: '1M+', color: 'text-foreground' };
  }
}
