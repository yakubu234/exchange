import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sparkles, Heart, Award, Users, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const AboutUs = () => {
  const highlights = [
    {
      icon: Award,
      title: "Premium Quality",
      description: "Luxury wigs, lash extensions, and beauty accessories",
    },
    {
      icon: Heart,
      title: "Bridal Specialist",
      description: "Expert bridal looks for your special day",
    },
    {
      icon: Sparkles,
      title: "Professional Service",
      description: "Skilled hairstyling, braids, and wig installations",
    },
    {
      icon: Users,
      title: "UK-Based Excellence",
      description: "Trusted beauty brand serving our community",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-muted/30 to-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-background py-12 md:py-16">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Star className="h-10 w-10 md:h-12 md:w-12 text-secondary animate-pulse" />
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  About Us
                </h1>
                <Star className="h-10 w-10 md:h-12 md:w-12 text-secondary animate-pulse" />
              </div>
              <div className="h-1 w-32 bg-gradient-to-r from-transparent via-secondary to-transparent mx-auto"></div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12 md:py-16 -mt-8">
          <div className="max-w-5xl mx-auto">
            {/* Story Section */}
            <div className="mb-16 animate-scale-in">
              <Card className="border-2 shadow-2xl bg-gradient-to-br from-card via-card to-muted/20">
                <CardContent className="p-8 md:p-12">
                  <div className="flex items-center justify-center mb-6">
                    <Sparkles className="h-8 w-8 text-secondary mr-3" />
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                      Our Story
                    </h2>
                  </div>
                  <p className="text-lg md:text-xl text-foreground/90 leading-relaxed text-center mb-6">
                    Glow Beauty Emporium is a UK-based beauty brand offering makeup, hairstyling, and premium wig services. 
                    We specialise in bridal looks, braids, wig installations, and the sale of luxury wigs, lash extensions, 
                    and beauty accessories — all crafted to enhance confidence and style.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-secondary">
                    <div className="h-px w-12 bg-secondary"></div>
                    <Heart className="h-5 w-5 fill-secondary" />
                    <div className="h-px w-12 bg-secondary"></div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Highlights Grid */}
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
                What We Offer
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {highlights.map((item, index) => (
                  <Card 
                    key={index}
                    className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-secondary/50 animate-fade-in bg-gradient-to-br from-card to-muted/10"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6 md:p-8">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 p-3 rounded-lg bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
                          <item.icon className="h-7 w-7 text-secondary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-secondary transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-foreground/80 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center animate-fade-in">
              <Card className="border-2 border-secondary/30 shadow-xl bg-gradient-to-br from-secondary/5 to-primary/5">
                <CardContent className="p-8 md:p-12">
                  <Sparkles className="h-12 w-12 text-secondary mx-auto mb-4" />
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                    Ready to Enhance Your Beauty?
                  </h3>
                  <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
                    Visit us today and discover how we can help you look and feel your absolute best.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;
