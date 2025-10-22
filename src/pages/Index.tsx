import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--gradient-hero)' }}>
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          <div className="mb-8 flex justify-center">
            <img 
              src={logo} 
              alt="Glow Beauty Emporium" 
              className="h-32 w-32 object-contain animate-scale-in"
            />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
            Welcome to
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Glow Beauty Emporium
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-4 text-foreground/80 font-light max-w-3xl mx-auto">
            Your one-stop beauty destination for flawless makeovers, professional hairstyling, luxury wigs, and a range of premium beauty services.
          </p>
          
          <p className="text-2xl md:text-3xl mb-12 text-foreground/80 font-semibold">
            What would you like to do?
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/shop-products" className="w-full sm:w-auto">
              <Button 
                size="lg"
                className="w-full sm:w-64 h-16 text-lg font-semibold bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Shop Products
              </Button>
            </Link>
            
            <Link to="/book-services" className="w-full sm:w-auto">
              <Button 
                size="lg"
                className="w-full sm:w-64 h-16 text-lg font-semibold bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 text-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Book Services
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
