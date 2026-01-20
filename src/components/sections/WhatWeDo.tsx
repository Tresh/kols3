import { Target, Users, Globe } from "lucide-react";

const pillars = [
  {
    icon: Target,
    title: "Influence Marketing",
    description: "Strategic KOL partnerships that drive authentic engagement and conversions across Web3 communities.",
  },
  {
    icon: Users,
    title: "Community Systems",
    description: "Structured ambassador and community programs built for long-term growth and retention.",
  },
  {
    icon: Globe,
    title: "Geo & Campus Activation",
    description: "Regional and educational expansion strategies targeting emerging Web3 markets globally.",
  },
];

export const WhatWeDo = () => {
  return (
    <section className="section-padding">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6">
            What We Do
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We design and execute high-impact Web3 growth campaigns that drive 
            real users, attention, and community loyalty.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((pillar, index) => (
            <div
              key={pillar.title}
              className="glass-card-hover rounded-2xl p-8 text-center group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-foreground/5 mb-6 group-hover:bg-foreground/10 transition-colors">
                <pillar.icon size={28} className="text-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-4">{pillar.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
