const steps = [
  {
    number: "01",
    title: "Strategy Design",
    description: "We analyze your goals and design a custom campaign strategy.",
  },
  {
    number: "02",
    title: "Talent Sourcing",
    description: "We source and vet KOLs, ambassadors, and creators for your campaign.",
  },
  {
    number: "03",
    title: "Onboarding & Training",
    description: "We onboard talent and provide campaign-specific training.",
  },
  {
    number: "04",
    title: "Campaign Launch",
    description: "We launch coordinated campaigns across all channels.",
  },
  {
    number: "05",
    title: "Activity Tracking",
    description: "Real-time tracking of all campaign activities and metrics.",
  },
  {
    number: "06",
    title: "Optimization",
    description: "Continuous optimization based on performance data.",
  },
  {
    number: "07",
    title: "Reporting",
    description: "Comprehensive reports with actionable insights.",
  },
  {
    number: "08",
    title: "Scale",
    description: "Scale winning strategies across new markets and channels.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="section-padding">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6">
            How Our Campaigns Work
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A systematic approach to Web3 growth from strategy to scale.
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-border/50 transform -translate-x-1/2" />

          <div className="grid lg:grid-cols-2 gap-6">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`relative glass-card-hover rounded-xl p-6 ${
                  index % 2 === 0 ? "lg:pr-12" : "lg:pl-12"
                }`}
              >
                {/* Connection Dot */}
                <div className="hidden lg:block absolute top-1/2 w-4 h-4 rounded-full bg-foreground border-4 border-background transform -translate-y-1/2 z-10" 
                  style={{ 
                    [index % 2 === 0 ? 'right' : 'left']: '-8px',
                  }} 
                />

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 text-3xl font-black text-foreground/20">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
