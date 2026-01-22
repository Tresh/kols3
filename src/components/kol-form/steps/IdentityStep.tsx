import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { KOLFormData } from "@/types/kol-form";
import { User, Mail, MapPin, Clock, Languages } from "lucide-react";

interface IdentityStepProps {
  data: KOLFormData;
  updateData: (updates: Partial<KOLFormData>) => void;
}

const TIMEZONES = [
  "UTC-12:00", "UTC-11:00", "UTC-10:00", "UTC-09:00", "UTC-08:00", "UTC-07:00",
  "UTC-06:00", "UTC-05:00", "UTC-04:00", "UTC-03:00", "UTC-02:00", "UTC-01:00",
  "UTC+00:00", "UTC+01:00", "UTC+02:00", "UTC+03:00", "UTC+04:00", "UTC+05:00",
  "UTC+06:00", "UTC+07:00", "UTC+08:00", "UTC+09:00", "UTC+10:00", "UTC+11:00",
  "UTC+12:00"
];

const LANGUAGES = [
  "English", "Spanish", "French", "German", "Portuguese", "Russian",
  "Chinese", "Japanese", "Korean", "Arabic", "Hindi", "Turkish",
  "Vietnamese", "Indonesian", "Thai", "Filipino"
];

export const IdentityStep = ({ data, updateData }: IdentityStepProps) => {
  const toggleLanguage = (lang: string) => {
    const current = data.languages || [];
    if (current.includes(lang)) {
      updateData({ languages: current.filter(l => l !== lang) });
    } else {
      updateData({ languages: [...current, lang] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2">Your Identity</h3>
        <p className="text-sm text-muted-foreground">Tell us who you are</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Full Name *
          </Label>
          <Input
            id="fullName"
            value={data.fullName}
            onChange={(e) => updateData({ fullName: e.target.value })}
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="displayName" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Display Name (Public) *
          </Label>
          <Input
            id="displayName"
            value={data.displayName}
            onChange={(e) => updateData({ displayName: e.target.value })}
            placeholder="CryptoJohn"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Email *
        </Label>
        <Input
          id="email"
          type="email"
          value={data.email}
          onChange={(e) => updateData({ email: e.target.value })}
          placeholder="john@example.com"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="country" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Country *
          </Label>
          <Input
            id="country"
            value={data.country}
            onChange={(e) => updateData({ country: e.target.value })}
            placeholder="United States"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            City
          </Label>
          <Input
            id="city"
            value={data.city}
            onChange={(e) => updateData({ city: e.target.value })}
            placeholder="New York"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="timezone" className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Timezone *
        </Label>
        <select
          id="timezone"
          value={data.timezone}
          onChange={(e) => updateData({ timezone: e.target.value })}
          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
        >
          <option value="">Select timezone</option>
          {TIMEZONES.map(tz => (
            <option key={tz} value={tz}>{tz}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Languages className="w-4 h-4" />
          Languages *
        </Label>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map(lang => (
            <button
              key={lang}
              type="button"
              onClick={() => toggleLanguage(lang)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                data.languages?.includes(lang)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background border-border hover:border-primary'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Short Bio (Public) *</Label>
        <Textarea
          id="bio"
          value={data.shortBio}
          onChange={(e) => updateData({ shortBio: e.target.value })}
          placeholder="Tell projects about yourself in 2-3 sentences..."
          rows={3}
          maxLength={300}
        />
        <p className="text-xs text-muted-foreground text-right">
          {data.shortBio?.length || 0}/300
        </p>
      </div>
    </div>
  );
};
