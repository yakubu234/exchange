import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Trash2, Plus, Pencil } from "lucide-react";

const STORAGE_KEY = "booking_services";
const CATEGORIES_KEY = "service_categories";

export const getServiceCategories = () => {
  const stored = localStorage.getItem(CATEGORIES_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  const initialCategories = [
    { id: "makeup", name: "Make-up Services", icon: "Sparkles" },
    { id: "hair", name: "Hair Styling Services", icon: "Scissors" },
  ];
  
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(initialCategories));
  return initialCategories;
};

const saveServiceCategories = (categories) => {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
};

export const getBookingServices = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Initial default services with updated prices
  const initialServices = [
    {
      id: "bridal-makeup",
      title: "Bridal Makeup",
      description: "Look stunning on your special day",
      category: "makeup",
      path: "/book/bridal-makeup",
      price: 200,
    },
    {
      id: "party-makeup",
      title: "Party Makeup",
      description: "Glamorous looks for any celebration",
      category: "makeup",
      path: "/book/party-makeup",
      price: 100,
    },
    {
      id: "graduation-makeup",
      title: "Graduation Makeup",
      description: "Beautiful looks for your milestone",
      category: "makeup",
      path: "/book/graduation-makeup",
      price: 100,
    },
    {
      id: "photoshoot-glam",
      title: "Photo Shoot Glam",
      description: "Camera-ready makeup for your shoot",
      category: "makeup",
      path: "/book/photoshoot-glam",
      price: 100,
    },
    {
      id: "bridal-hairstyling",
      title: "Bridal Hairstyling",
      description: "Elegant bridal hair designs",
      category: "hair",
      path: "/book/bridal-hairstyling",
      price: 200,
    },
    {
      id: "wig-installation",
      title: "Wig Installation",
      description: "Professional wig installation service",
      category: "hair",
      path: "/book/wig-installation",
      price: 100,
    },
  ];
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialServices));
  return initialServices;
};

const saveBookingServices = (services) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
};

