import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const caseStudies = [
  {
    title: "DeFi Protocol Launch",
    problem: "New DeFi protocol needed rapid user acquisition in a saturated market.",
    strategy: "Multi-tier KOL campaign with educational content focus.",
    results: {
      users: "45K+",
      tvl: "$12M",
      engagement: "340%",
    },
  },
  {
    title: "L2 Network Expansion",
    problem: "Layer 2 needed to grow presence in emerging APAC markets.",
    strategy: "Campus ambassador program across 50+ universities.",
    results: {
      ambassadors: "200+",
      events: "75",
      signups: "28K",
    },
  },
  {
    title: "NFT Marketplace Growth",
    problem: "Marketplace struggled with creator onboarding and retention.",
    strategy: "Creator-focused ambassador program with incentive structure.",
    results: {
      creators: "1.2K",
      volume: "+280%",
      retention: "67%",
    },
  },
];

export const CaseStudies = () => {
  return (
    <section id="case-studies" className="section-padding">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6">
            Case Studies
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real results from real campaigns. See how we drive growth for Web3 projects.
          </p>
        </div>

        {/* Case Studies Grid */}
        <div className="space-y-8">
          {caseStudies.map((study, index) => (
            <div
              key={study.title}
              className="glass-card-hover rounded-2xl p-8 lg:p-10"
            >
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Info */}
                <div className="lg:col-span-2">
                  <h3 className="text-2xl font-black mb-4">{study.title}</h3>
                  <div className="space-y-4 mb-6">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Problem</span>
                      <p className="text-foreground mt-1">{study.problem}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Strategy</span>
                      <p className="text-foreground mt-1">{study.strategy}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Read Full Case Study
                    <ArrowRight size={14} />
                  </Button>
                </div>

                {/* Results */}
                <div className="flex flex-col justify-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Results</span>
                  <div className="grid grid-cols-3 lg:grid-cols-1 gap-4">
                    {Object.entries(study.results).map(([key, value]) => (
                      <div key={key} className="text-center lg:text-left">
                        <div className="text-2xl lg:text-3xl font-black text-foreground">{value}</div>
                        <div className="text-xs text-muted-foreground capitalize">{key}</div>
                      </div>
                    ))}
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
