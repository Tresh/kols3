import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="section-padding pt-32">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black mb-8">Terms of Service</h1>
          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
            <p className="text-lg">
              Last updated: January 2025
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">1. Acceptance of Terms</h2>
              <p>
                By accessing or using KOLS3 services, you agree to be bound by these Terms 
                of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">2. Eligibility</h2>
              <p>
                You must be at least 18 years old to use our services. By using KOLS3, 
                you represent and warrant that you meet this requirement.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">3. KOL & Ambassador Conduct</h2>
              <p>As a participant in our network, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate information in your application</li>
                <li>Disclose sponsored content as required by applicable laws</li>
                <li>Not engage in fraudulent activities or fake engagement</li>
                <li>Respect confidentiality of campaign details</li>
                <li>Maintain professional conduct in all interactions</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">4. Campaign Participation</h2>
              <p>
                Participation in campaigns is subject to approval. We reserve the right 
                to reject or remove participants who violate these terms or fail to meet 
                campaign requirements.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">5. Intellectual Property</h2>
              <p>
                All content, trademarks, and materials on KOLS3 are owned by us or our 
                licensors. You may not use our branding without explicit permission.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">6. Limitation of Liability</h2>
              <p>
                KOLS3 is provided "as is" without warranties of any kind. We are not liable 
                for any indirect, incidental, or consequential damages arising from your 
                use of our services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">7. Changes to Terms</h2>
              <p>
                We may modify these terms at any time. Continued use of our services 
                after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">8. Contact</h2>
              <p>
                For questions about these Terms, contact us at legal@kols3.io.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
