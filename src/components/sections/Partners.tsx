const categories = [
  "DeFi",
  "Layer 2",
  "NFTs",
  "AI",
  "SocialFi",
  "Gaming",
  "Infrastructure",
  "DAO",
];

export const Partners = () => {
  return (
    <section className="section-padding">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6">
            Projects We've Worked With
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trusted by leading Web3 projects across every vertical.
          </p>
        </div>

        {/* Category Tags */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <span
              key={category}
              className="px-6 py-3 rounded-full glass-card text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors cursor-default"
            >
              {category}
            </span>
          ))}
        </div>

        {/* Partner Logos Placeholder */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="glass-card rounded-xl aspect-[3/2] flex items-center justify-center group hover:border-foreground/20 transition-colors"
            >
              <div className="w-20 h-8 rounded bg-foreground/10 group-hover:bg-foreground/15 transition-colors" />
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          And 50+ more projects across the Web3 ecosystem
        </p>
      </div>
    </section>
  );
};
