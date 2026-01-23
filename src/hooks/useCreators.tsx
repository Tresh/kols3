import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export interface SocialPlatform {
  platform: string;
  handle: string;
  followers: number;
  engagementRate: string;
  contentType?: string[];
}

export interface PastWork {
  id: string;
  projectName: string;
  campaignType: string;
  whatYouDid: string;
  proofLink: string;
  results: string;
}

export interface Creator {
  id: string;
  user_id: string;
  display_name: string | null;
  full_name: string | null;
  avatar_url: string | null;
  short_bio: string | null;
  tier: string | null;
  total_followers: number | null;
  niches: string[] | null;
  deliverables: string[] | null;
  continents: string[] | null;
  country: string | null;
  city: string | null;
  languages: string[] | null;
  social_platforms: Json | null;
  past_work: Json | null;
  min_budget: string | null;
  verification_status: string | null;
  profile_completed: boolean | null;
}

// Helper to safely parse social platforms from JSON
export function parseSocialPlatforms(data: Json | null): SocialPlatform[] {
  if (!data || !Array.isArray(data)) return [];
  return data as unknown as SocialPlatform[];
}

// Helper to safely parse past work from JSON
export function parsePastWork(data: Json | null): PastWork[] {
  if (!data || !Array.isArray(data)) return [];
  return data as unknown as PastWork[];
}

export function useCreators(filters?: {
  search?: string;
  tiers?: string[];
  regions?: string[];
  platforms?: string[];
  niches?: string[];
}) {
  return useQuery({
    queryKey: ["creators", filters],
    queryFn: async () => {
      let query = supabase
        .from("creator_profiles")
        .select("*")
        .eq("profile_completed", true)
        .order("total_followers", { ascending: false });

      // Apply tier filter
      if (filters?.tiers && filters.tiers.length > 0) {
        query = query.in("tier", filters.tiers);
      }

      // Apply niche filter
      if (filters?.niches && filters.niches.length > 0) {
        query = query.overlaps("niches", filters.niches);
      }

      // Apply continent/region filter
      if (filters?.regions && filters.regions.length > 0) {
        query = query.overlaps("continents", filters.regions);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Apply client-side filtering for search and platforms
      let filteredData = data || [];

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredData = filteredData.filter((creator) => {
          const name = (creator.display_name || creator.full_name || "").toLowerCase();
          const bio = (creator.short_bio || "").toLowerCase();
          const niches = (creator.niches || []).join(" ").toLowerCase();
          return name.includes(searchLower) || bio.includes(searchLower) || niches.includes(searchLower);
        });
      }

      if (filters?.platforms && filters.platforms.length > 0) {
        filteredData = filteredData.filter((creator) => {
          const platforms = parseSocialPlatforms(creator.social_platforms)
            .map((p) => p.platform?.toLowerCase());
          return filters.platforms!.some((fp) => platforms.includes(fp.toLowerCase()));
        });
      }

      return filteredData as Creator[];
    },
  });
}

export function useCreator(creatorId: string) {
  return useQuery({
    queryKey: ["creator", creatorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("creator_profiles")
        .select("*")
        .eq("id", creatorId)
        .maybeSingle();

      if (error) throw error;
      return data as Creator | null;
    },
    enabled: !!creatorId,
  });
}

// Helper functions
export function formatFollowers(count: number | null): string {
  if (!count) return "0";
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
  return count.toString();
}

export function getTierIcon(tier: string | null): string {
  switch (tier) {
    case "Pioneer": return "🚀";
    case "Voyager": return "🛸";
    case "Odyssey": return "🌙";
    case "Nebula": return "🌌";
    case "Cosmos": return "✨";
    default: return "🚀";
  }
}

export function getCountryFlag(country: string | null): string {
  const flags: Record<string, string> = {
    "Nigeria": "🇳🇬",
    "Kenya": "🇰🇪",
    "South Africa": "🇿🇦",
    "Ghana": "🇬🇭",
    "Egypt": "🇪🇬",
    "India": "🇮🇳",
    "Vietnam": "🇻🇳",
    "Philippines": "🇵🇭",
    "Indonesia": "🇮🇩",
    "Japan": "🇯🇵",
    "Korea": "🇰🇷",
    "UK": "🇬🇧",
    "Germany": "🇩🇪",
    "France": "🇫🇷",
    "Spain": "🇪🇸",
    "Netherlands": "🇳🇱",
    "Brazil": "🇧🇷",
    "Mexico": "🇲🇽",
    "Argentina": "🇦🇷",
    "Colombia": "🇨🇴",
    "USA": "🇺🇸",
    "Canada": "🇨🇦",
    "UAE": "🇦🇪",
    "Saudi Arabia": "🇸🇦",
    "Turkey": "🇹🇷",
  };
  return flags[country || ""] || "🌍";
}
