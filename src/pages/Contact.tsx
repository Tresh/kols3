import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageCircle, Send, Twitter } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="section-padding pt-32">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
              Get in Touch
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ready to launch your next campaign? Have questions about our services? 
              We'd love to hear from you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="glass-card rounded-2xl p-8">
              <h2 className="text-xl font-bold mb-6">Send us a message</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <Input placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input type="email" placeholder="you@example.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <Input placeholder="How can we help?" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <Textarea placeholder="Tell us more about your project..." rows={5} />
                </div>
                <Button variant="hero" size="lg" className="w-full">
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="glass-card rounded-2xl p-8">
                <h2 className="text-xl font-bold mb-6">Quick Connect</h2>
                <div className="space-y-4">
                  <a 
                    href="mailto:hello@kols3.io" 
                    className="flex items-center gap-4 p-4 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors"
                  >
                    <Mail size={24} />
                    <div>
                      <div className="font-medium">Email Us</div>
                      <div className="text-sm text-muted-foreground">hello@kols3.io</div>
                    </div>
                  </a>
                  <a 
                    href="#" 
                    className="flex items-center gap-4 p-4 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors"
                  >
                    <Twitter size={24} />
                    <div>
                      <div className="font-medium">Twitter</div>
                      <div className="text-sm text-muted-foreground">@kols3io</div>
                    </div>
                  </a>
                  <a 
                    href="#" 
                    className="flex items-center gap-4 p-4 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors"
                  >
                    <Send size={24} />
                    <div>
                      <div className="font-medium">Telegram</div>
                      <div className="text-sm text-muted-foreground">t.me/kols3</div>
                    </div>
                  </a>
                  <a 
                    href="#" 
                    className="flex items-center gap-4 p-4 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors"
                  >
                    <MessageCircle size={24} />
                    <div>
                      <div className="font-medium">Discord</div>
                      <div className="text-sm text-muted-foreground">discord.gg/kols3</div>
                    </div>
                  </a>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-8">
                <h2 className="text-xl font-bold mb-4">Response Time</h2>
                <p className="text-muted-foreground">
                  We typically respond within 24-48 hours. For urgent inquiries, 
                  reach out via Telegram for faster response.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
