import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Search, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";

// Import braided wig images
import dreadlocksBraid from "@/assets/braided-wigs/dreadlocks-braid.jpeg";
import knotlessBraid from "@/assets/braided-wigs/knotless-braid.jpeg";
import boxTwistBraid from "@/assets/braided-wigs/box-twist-braid.jpeg";
import weaveBraid from "@/assets/braided-wigs/weave-braid.jpeg";
import bohoKnotlessBraid from "@/assets/braided-wigs/boho-knotless-braid.jpeg";
import knotlessTwist from "@/assets/braided-wigs/knotless-twist.jpeg";
import ombreBraid from "@/assets/braided-wigs/ombre-braid.jpeg";
import bohoTwistBraid from "@/assets/braided-wigs/boho-twist-braid.jpeg";
import twistBraid from "@/assets/braided-wigs/twist-braid.jpeg";
import boxBraid from "@/assets/braided-wigs/box-braid.jpeg";

// Import human hair extension images
import vietnameseSDD5x5 from "@/assets/human-hair/vietnamese-sdd-raw-wavy-300g-5x5.jpeg";
import vietnameseDoubleDonor6x6 from "@/assets/human-hair/vietnamese-double-donor-raw-wavy-250g-6x6.jpeg";
import vietnameseBoneStraight from "@/assets/human-hair/vietnamese-bone-straight-unit-300g.jpeg";
import vietnameseSingleDonor5x5 from "@/assets/human-hair/vietnamese-single-donor-raw-wavy-300g-5x5.jpeg";
import sddRawUnit6x6 from "@/assets/human-hair/sdd-raw-unit-6x6.jpeg";
import frontalVietnameseSingleDonor from "@/assets/human-hair/frontal-vietnamese-single-donor-raw-wavy-300g.jpeg";
import frontalRawWavy from "@/assets/human-hair/frontal-raw-wavy-300g-unit.jpeg";
import vietnameseSingleDonor6x6 from "@/assets/human-hair/vietnamese-single-donor-raw-wavy-300g-6x6.jpeg";

const Shop = () => {
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 600]);
  const [sortBy, setSortBy] = useState("featured");

  // All products combined
  const allProducts = [
    // Braided Wigs
    { id: "braided-wigs-1", name: "Dreadlocks Braid Wig", price: 129.99, image: dreadlocksBraid, category: "Braided Wigs" },
    { id: "braided-wigs-2", name: "Knotless Braid Wig", price: 149.99, image: knotlessBraid, category: "Braided Wigs" },
    { id: "braided-wigs-3", name: "Box Twist Braid Wig", price: 139.99, image: boxTwistBraid, category: "Braided Wigs" },
    { id: "braided-wigs-4", name: "Weave Braid Wig", price: 159.99, image: weaveBraid, category: "Braided Wigs" },
    { id: "braided-wigs-5", name: "Boho Knotless Braid Wig", price: 169.99, image: bohoKnotlessBraid, category: "Braided Wigs" },
    { id: "braided-wigs-6", name: "Knotless Twist Wig", price: 154.99, image: knotlessTwist, category: "Braided Wigs" },
    { id: "braided-wigs-7", name: "Ombré Braid Wig", price: 174.99, image: ombreBraid, category: "Braided Wigs" },
    { id: "braided-wigs-8", name: "Boho Twist Braid Wig", price: 164.99, image: bohoTwistBraid, category: "Braided Wigs" },
    { id: "braided-wigs-9", name: "Twist Braid Wig", price: 144.99, image: twistBraid, category: "Braided Wigs" },
    { id: "braided-wigs-10", name: "Box Braid Wig", price: 134.99, image: boxBraid, category: "Braided Wigs" },
    
    // Human Hair Extensions
    { id: "human-hair-1", name: "Vietnamese SDD Raw Wavy (300g) + 5x5 Closure", price: 450.00, image: vietnameseSDD5x5, category: "Human Hair Extension" },
    { id: "human-hair-2", name: "Vietnamese Double Donor Raw Wavy (250g) + 6x6 Closure", price: 500.00, image: vietnameseDoubleDonor6x6, category: "Human Hair Extension" },
    { id: "human-hair-3", name: "Vietnamese Bone Straight Unit (300g)", price: 480.00, image: vietnameseBoneStraight, category: "Human Hair Extension" },
    { id: "human-hair-4", name: "Vietnamese Single Donor Raw Wavy (300g) + 5x5 Closure", price: 350.00, image: vietnameseSingleDonor5x5, category: "Human Hair Extension" },
    { id: "human-hair-5", name: "SDD Raw Unit + 6x6 Closure", price: 400.00, image: sddRawUnit6x6, category: "Human Hair Extension" },
    { id: "human-hair-6", name: "Frontal Vietnamese Single Donor Raw Wavy (300g)", price: 450.00, image: frontalVietnameseSingleDonor, category: "Human Hair Extension" },
    { id: "human-hair-7", name: "Frontal Raw Wavy (300g) Unit", price: 400.00, image: frontalRawWavy, category: "Human Hair Extension" },
    { id: "human-hair-8", name: "Vietnamese Single Donor Raw Wavy (300g) + 6x6 Closure", price: 450.00, image: vietnameseSingleDonor6x6, category: "Human Hair Extension" },
  ];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by price range
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort products
    if (sortBy === "price-low") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [searchQuery, selectedCategory, priceRange, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-muted/30 to-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Shop All Products
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our complete collection of premium hair products
          </p>
        </div>

        {/* Filters Section */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Braided Wigs">Braided Wigs</SelectItem>
                <SelectItem value="Human Hair Extension">Human Hair Extension</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name: A to Z</SelectItem>
              </SelectContent>
            </Select>

            {/* Price Range Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Price: £{priceRange[0]} - £{priceRange[1]}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">Price Range</h4>
                  <Slider
                    min={0}
                    max={600}
                    step={10}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>£{priceRange[0]}</span>
                    <span>£{priceRange[1]}</span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </span>
            {selectedCategory !== "all" && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCategory("all")}>
                {selectedCategory} ✕
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchQuery("")}>
                Search: "{searchQuery}" ✕
              </Badge>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 animate-scale-in overflow-hidden">
                <CardHeader className="p-0">
                  <div className="aspect-square overflow-hidden bg-muted relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <Badge className="absolute top-2 right-2 bg-background/90 text-foreground">
                      {product.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2 line-clamp-2">{product.name}</CardTitle>
                  <p className="text-2xl font-bold text-primary">£{product.price.toFixed(2)}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button 
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white"
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No products found matching your filters.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setPriceRange([0, 600]);
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
