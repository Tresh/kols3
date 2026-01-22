import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { KOLFormData, CONTINENTS } from "@/types/kol-form";
import { Globe, MapPin, Calendar, GraduationCap } from "lucide-react";

interface RegionStepProps {
  data: KOLFormData;
  updateData: (updates: Partial<KOLFormData>) => void;
}

const LANGUAGES = [
  "English", "Spanish", "French", "German", "Portuguese", "Russian",
  "Chinese", "Japanese", "Korean", "Arabic", "Hindi", "Turkish",
  "Vietnamese", "Indonesian", "Thai", "Filipino", "Dutch", "Italian"
];

export const RegionStep = ({ data, updateData }: RegionStepProps) => {
  const toggleLanguage = (lang: string) => {
    const current = data.geoLanguages || [];
    if (current.includes(lang)) {
      updateData({ geoLanguages: current.filter(l => l !== lang) });
    } else {
      updateData({ geoLanguages: [...current, lang] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2">Region & Geo Reach</h3>
        <p className="text-sm text-muted-foreground">Where is your audience?</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="primaryCountry" className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Primary Country *
        </Label>
        <Input
          id="primaryCountry"
          value={data.primaryCountry}
          onChange={(e) => updateData({ primaryCountry: e.target.value })}
          placeholder="Nigeria"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="secondaryCountries" className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Secondary Countries
        </Label>
        <Input
          id="secondaryCountries"
          value={data.secondaryCountries?.join(', ') || ''}
          onChange={(e) => updateData({ 
            secondaryCountries: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
          })}
          placeholder="Ghana, Kenya, South Africa (comma-separated)"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="continent" className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Continent *
        </Label>
        <select
          id="continent"
          value={data.continent}
          onChange={(e) => updateData({ continent: e.target.value })}
          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
        >
          <option value="">Select continent</option>
          {CONTINENTS.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          Content Languages *
        </Label>
        <p className="text-xs text-muted-foreground mb-2">
          Which languages do you create content in?
        </p>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map(lang => (
            <button
              key={lang}
              type="button"
              onClick={() => toggleLanguage(lang)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                data.geoLanguages?.includes(lang)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background border-border hover:border-primary'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <Label htmlFor="offlineEvents" className="cursor-pointer">
              Can you host offline events?
            </Label>
          </div>
          <Switch
            id="offlineEvents"
            checked={data.canHostOfflineEvents}
            onCheckedChange={(checked) => updateData({ canHostOfflineEvents: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-muted-foreground" />
            <Label htmlFor="campusAccess" className="cursor-pointer">
              Do you have campus access?
            </Label>
          </div>
          <Switch
            id="campusAccess"
            checked={data.hasCampusAccess}
            onCheckedChange={(checked) => updateData({ hasCampusAccess: checked })}
          />
        </div>
      </div>
    </div>
  );
};
