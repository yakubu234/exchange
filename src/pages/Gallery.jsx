import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getGalleryItems } from "@/components/GalleryAdmin";

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);

  useEffect(() => {
    setGalleryItems(getGalleryItems());
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gradient-to-b from-background via-primary/5 to-background">
        <div className="container mx-auto px-4 py-12">
          {/* Page Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Our Gallery
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our portfolio of stunning transformations and beauty creations
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {galleryItems.map((item, index) => (
              <Card 
                key={item.id} 
                className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 border-border/50"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden aspect-square">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm">
                      {item.category}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-5 space-y-3">
                  <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground italic">
                    Client: {item.client}
                  </p>
                  
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16 p-8 rounded-lg bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 border border-border/50">
            <h2 className="text-2xl font-bold mb-3 text-foreground">
              Ready for Your Transformation?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Book your appointment today and let us create your perfect look
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/book-services" 
                className="inline-block px-8 py-3 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white rounded-md font-semibold transition-all hover:scale-105 shadow-lg"
              >
                Book Services
              </a>
              <a 
                href="/shop-products" 
                className="inline-block px-8 py-3 bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 text-foreground rounded-md font-semibold transition-all hover:scale-105 shadow-lg"
              >
                Shop Products
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Gallery;
