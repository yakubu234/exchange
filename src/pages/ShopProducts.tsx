import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Package } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ShopProducts = () => {
  const hairProducts = [
    {
      title: "Human Hair Extension",
      description: "Premium quality human hair extensions - Hair Kiki collection",
      path: "/shop/human-hair-extension",
      icon: Sparkles,
    },
    {
      title: "Braided Wigs",
      description: "Beautiful pre-styled braided wigs for every occasion",
      path: "/shop/braided-wigs",
      icon: Sparkles,
    },
  ];

  const otherProducts = [
    {
      title: "Ready to Wear",
      description: "Convenient ready-to-wear hair solutions",
      path: "/shop/ready-to-wear",
      icon: Package,
      comingSoon: true,
    },
    {
      title: "Beauty Accessories",
      description: "Essential beauty tools and accessories",
      path: "/shop/beauty-accessories",
      icon: Package,
      comingSoon: true,
    },
  ];

  const handleComingSoonClick = (productTitle: string) => {
    toast({
      title: "Coming Soon!",
      description: `${productTitle} will be available soon. Stay tuned!`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-muted/30 to-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Shop Our Products
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our premium collection of hair products and beauty accessories
          </p>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-3xl font-bold mb-6 text-foreground flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-primary" />
              Hair Products
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {hairProducts.map((product) => (
                <Card key={product.path} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 animate-scale-in">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <product.icon className="h-6 w-6 text-primary" />
                      <CardTitle className="text-2xl">{product.title}</CardTitle>
                    </div>
                    <CardDescription className="text-base">{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                  <Link to="/shop">
                      <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold">
                        Browse Collection
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 text-foreground flex items-center gap-2">
              <Package className="h-8 w-8 text-secondary" />
              Other Products
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {otherProducts.map((product) => (
                <Card 
                  key={product.path} 
                  className={`group hover:shadow-xl transition-all duration-300 border-2 hover:border-secondary/50 animate-scale-in ${
                    product.comingSoon ? 'opacity-60' : ''
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <product.icon className="h-6 w-6 text-secondary" />
                        <CardTitle className="text-2xl">{product.title}</CardTitle>
                      </div>
                      {product.comingSoon && (
                        <Badge variant="secondary" className="bg-muted text-muted-foreground">
                          Coming Soon
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-base">{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {product.comingSoon ? (
                      <Button 
                        onClick={() => handleComingSoonClick(product.title)}
                        className="w-full bg-gradient-to-r from-secondary/50 to-secondary/40 hover:from-secondary/60 hover:to-secondary/50 text-foreground font-semibold cursor-not-allowed"
                      >
                        Coming Soon
                      </Button>
                    ) : (
                      <Link to={product.path}>
                        <Button className="w-full bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 text-white font-semibold">
                          Browse Collection
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ShopProducts;
