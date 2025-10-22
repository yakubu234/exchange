import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Trash2, Plus, Upload, Pencil } from "lucide-react";

const STORAGE_KEY = "gallery_items";

export const getGalleryItems = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Initial gallery items
  const initialItems = [
    {
      id: 1,
      title: "Bridal Makeup & Styling",
      client: "Sarah M.",
      description: "Complete bridal makeover with natural glam look and elegant updo for a summer wedding.",
      image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80",
      category: "Bridal"
    },
    {
      id: 2,
      title: "Party Glam Makeup",
      client: "Jessica L.",
      description: "Bold smokey eyes with glossy lips for a birthday celebration.",
      image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=80",
      category: "Party"
    },
    {
      id: 3,
      title: "Natural Everyday Look",
      client: "Emma K.",
      description: "Fresh, dewy makeup with soft waves for a photoshoot.",
      image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80",
      category: "Natural"
    },
    {
      id: 4,
      title: "Luxury Wig Installation",
      client: "Michelle D.",
      description: "Premium lace front wig installation with seamless hairline.",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
      category: "Wigs"
    },
    {
      id: 5,
      title: "Braided Updo Style",
      client: "Aisha T.",
      description: "Intricate braided updo perfect for special occasions.",
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
      category: "Hairstyling"
    },
    {
      id: 6,
      title: "Evening Glam Transformation",
      client: "Rachel P.",
      description: "Full glam makeup with dramatic lashes and sleek hairstyle.",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
      category: "Evening"
    }
  ];
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialItems));
  return initialItems;
};

const saveGalleryItems = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const GalleryAdmin = () => {
  const [galleryItems, setGalleryItems] = useState(getGalleryItems());
  const [newItem, setNewItem] = useState({
    title: "",
    client: "",
    description: "",
    image: "",
    category: ""
  });
  const [editingItem, setEditingItem] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem({ ...newItem, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = () => {
    if (!newItem.title || !newItem.client || !newItem.description || !newItem.image || !newItem.category) {
      toast.error("Please fill in all fields");
      return;
    }

    const newGalleryItem = {
      id: Date.now(),
      ...newItem
    };

    const updatedItems = [...galleryItems, newGalleryItem];
    setGalleryItems(updatedItems);
    saveGalleryItems(updatedItems);

    setNewItem({
      title: "",
      client: "",
      description: "",
      image: "",
      category: ""
    });

    toast.success("Gallery item added successfully!");
  };

  const handleDeleteItem = (id) => {
    const updatedItems = galleryItems.filter(item => item.id !== id);
    setGalleryItems(updatedItems);
    saveGalleryItems(updatedItems);
    toast.success("Gallery item deleted successfully!");
  };

  const handleEditItem = (item) => {
    setEditingItem({ ...item });
    setIsEditDialogOpen(true);
  };

  const handleUpdateItem = () => {
    if (!editingItem || !editingItem.title || !editingItem.client || !editingItem.description || !editingItem.image || !editingItem.category) {
      toast.error("Please fill in all fields");
      return;
    }

    const updatedItems = galleryItems.map(item => 
      item.id === editingItem.id ? editingItem : item
    );
    setGalleryItems(updatedItems);
    saveGalleryItems(updatedItems);
    setIsEditDialogOpen(false);
    setEditingItem(null);
    toast.success("Gallery item updated successfully!");
  };

  const handleEditImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && editingItem) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingItem({ ...editingItem, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload New Item */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload New Gallery Item
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Name/Title</Label>
              <Input
                id="title"
                placeholder="e.g., Bridal Hair & Makeup"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Tag/Category</Label>
              <Input
                id="category"
                placeholder="e.g., Bridal, Party, Wigs"
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="client">Client Name</Label>
              <Input
                id="client"
                placeholder="e.g., Sarah M."
                value={newItem.client}
                onChange={(e) => setNewItem({ ...newItem, client: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Short details about this transformation..."
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              rows={3}
            />
          </div>

          {newItem.image && (
            <div className="space-y-2">
              <Label>Image Preview</Label>
              <img 
                src={newItem.image} 
                alt="Preview" 
                className="w-full max-w-xs h-48 object-cover rounded-md"
              />
            </div>
          )}

          <Button onClick={handleAddItem} className="w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Gallery Item
          </Button>
        </CardContent>
      </Card>

      {/* Gallery Items List */}
      <Card>
        <CardHeader>
          <CardTitle>Gallery Items ({galleryItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="relative aspect-square">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Badge className="bg-primary/90 backdrop-blur-sm">
                      {item.category}
                    </Badge>
                  </div>
                  <div className="absolute bottom-2 right-2 flex gap-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => handleEditItem(item)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4 space-y-2">
                  <h3 className="font-bold text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground italic">
                    Client: {item.client}
                  </p>
                  <p className="text-xs text-foreground/80 line-clamp-2">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Gallery Item</DialogTitle>
            <DialogDescription>
              Update the details for this gallery item
            </DialogDescription>
          </DialogHeader>
          
          {editingItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Name/Title</Label>
                  <Input
                    id="edit-title"
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-category">Tag/Category</Label>
                  <Input
                    id="edit-category"
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-client">Client Name</Label>
                  <Input
                    id="edit-client"
                    value={editingItem.client}
                    onChange={(e) => setEditingItem({ ...editingItem, client: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-image">Update Image</Label>
                  <Input
                    id="edit-image"
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageUpload}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Current Image</Label>
                <img 
                  src={editingItem.image} 
                  alt="Preview" 
                  className="w-full max-w-xs h-48 object-cover rounded-md"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateItem}>
                  Update Gallery Item
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GalleryAdmin;
