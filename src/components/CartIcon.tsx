import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";

interface CartIconProps {
  onClick: () => void;
}

const CartIcon = ({ onClick }: CartIconProps) => {
  const { getTotalItems } = useCart();
  const itemCount = getTotalItems();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={onClick}
      aria-label="Shopping cart"
    >
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
        >
          {itemCount}
        </Badge>
      )}
    </Button>
  );
};

export default CartIcon;
