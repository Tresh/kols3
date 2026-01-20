import { 
  Megaphone, 
  Users, 
  GraduationCap, 
  Building, 
  Mic, 
  Activity, 
  TrendingUp, 
  Calendar, 
  UserPlus, 
  MapPin 
} from "lucide-react";

const services = [
  {
    icon: Megaphone,
    title: "KOL Campaigns",
    description: "Influencer-based awareness and conversion campaigns.",
  },
  {
    icon: Users,
    title: "Ambassador Programs",
    description: "Structured ambassador onboarding and performance systems.",
  },
  {
    icon: GraduationCap,
    title: "Campus Ambassador Programs",
    description: "Student-focused brand expansion systems.",
  },
  {
    icon: Building,
    title: "Campus Community Programs",
    description: "On-ground community building and long-term retention.",
  },
  {
    icon: Mic,
    title: "AMAs",
    description: "High-impact Twitter Spaces, Telegram & Discord AMAs.",
  },
  {
    icon: Activity,
    title: "Activity Campaigns",
    description: "Gamified engagement and participation systems.",
  },
  {
    icon: TrendingUp,
    title: "Social Growth Campaigns",
    description: "Follower growth, engagement loops, virality systems.",
  },
  {
    icon: Calendar,
    title: "Events",
    description: "Online and offline Web3 activations.",
  },
  {
    icon: UserPlus,
    title: "User Onboarding Campaigns",
    description: "From awareness → signups → retention.",
  },
  {
    icon: MapPin,
    title: "Geo Onboarding Campaigns",
    description: "Regional expansion strategies for Africa, Asia, LATAM.",
  },
];

export const UtilityMarket = () => {
  return (
    <section id="services" className="section-padding bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Our Utility Market
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black">
            Full-Stack Web3 Marketing
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="glass-card-hover rounded-xl p-6 group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-foreground/5 group-hover:bg-foreground/10 transition-colors">
                  <service.icon size={18} className="text-foreground" />
                </div>
              </div>
              <h3 className="font-semibold mb-2 text-sm">{service.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
