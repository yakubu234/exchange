import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Scissors, Star } from "lucide-react";
import { getBookingServices, getServiceCategories } from "@/components/ServicesAdmin";

const BookServices = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setServices(getBookingServices());
    setCategories(getServiceCategories());
  }, []);

  const getServicesByCategory = (categoryId) => {
    return services.filter(s => s.category === categoryId);
  };

  const getCategoryIcon = (iconName) => {
    const icons = {
      Sparkles,
      Scissors,
      Star,
    };
    return icons[iconName] || Star;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-muted/30 to-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent">
            Book Our Services
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from our range of professional beauty services
          </p>
        </div>

        <div className="space-y-12">
          {categories.map((category) => {
            const categoryServices = getServicesByCategory(category.id);
            const IconComponent = getCategoryIcon(category.icon);
            
            if (categoryServices.length === 0) return null;
            
            return (
              <section key={category.id}>
                <h2 className="text-3xl font-bold mb-6 text-foreground flex items-center gap-2">
                  <IconComponent className="h-8 w-8 text-accent" />
                  {category.name}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {categoryServices.map((service) => (
                    <Card key={service.path} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-accent/50 animate-scale-in">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <CardTitle className="text-xl">{service.title}</CardTitle>
                            <CardDescription>{service.description}</CardDescription>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">£{service.price}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Link to={service.path}>
                          <Button className="w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white font-semibold">
                            Book Now
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookServices;
