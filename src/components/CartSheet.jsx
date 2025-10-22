import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

const CartSheet = ({ open, onOpenChange }) => {
  const {
    cartItems,
    savedItems,
    removeFromCart,
    updateQuantity,
    saveForLater,
    moveToCart,
    getTotalPrice,
  } = useCart();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart ({cartItems.length})
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mb-4">
                Add items to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      £{item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => saveForLater(item.id)}
                      >
                        Save for Later
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs text-destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                  <div className="font-semibold">
                    £{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {savedItems.length > 0 && (
            <>
              <Separator className="my-6" />
              <div>
                <h3 className="font-semibold mb-4">Saved for Later</h3>
                <div className="space-y-4">
                  {savedItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 border rounded-lg bg-muted/30">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          £{item.price.toFixed(2)}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8"
                          onClick={() => moveToCart(item.id)}
                        >
                          Move to Cart
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </ScrollArea>

        {cartItems.length > 0 && (
          <SheetFooter className="flex-col gap-4 -mx-6 px-6 pt-4 border-t">
            <div className="flex justify-between items-center w-full">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold">
                £{getTotalPrice().toFixed(2)}
              </span>
            </div>
            <Link to="/checkout" className="w-full" onClick={() => onOpenChange(false)}>
              <Button className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary via-accent to-primary hover:from-primary/90 hover:via-accent/90 hover:to-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in hover:scale-105">
                Proceed to Checkout
              </Button>
            </Link>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