const ServicesAdmin = () => {
  const [services, setServices] = useState(getBookingServices());
  const [categories, setCategories] = useState(getServiceCategories());
  const [newService, setNewService] = useState({
    title: "",
    description: "",
    category: "",
    price: 0,
  });
  const [newCategory, setNewCategory] = useState({
    name: "",
    icon: "Star",
  });
  const [editingService, setEditingService] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  const generatePath = (title) => {
    return `/book/${title.toLowerCase().replace(/\s+/g, '-')}`;
  };

  const generateId = (title) => {
    return title.toLowerCase().replace(/\s+/g, '-');
  };

  const handleAddCategory = () => {
    if (!newCategory.name) {
      toast.error("Please enter a category name");
      return;
    }

    const categoryId = generateId(newCategory.name);
    const newCategoryItem = {
      id: categoryId,
      name: newCategory.name,
      icon: newCategory.icon,
    };

    const updatedCategories = [...categories, newCategoryItem];
    setCategories(updatedCategories);
    saveServiceCategories(updatedCategories);

    setNewCategory({ name: "", icon: "Star" });
    setShowCategoryForm(false);
    toast.success("Category added successfully!");
  };

  const handleDeleteCategory = (categoryId) => {
    // Check if any services use this category
    const servicesInCategory = services.filter(s => s.category === categoryId);
    if (servicesInCategory.length > 0) {
      toast.error(`Cannot delete category with ${servicesInCategory.length} active services`);
      return;
    }

    const updatedCategories = categories.filter(cat => cat.id !== categoryId);
    setCategories(updatedCategories);
    saveServiceCategories(updatedCategories);
    toast.success("Category deleted successfully!");
  };

  const handleAddService = () => {
    if (!newService.title || !newService.description || !newService.category || !newService.price) {
      toast.error("Please fill in all fields");
      return;
    }

    const newBookingService = {
      id: generateId(newService.title),
      title: newService.title,
      description: newService.description,
      category: newService.category,
      path: generatePath(newService.title),
      price: Number(newService.price),
    };

    const updatedServices = [...services, newBookingService];
    setServices(updatedServices);
    saveBookingServices(updatedServices);

    setNewService({
      title: "",
      description: "",
      category: "",
      price: 0,
    });

    toast.success("Service added successfully!");
  };

  const handleDeleteService = (id) => {
    const updatedServices = services.filter(service => service.id !== id);
    setServices(updatedServices);
    saveBookingServices(updatedServices);
    toast.success("Service deleted successfully!");
  };

  const handleEditService = (service) => {
    setEditingService({ ...service });
    setIsEditDialogOpen(true);
  };

  const handleUpdateService = () => {
    if (!editingService || !editingService.title || !editingService.description || !editingService.price) {
      toast.error("Please fill in all fields");
      return;
    }

    const updatedServices = services.map(service => 
      service.id === editingService.id ? {
        ...editingService,
        path: generatePath(editingService.title),
      } : service
    );
    setServices(updatedServices);
    saveBookingServices(updatedServices);
    setIsEditDialogOpen(false);
    setEditingService(null);
    toast.success("Service updated successfully!");
  };

  const getServicesByCategory = (categoryId) => {
    return services.filter(s => s.category === categoryId);
  };

  return (
    <div className="space-y-6">
      {/* Category Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Service Categories</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowCategoryForm(!showCategoryForm)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showCategoryForm && (
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardContent className="pt-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="category-name">Category Name</Label>
                    <Input
                      id="category-name"
                      placeholder="e.g., Spa Services"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category-icon">Icon Name (Lucide)</Label>
                    <Input
                      id="category-icon"
                      placeholder="e.g., Star, Heart, Flower"
                      value={newCategory.icon}
                      onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddCategory} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowCategoryForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {categories.map((cat) => (
              <Card key={cat.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-sm">{cat.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {getServicesByCategory(cat.id).length} services
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCategory(cat.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add New Service */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Booking Service
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="service-title">Service Title</Label>
              <Input
                id="service-title"
                placeholder="e.g., Bridal Makeup"
                value={newService.title}
                onChange={(e) => setNewService({ ...newService, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="service-category">Category</Label>
              <Select
                value={newService.category}
                onValueChange={(value) => setNewService({ ...newService, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="service-price">Price (£)</Label>
              <Input
                id="service-price"
                type="number"
                min="0"
                step="1"
                placeholder="e.g., 100"
                value={newService.price || ""}
                onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="service-description">Description</Label>
            <Textarea
              id="service-description"
              placeholder="Brief description of the service..."
              value={newService.description}
              onChange={(e) => setNewService({ ...newService, description: e.target.value })}
              rows={2}
            />
          </div>

          <Button onClick={handleAddService} className="w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </Button>
        </CardContent>
      </Card>

      {/* Services by Category */}
      {categories.map((category) => {
        const categoryServices = getServicesByCategory(category.id);
        
        return (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle>{category.name} ({categoryServices.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {categoryServices.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No services in this category yet. Add your first service above.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryServices.map((service) => (
                    <Card key={service.id} className="relative">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h3 className="font-bold text-sm mb-1">{service.title}</h3>
                            <p className="text-xs text-muted-foreground">{service.description}</p>
                            <p className="text-lg font-bold text-primary mt-2">£{service.price}</p>
                          </div>
                          <Badge variant="secondary" className="shrink-0">
                            {categories.find(c => c.id === service.category)?.name}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleEditService(service)}
                          >
                            <Pencil className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleDeleteService(service.id)}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>
              Update the details for this booking service
            </DialogDescription>
          </DialogHeader>
          
          {editingService && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Service Title</Label>
                  <Input
                    id="edit-title"
                    value={editingService.title}
                    onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={editingService.category}
                    onValueChange={(value) => setEditingService({ ...editingService, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-price">Price (£)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    min="0"
                    step="1"
                    value={editingService.price || ""}
                    onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateService}>
                  Update Service
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServicesAdmin;
