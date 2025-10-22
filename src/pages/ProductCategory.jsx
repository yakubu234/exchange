import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart } from "lucide-react";

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

const ProductCategory = () => {
  const { category } = useParams();
  const { addToCart } = useCart();
  
  const categoryNames = {
    "human-hair-extension": "Human Hair Extension - Hair Kiki",
    "braided-wigs": "Braided Wigs",
    "ready-to-wear": "Ready to Wear",
    "beauty-accessories": "Beauty Accessories",
  };

  // Braided wigs products with real images
  const braidedWigsProducts = [
    { id: "braided-wigs-1", name: "Dreadlocks Braid Wig", price: 129.99, image: dreadlocksBraid },
    { id: "braided-wigs-2", name: "Knotless Braid Wig", price: 149.99, image: knotlessBraid },
    { id: "braided-wigs-3", name: "Box Twist Braid Wig", price: 139.99, image: boxTwistBraid },
    { id: "braided-wigs-4", name: "Weave Braid Wig", price: 159.99, image: weaveBraid },
    { id: "braided-wigs-5", name: "Boho Knotless Braid Wig", price: 169.99, image: bohoKnotlessBraid },
    { id: "braided-wigs-6", name: "Knotless Twist Wig", price: 154.99, image: knotlessTwist },
    { id: "braided-wigs-7", name: "Ombré Braid Wig", price: 174.99, image: ombreBraid },
    { id: "braided-wigs-8", name: "Boho Twist Braid Wig", price: 164.99, image: bohoTwistBraid },
    { id: "braided-wigs-9", name: "Twist Braid Wig", price: 144.99, image: twistBraid },
    { id: "braided-wigs-10", name: "Box Braid Wig", price: 134.99, image: boxBraid },
  ];

  // Human hair extension products with real images and prices
  const humanHairProducts = [
    { id: "human-hair-1", name: "Vietnamese SDD Raw Wavy (300g) + 5x5 Closure", price: 450.00, image: vietnameseSDD5x5 },
    { id: "human-hair-2", name: "Vietnamese Double Donor Raw Wavy (250g) + 6x6 Closure", price: 500.00, image: vietnameseDoubleDonor6x6 },
    { id: "human-hair-3", name: "Vietnamese Bone Straight Unit (300g)", price: 480.00, image: vietnameseBoneStraight },
    { id: "human-hair-4", name: "Vietnamese Single Donor Raw Wavy (300g) + 5x5 Closure", price: 350.00, image: vietnameseSingleDonor5x5 },
    { id: "human-hair-5", name: "SDD Raw Unit + 6x6 Closure", price: 400.00, image: sddRawUnit6x6 },
    { id: "human-hair-6", name: "Frontal Vietnamese Single Donor Raw Wavy (300g)", price: 450.00, image: frontalVietnameseSingleDonor },
    { id: "human-hair-7", name: "Frontal Raw Wavy (300g) Unit", price: 400.00, image: frontalRawWavy },
    { id: "human-hair-8", name: "Vietnamese Single Donor Raw Wavy (300g) + 6x6 Closure", price: 450.00, image: vietnameseSingleDonor6x6 },
  ];

  // Mock products for other categories
  const defaultProducts = Array.from({ length: 8 }, (_, i) => ({
    id: `${category}-${i + 1}`,
    name: `${categoryNames[category || '']} ${i + 1}`,
    price: parseFloat((Math.random() * 200 + 50).toFixed(2)),
    image: `https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&h=400&fit=crop`,
    category: categoryNames[category || ''],
  }));

  // Select products based on category
  const products = category === "braided-wigs" 
    ? braidedWigsProducts.map(p => ({ ...p, category: categoryNames[category] }))
    : category === "human-hair-extension"
    ? humanHairProducts.map(p => ({ ...p, category: categoryNames[category] }))
    : defaultProducts;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-muted/30 to-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            {categoryNames[category || '']}
          </h1>
          <p className="text-lg text-muted-foreground">
            Browse our premium collection
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 animate-scale-in overflow-hidden">
              <CardHeader className="p-0">
                <div className="aspect-square overflow-hidden bg-muted">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
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
      </main>

      <Footer />
    </div>
  );
};

export default ProductCategory;
