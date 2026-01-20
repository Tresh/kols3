import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="section-padding pt-32">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black mb-8">Privacy Policy</h1>
          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
            <p className="text-lg">
              Last updated: January 2025
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you create an 
                account, fill out a form, or communicate with us. This may include your name, 
                email address, social media handles, and any other information you choose to provide.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process applications and manage waitlists</li>
                <li>Send you technical notices and support messages</li>
                <li>Communicate with you about campaigns and opportunities</li>
                <li>Monitor and analyze trends and usage</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">3. Information Sharing</h2>
              <p>
                We do not sell, trade, or rent your personal information to third parties. 
                We may share information with project partners only when necessary to execute 
                campaigns you've opted into.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">4. Data Security</h2>
              <p>
                We take reasonable measures to help protect your personal information from 
                loss, theft, misuse, and unauthorized access. However, no internet transmission 
                is completely secure.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">5. Your Rights</h2>
              <p>
                You have the right to access, correct, or delete your personal information. 
                Contact us at privacy@kols3.io to exercise these rights.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">6. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at 
                privacy@kols3.io.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
