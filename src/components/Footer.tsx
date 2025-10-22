import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative mt-auto overflow-hidden w-full">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10"></div>
      
      <div className="relative border-t border-border/50 backdrop-blur-sm w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 max-w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
            {/* Brand Section */}
            <div className="text-center sm:text-left space-y-2 sm:space-y-3 px-2">
              <h3 className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent break-words">
                Glow Beauty Emporium
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto sm:mx-0 break-words">
                Your one-stop beauty destination for flawless makeovers and premium services
              </p>
            </div>
            
            {/* Address Section */}
            <div className="text-center sm:text-left space-y-2 sm:space-y-3 px-2">
              <h4 className="text-sm sm:text-base font-semibold text-foreground/90 mb-2 sm:mb-4">Visit Us</h4>
              <div className="flex flex-col gap-2 sm:gap-3 text-xs sm:text-sm">
                <div className="flex items-start justify-center sm:justify-start gap-2 sm:gap-3 text-muted-foreground hover:text-foreground transition-colors group">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-primary group-hover:scale-110 transition-transform flex-shrink-0" />
                  <div className="text-left break-words max-w-[250px]">
                    <p className="break-words">2 St Peters Street</p>
                    <p className="break-words">Huddersfield HD1 1LN</p>
                    <p className="break-words">United Kingdom</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Section */}
            <div className="text-center sm:text-left space-y-2 sm:space-y-3 sm:col-span-2 lg:col-span-1 px-2">
              <h4 className="text-sm sm:text-base font-semibold text-foreground/90 mb-2 sm:mb-4">Contact Us</h4>
              <div className="flex flex-col gap-2 sm:gap-3 text-xs sm:text-sm">
                <a 
                  href="tel:07886221372" 
                  className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 text-muted-foreground hover:text-foreground transition-colors group break-words"
                >
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-accent group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span className="break-words">07886 221372</span>
                </a>
                <a 
                  href="mailto:enquiries@glowbeautyemporium.com" 
                  className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 text-muted-foreground hover:text-foreground transition-colors group break-words"
                >
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-secondary group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span className="break-words max-w-[280px] sm:max-w-none">enquiries@glowbeautyemporium.com</span>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border/30 pt-6 sm:pt-8">
            <p className="text-center text-xs sm:text-sm text-muted-foreground px-4 break-words">
              © 2024 Glow Beauty Emporium. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
