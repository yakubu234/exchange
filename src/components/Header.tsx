import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";
import { Phone, Mail, MapPin, User, LogOut, Menu } from "lucide-react";
import CartIcon from "@/components/CartIcon";
import CartSheet from "@/components/CartSheet";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Header = () => {
  const location = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;
  
  const firstName = user?.name.split(' ')[0];
  
  return (
    <>
      <div className="bg-primary text-primary-foreground py-2 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row justify-center items-center gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>2 St Peters Street, Huddersfield HD1 1LN</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <a href="tel:07886221372" className="hover:underline">07886221372</a>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <a href="mailto:enquiries@glowbeautyemporium.com" className="hover:underline">enquiries@glowbeautyemporium.com</a>
          </div>
        </div>
      </div>
      <header className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 transition-transform hover:scale-105">
            <img src={logo} alt="Glow Beauty Emporium" className="h-12 w-12 object-contain" />
            <span className="text-xl font-bold text-foreground hidden sm:inline">
              Glow Beauty Emporium
            </span>
          </Link>
          
          <div className="flex items-center gap-4">
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex gap-6">
              <Link 
                to="/" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/') ? 'text-primary' : 'text-foreground/80'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/shop-products" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/shop-products') ? 'text-primary' : 'text-foreground/80'
                }`}
              >
                Shop Products
              </Link>
              <Link 
                to="/book-services" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/book-services') ? 'text-primary' : 'text-foreground/80'
                }`}
              >
                Book Services
              </Link>
              <Link 
                to="/gallery" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/gallery') ? 'text-primary' : 'text-foreground/80'
                }`}
              >
                Gallery
              </Link>
              <Link 
                to="/about" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/about') ? 'text-primary' : 'text-foreground/80'
                }`}
              >
                About Us
              </Link>
            </nav>
            
            <div className="flex items-center gap-3">
              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px]">
                  <nav className="flex flex-col gap-4 mt-8">
                    <Link 
                      to="/" 
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-base font-medium transition-colors hover:text-primary ${
                        isActive('/') ? 'text-primary' : 'text-foreground/80'
                      }`}
                    >
                      Home
                    </Link>
                    <Link 
                      to="/shop-products" 
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-base font-medium transition-colors hover:text-primary ${
                        isActive('/shop-products') ? 'text-primary' : 'text-foreground/80'
                      }`}
                    >
                      Shop Products
                    </Link>
                    <Link 
                      to="/book-services" 
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-base font-medium transition-colors hover:text-primary ${
                        isActive('/book-services') ? 'text-primary' : 'text-foreground/80'
                      }`}
                    >
                      Book Services
                    </Link>
                    <Link 
                      to="/gallery" 
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-base font-medium transition-colors hover:text-primary ${
                        isActive('/gallery') ? 'text-primary' : 'text-foreground/80'
                      }`}
                    >
                      Gallery
                    </Link>
                    <Link 
                      to="/about" 
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-base font-medium transition-colors hover:text-primary ${
                        isActive('/about') ? 'text-primary' : 'text-foreground/80'
                      }`}
                    >
                      About Us
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
              
              <CartIcon onClick={() => setCartOpen(true)} />
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <User className="h-4 w-4" />
                      {firstName}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin">Admin Dashboard</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">My Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/orders">My Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild size="sm">
                  <Link to="/login">Login</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
    <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
};

export default Header;
