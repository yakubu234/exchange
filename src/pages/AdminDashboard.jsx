import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Trash2, Plus, Search, CalendarIcon, Package, CreditCard, User, Clock, Eye, Download, Mail, ExternalLink, TrendingUp, DollarSign, ShoppingCart, Edit, Settings } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import GalleryAdmin from "@/components/GalleryAdmin";
import ServicesAdmin from "@/components/ServicesAdmin";
import BookingsAdmin from "@/components/BookingsAdmin";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Initial products data (defined outside component for stable reference)
const INITIAL_PRODUCTS = [
  { 
    id: "braided-wigs-1", 
    name: "Dreadlocks Braid Wig", 
    price: 129.99, 
    image: "/src/assets/braided-wigs/dreadlocks-braid.jpeg", 
    category: "Braided Wigs",
    stock: 45,
    inventoryHistory: [
      { id: "inv-1", date: new Date("2025-09-15T10:30:00").toISOString(), addedBy: "admin@shop.com", unitsAdded: 20, totalAfter: 20 },
      { id: "inv-2", date: new Date("2025-09-22T14:15:00").toISOString(), addedBy: "admin@shop.com", unitsAdded: 15, totalAfter: 35 },
      { id: "inv-3", date: new Date("2025-10-05T09:00:00").toISOString(), addedBy: "manager@shop.com", unitsAdded: 10, totalAfter: 45 }
    ]
  },
  { 
    id: "braided-wigs-2", 
    name: "Knotless Braid Wig", 
    price: 149.99, 
    image: "/src/assets/braided-wigs/knotless-braid.jpeg", 
    category: "Braided Wigs",
    stock: 32,
    inventoryHistory: [
      { id: "inv-4", date: new Date("2025-08-20T11:00:00").toISOString(), addedBy: "admin@shop.com", unitsAdded: 25, totalAfter: 25 },
      { id: "inv-5", date: new Date("2025-09-10T16:45:00").toISOString(), addedBy: "admin@shop.com", unitsAdded: 12, totalAfter: 37 },
      { id: "inv-6", date: new Date("2025-09-28T13:20:00").toISOString(), addedBy: "manager@shop.com", unitsAdded: 8, totalAfter: 45 },
      { id: "inv-7", date: new Date("2025-10-12T10:30:00").toISOString(), addedBy: "admin@shop.com", unitsAdded: 7, totalAfter: 52 },
      { id: "inv-8", date: new Date("2025-10-15T14:00:00").toISOString(), addedBy: "staff@shop.com", unitsAdded: 5, totalAfter: 57 }
    ]
  },
  { 
    id: "braided-wigs-3", 
    name: "Box Twist Braid Wig", 
    price: 139.99, 
    image: "/src/assets/braided-wigs/box-twist-braid.jpeg", 
    category: "Braided Wigs",
    stock: 28,
    inventoryHistory: [
      { id: "inv-9", date: new Date("2025-09-01T09:15:00").toISOString(), addedBy: "admin@shop.com", unitsAdded: 30, totalAfter: 30 },
      { id: "inv-10", date: new Date("2025-09-18T15:30:00").toISOString(), addedBy: "manager@shop.com", unitsAdded: 10, totalAfter: 40 }
    ]
  },
  { id: "braided-wigs-4", name: "Weave Braid Wig", price: 159.99, image: "/src/assets/braided-wigs/weave-braid.jpeg", category: "Braided Wigs", stock: 18 },
  { id: "braided-wigs-5", name: "Boho Knotless Braid Wig", price: 169.99, image: "/src/assets/braided-wigs/boho-knotless-braid.jpeg", category: "Braided Wigs", stock: 22 },
  { id: "braided-wigs-6", name: "Knotless Twist Wig", price: 154.99, image: "/src/assets/braided-wigs/knotless-twist.jpeg", category: "Braided Wigs", stock: 35 },
  { id: "braided-wigs-7", name: "Ombré Braid Wig", price: 174.99, image: "/src/assets/braided-wigs/ombre-braid.jpeg", category: "Braided Wigs", stock: 15 },
  { id: "braided-wigs-8", name: "Boho Twist Braid Wig", price: 164.99, image: "/src/assets/braided-wigs/boho-twist-braid.jpeg", category: "Braided Wigs", stock: 27 },
  { id: "braided-wigs-9", name: "Twist Braid Wig", price: 144.99, image: "/src/assets/braided-wigs/twist-braid.jpeg", category: "Braided Wigs", stock: 40 },
  { id: "braided-wigs-10", name: "Box Braid Wig", price: 134.99, image: "/src/assets/braided-wigs/box-braid.jpeg", category: "Braided Wigs", stock: 33 },
  { id: "human-hair-1", name: "Vietnamese SDD Raw Wavy (300g) + 5x5 Closure", price: 450.00, image: "/src/assets/human-hair/vietnamese-sdd-raw-wavy-300g-5x5.jpeg", category: "Human Hair Extension", stock: 12 },
  { id: "human-hair-2", name: "Vietnamese Double Donor Raw Wavy (250g) + 6x6 Closure", price: 500.00, image: "/src/assets/human-hair/vietnamese-double-donor-raw-wavy-250g-6x6.jpeg", category: "Human Hair Extension", stock: 8 },
  { id: "human-hair-3", name: "Vietnamese Bone Straight Unit (300g)", price: 480.00, image: "/src/assets/human-hair/vietnamese-bone-straight-unit-300g.jpeg", category: "Human Hair Extension", stock: 10 },
  { id: "human-hair-4", name: "Vietnamese Single Donor Raw Wavy (300g) + 5x5 Closure", price: 350.00, image: "/src/assets/human-hair/vietnamese-single-donor-raw-wavy-300g-5x5.jpeg", category: "Human Hair Extension", stock: 14 },
  { id: "human-hair-5", name: "SDD Raw Unit + 6x6 Closure", price: 400.00, image: "/src/assets/human-hair/sdd-raw-unit-6x6.jpeg", category: "Human Hair Extension", stock: 9 },
  { id: "human-hair-6", name: "Frontal Vietnamese Single Donor Raw Wavy (300g)", price: 450.00, image: "/src/assets/human-hair/frontal-vietnamese-single-donor-raw-wavy-300g.jpeg", category: "Human Hair Extension", stock: 11 },
  { id: "human-hair-7", name: "Frontal Raw Wavy (300g) Unit", price: 400.00, image: "/src/assets/human-hair/frontal-raw-wavy-300g-unit.jpeg", category: "Human Hair Extension", stock: 13 },
  { id: "human-hair-8", name: "Vietnamese Single Donor Raw Wavy (300g) + 6x6 Closure", price: 450.00, image: "/src/assets/human-hair/vietnamese-single-donor-raw-wavy-300g-6x6.jpeg", category: "Human Hair Extension", stock: 7 },
];

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // Early return BEFORE any other hooks if user is not authorized
  if (!user || !isAdmin) {
    navigate("/login");
    return null;
  }
  
  const [activeTab, setActiveTab] = useState("bookings");
  
  const [bookings] = useState(() => {
    const stored = localStorage.getItem("bookings");
    if (stored && JSON.parse(stored).length >= 20) {
      return JSON.parse(stored);
    }
    // Dummy data for demonstration - 25 bookings
    const dummyBookings = [
      {
        id: "BK001",
        service: "Hair Styling",
        fullName: "Sarah Johnson",
        email: "sarah.j@email.com",
        phone: "07712345678",
        date: "2025-10-20",
        time: "10:00 AM",
        address: "15 Oak Street, Manchester M1 2AB",
        createdAt: new Date("2025-10-15T09:30:00").toISOString()
      },
      {
        id: "BK002",
        service: "Makeup",
        fullName: "Emma Williams",
        email: "emma.w@email.com",
        phone: "07723456789",
        date: "2025-10-22",
        time: "2:00 PM",
        address: "42 High Street, Leeds LS1 3BX",
        createdAt: new Date("2025-10-15T11:15:00").toISOString()
      },
      {
        id: "BK003",
        service: "Nails",
        fullName: "Lisa Brown",
        email: "lisa.b@email.com",
        phone: "07734567890",
        date: "2025-10-25",
        time: "11:30 AM",
        address: "8 Park Lane, Birmingham B1 4DU",
        createdAt: new Date("2025-10-15T14:20:00").toISOString()
      },
      {
        id: "BK004",
        service: "Spa Treatment",
        fullName: "Rachel Davis",
        email: "rachel.d@email.com",
        phone: "07745678901",
        date: "2025-10-18",
        time: "3:30 PM",
        address: "23 Queen Street, Liverpool L1 5EF",
        createdAt: new Date("2025-10-14T16:45:00").toISOString()
      },
      {
        id: "BK005",
        service: "Hair Styling",
        fullName: "Sophie Taylor",
        email: "sophie.t@email.com",
        phone: "07756789012",
        date: "2025-10-28",
        time: "9:00 AM",
        address: "67 Market Street, Sheffield S1 2GH",
        createdAt: new Date("2025-10-15T10:00:00").toISOString()
      },
      {
        id: "BK006",
        service: "Makeup",
        fullName: "Jessica Miller",
        email: "jessica.m@email.com",
        phone: "07767890123",
        date: "2025-10-21",
        time: "1:00 PM",
        address: "91 Victoria Road, Bristol BS1 6AA",
        createdAt: new Date("2025-10-15T08:00:00").toISOString()
      },
      {
        id: "BK007",
        service: "Nails",
        fullName: "Amy Wilson",
        email: "amy.w@email.com",
        phone: "07778901234",
        date: "2025-10-23",
        time: "4:00 PM",
        address: "34 King Street, Newcastle NE1 3UQ",
        createdAt: new Date("2025-10-14T12:30:00").toISOString()
      },
      {
        id: "BK008",
        service: "Hair Styling",
        fullName: "Olivia Moore",
        email: "olivia.m@email.com",
        phone: "07789012345",
        date: "2025-10-26",
        time: "10:30 AM",
        address: "56 Church Lane, Edinburgh EH1 2LR",
        createdAt: new Date("2025-10-15T15:45:00").toISOString()
      },
      {
        id: "BK009",
        service: "Spa Treatment",
        fullName: "Charlotte Anderson",
        email: "charlotte.a@email.com",
        phone: "07790123456",
        date: "2025-10-19",
        time: "2:30 PM",
        address: "12 Abbey Road, Glasgow G1 1PQ",
        createdAt: new Date("2025-10-13T09:15:00").toISOString()
      },
      {
        id: "BK010",
        service: "Makeup",
        fullName: "Mia Thomas",
        email: "mia.t@email.com",
        phone: "07701234567",
        date: "2025-10-24",
        time: "11:00 AM",
        address: "78 Station Road, Cardiff CF10 1EP",
        createdAt: new Date("2025-10-15T13:00:00").toISOString()
      },
      {
        id: "BK011",
        service: "Nails",
        fullName: "Emily Jackson",
        email: "emily.j@email.com",
        phone: "07712345670",
        date: "2025-10-27",
        time: "3:00 PM",
        address: "45 High Road, Nottingham NG1 5FS",
        createdAt: new Date("2025-10-14T10:20:00").toISOString()
      },
      {
        id: "BK012",
        service: "Hair Styling",
        fullName: "Grace White",
        email: "grace.w@email.com",
        phone: "07723456780",
        date: "2025-10-29",
        time: "9:30 AM",
        address: "23 Park Avenue, Southampton SO14 0AA",
        createdAt: new Date("2025-10-15T11:50:00").toISOString()
      },
      {
        id: "BK013",
        service: "Spa Treatment",
        fullName: "Hannah Green",
        email: "hannah.g@email.com",
        phone: "07734567891",
        date: "2025-10-30",
        time: "1:30 PM",
        address: "88 Bridge Street, York YO1 6AA",
        createdAt: new Date("2025-10-15T16:00:00").toISOString()
      },
      {
        id: "BK014",
        service: "Makeup",
        fullName: "Chloe Harris",
        email: "chloe.h@email.com",
        phone: "07745678902",
        date: "2025-11-01",
        time: "10:00 AM",
        address: "14 Mill Lane, Oxford OX1 1AA",
        createdAt: new Date("2025-10-16T09:00:00").toISOString()
      },
      {
        id: "BK015",
        service: "Nails",
        fullName: "Ella Martin",
        email: "ella.m@email.com",
        phone: "07756789023",
        date: "2025-11-02",
        time: "2:00 PM",
        address: "72 Castle Street, Cambridge CB2 1AG",
        createdAt: new Date("2025-10-16T10:30:00").toISOString()
      },
      {
        id: "BK016",
        service: "Hair Styling",
        fullName: "Lily Thompson",
        email: "lily.t@email.com",
        phone: "07767890134",
        date: "2025-11-03",
        time: "11:00 AM",
        address: "35 West Street, Brighton BN1 2RE",
        createdAt: new Date("2025-10-16T12:00:00").toISOString()
      },
      {
        id: "BK017",
        service: "Spa Treatment",
        fullName: "Isabella Clark",
        email: "isabella.c@email.com",
        phone: "07778901245",
        date: "2025-11-04",
        time: "3:00 PM",
        address: "19 Green Road, Bath BA1 1AA",
        createdAt: new Date("2025-10-16T14:15:00").toISOString()
      },
      {
        id: "BK018",
        service: "Makeup",
        fullName: "Amelia Lewis",
        email: "amelia.l@email.com",
        phone: "07789012356",
        date: "2025-11-05",
        time: "9:00 AM",
        address: "61 North Street, Portsmouth PO1 3AA",
        createdAt: new Date("2025-10-16T15:30:00").toISOString()
      },
      {
        id: "BK019",
        service: "Nails",
        fullName: "Poppy Walker",
        email: "poppy.w@email.com",
        phone: "07790123467",
        date: "2025-11-06",
        time: "1:00 PM",
        address: "28 South Avenue, Leicester LE1 1AA",
        createdAt: new Date("2025-10-16T16:45:00").toISOString()
      },
      {
        id: "BK020",
        service: "Hair Styling",
        fullName: "Freya Hall",
        email: "freya.h@email.com",
        phone: "07701234578",
        date: "2025-11-07",
        time: "10:30 AM",
        address: "53 East Lane, Plymouth PL1 2AA",
        createdAt: new Date("2025-10-17T08:00:00").toISOString()
      },
      {
        id: "BK021",
        service: "Spa Treatment",
        fullName: "Evie Young",
        email: "evie.y@email.com",
        phone: "07712345681",
        date: "2025-11-08",
        time: "2:30 PM",
        address: "40 Chapel Road, Derby DE1 3AA",
        createdAt: new Date("2025-10-17T09:30:00").toISOString()
      },
      {
        id: "BK022",
        service: "Makeup",
        fullName: "Ava King",
        email: "ava.k@email.com",
        phone: "07723456791",
        date: "2025-11-09",
        time: "11:30 AM",
        address: "16 Tower Street, Hull HU1 2AB",
        createdAt: new Date("2025-10-17T11:00:00").toISOString()
      },
      {
        id: "BK023",
        service: "Nails",
        fullName: "Ruby Wright",
        email: "ruby.w@email.com",
        phone: "07734567892",
        date: "2025-11-10",
        time: "4:00 PM",
        address: "84 Bridge Road, Stoke ST1 1AA",
        createdAt: new Date("2025-10-17T13:15:00").toISOString()
      },
      {
        id: "BK024",
        service: "Hair Styling",
        fullName: "Daisy Scott",
        email: "daisy.s@email.com",
        phone: "07745678903",
        date: "2025-11-11",
        time: "9:00 AM",
        address: "27 Valley Lane, Preston PR1 2AA",
        createdAt: new Date("2025-10-17T14:45:00").toISOString()
      },
      {
        id: "BK025",
        service: "Spa Treatment",
        fullName: "Megan Adams",
        email: "megan.a@email.com",
        phone: "07756789024",
        date: "2025-11-12",
        time: "3:30 PM",
        address: "92 Park Street, Wolverhampton WV1 1AA",
        createdAt: new Date("2025-10-17T16:00:00").toISOString()
      }
    ];
    localStorage.setItem("bookings", JSON.stringify(dummyBookings));
    return dummyBookings;
  });
  const [orders, setOrders] = useState(() => {
    const stored = localStorage.getItem("orders");
    if (stored && JSON.parse(stored).length >= 20) {
      return JSON.parse(stored);
    }
    // Dummy data for demonstration - 25 orders
    const dummyOrders = [
      {
        id: "ORD001",
        fullName: "John Smith",
        email: "john.s@email.com",
        phone: "07711111111",
        total: 89.99,
        paymentStatus: "paid",
        items: [{ name: "Premium Hair Care Set", quantity: 1, price: 89.99 }],
        createdAt: new Date("2025-10-15T10:00:00").toISOString()
      },
      {
        id: "ORD002",
        fullName: "Mary Johnson",
        email: "mary.j@email.com",
        phone: "07722222222",
        total: 45.50,
        paymentStatus: "paid",
        items: [{ name: "Nail Polish Set", quantity: 1, price: 45.50 }],
        createdAt: new Date("2025-10-15T11:30:00").toISOString()
      },
      {
        id: "ORD003",
        fullName: "Robert Brown",
        email: "robert.b@email.com",
        phone: "07733333333",
        total: 125.00,
        paymentStatus: "pending",
        items: [{ name: "Spa Gift Package", quantity: 1, price: 125.00 }],
        createdAt: new Date("2025-10-15T13:45:00").toISOString()
      },
      {
        id: "ORD004",
        fullName: "Jennifer Wilson",
        email: "jennifer.w@email.com",
        phone: "07744444444",
        total: 67.80,
        paymentStatus: "paid",
        items: [{ name: "Makeup Brushes Set", quantity: 2, price: 33.90 }],
        createdAt: new Date("2025-10-14T09:00:00").toISOString()
      },
      {
        id: "ORD005",
        fullName: "Michael Davis",
        email: "michael.d@email.com",
        phone: "07755555555",
        total: 199.99,
        paymentStatus: "paid",
        items: [{ name: "Professional Hair Dryer", quantity: 1, price: 199.99 }],
        createdAt: new Date("2025-10-14T14:20:00").toISOString()
      },
      {
        id: "ORD006",
        fullName: "Patricia Taylor",
        email: "patricia.t@email.com",
        phone: "07766666666",
        total: 55.75,
        paymentStatus: "paid",
        items: [{ name: "Face Serum", quantity: 1, price: 55.75 }],
        createdAt: new Date("2025-10-14T16:00:00").toISOString()
      },
      {
        id: "ORD007",
        fullName: "William Moore",
        email: "william.m@email.com",
        phone: "07777777777",
        total: 34.99,
        paymentStatus: "pending",
        items: [{ name: "Hair Gel", quantity: 2, price: 17.50 }],
        createdAt: new Date("2025-10-13T10:30:00").toISOString()
      },
      {
        id: "ORD008",
        fullName: "Linda Anderson",
        email: "linda.a@email.com",
        phone: "07788888888",
        total: 78.50,
        paymentStatus: "paid",
        items: [{ name: "Manicure Set", quantity: 1, price: 78.50 }],
        createdAt: new Date("2025-10-13T12:00:00").toISOString()
      },
      {
        id: "ORD009",
        fullName: "David Thomas",
        email: "david.t@email.com",
        phone: "07799999999",
        total: 145.00,
        paymentStatus: "paid",
        items: [{ name: "Deluxe Spa Set", quantity: 1, price: 145.00 }],
        createdAt: new Date("2025-10-13T15:30:00").toISOString()
      },
      {
        id: "ORD010",
        fullName: "Barbara Jackson",
        email: "barbara.j@email.com",
        phone: "07700000000",
        total: 92.25,
        paymentStatus: "paid",
        items: [{ name: "Eye Shadow Palette", quantity: 1, price: 92.25 }],
        createdAt: new Date("2025-10-12T09:45:00").toISOString()
      },
      {
        id: "ORD011",
        fullName: "James White",
        email: "james.w@email.com",
        phone: "07711122233",
        total: 63.40,
        paymentStatus: "pending",
        items: [{ name: "Shaving Kit", quantity: 1, price: 63.40 }],
        createdAt: new Date("2025-10-12T11:00:00").toISOString()
      },
      {
        id: "ORD012",
        fullName: "Susan Harris",
        email: "susan.h@email.com",
        phone: "07722233344",
        total: 110.00,
        paymentStatus: "paid",
        items: [{ name: "Hair Straightener", quantity: 1, price: 110.00 }],
        createdAt: new Date("2025-10-12T14:15:00").toISOString()
      },
      {
        id: "ORD013",
        fullName: "Joseph Martin",
        email: "joseph.m@email.com",
        phone: "07733344455",
        total: 48.90,
        paymentStatus: "paid",
        items: [{ name: "Body Lotion", quantity: 3, price: 16.30 }],
        createdAt: new Date("2025-10-11T10:00:00").toISOString()
      },
      {
        id: "ORD014",
        fullName: "Jessica Thompson",
        email: "jessica.th@email.com",
        phone: "07744455566",
        total: 175.50,
        paymentStatus: "paid",
        items: [{ name: "Professional Curling Iron", quantity: 1, price: 175.50 }],
        createdAt: new Date("2025-10-11T13:30:00").toISOString()
      },
      {
        id: "ORD015",
        fullName: "Charles Garcia",
        email: "charles.g@email.com",
        phone: "07755566677",
        total: 85.00,
        paymentStatus: "pending",
        items: [{ name: "Beard Care Kit", quantity: 1, price: 85.00 }],
        createdAt: new Date("2025-10-11T16:00:00").toISOString()
      },
      {
        id: "ORD016",
        fullName: "Karen Martinez",
        email: "karen.m@email.com",
        phone: "07766677788",
        total: 39.99,
        paymentStatus: "paid",
        items: [{ name: "Lipstick Set", quantity: 1, price: 39.99 }],
        createdAt: new Date("2025-10-10T09:00:00").toISOString()
      },
      {
        id: "ORD017",
        fullName: "Thomas Robinson",
        email: "thomas.r@email.com",
        phone: "07777788899",
        total: 156.75,
        paymentStatus: "paid",
        items: [{ name: "Professional Trimmer", quantity: 1, price: 156.75 }],
        createdAt: new Date("2025-10-10T11:30:00").toISOString()
      },
      {
        id: "ORD018",
        fullName: "Nancy Clark",
        email: "nancy.c@email.com",
        phone: "07788899900",
        total: 72.50,
        paymentStatus: "paid",
        items: [{ name: "Nail Art Kit", quantity: 1, price: 72.50 }],
        createdAt: new Date("2025-10-10T14:45:00").toISOString()
      },
      {
        id: "ORD019",
        fullName: "Daniel Rodriguez",
        email: "daniel.r@email.com",
        phone: "07799900011",
        total: 98.00,
        paymentStatus: "pending",
        items: [{ name: "Hair Wax Set", quantity: 2, price: 49.00 }],
        createdAt: new Date("2025-10-09T10:15:00").toISOString()
      },
      {
        id: "ORD020",
        fullName: "Betty Lewis",
        email: "betty.l@email.com",
        phone: "07700011122",
        total: 134.99,
        paymentStatus: "paid",
        items: [{ name: "Facial Steamer", quantity: 1, price: 134.99 }],
        createdAt: new Date("2025-10-09T12:30:00").toISOString()
      },
      {
        id: "ORD021",
        fullName: "Matthew Walker",
        email: "matthew.w@email.com",
        phone: "07711223344",
        total: 54.25,
        paymentStatus: "paid",
        items: [{ name: "Cologne Set", quantity: 1, price: 54.25 }],
        createdAt: new Date("2025-10-09T15:00:00").toISOString()
      },
      {
        id: "ORD022",
        fullName: "Helen Hall",
        email: "helen.h@email.com",
        phone: "07722334455",
        total: 89.50,
        paymentStatus: "paid",
        items: [{ name: "Mascara Collection", quantity: 1, price: 89.50 }],
        createdAt: new Date("2025-10-08T09:30:00").toISOString()
      },
      {
        id: "ORD023",
        fullName: "Paul Allen",
        email: "paul.a@email.com",
        phone: "07733445566",
        total: 112.00,
        paymentStatus: "pending",
        items: [{ name: "Electric Razor", quantity: 1, price: 112.00 }],
        createdAt: new Date("2025-10-08T11:45:00").toISOString()
      },
      {
        id: "ORD024",
        fullName: "Sandra Young",
        email: "sandra.y@email.com",
        phone: "07744556677",
        total: 67.99,
        paymentStatus: "paid",
        items: [{ name: "Hair Mask Treatment", quantity: 1, price: 67.99 }],
        createdAt: new Date("2025-10-08T14:00:00").toISOString()
      },
      {
        id: "ORD025",
        fullName: "Mark King",
        email: "mark.k@email.com",
        phone: "07755667788",
        total: 195.00,
        paymentStatus: "paid",
        items: [{ name: "Premium Grooming Kit", quantity: 1, price: 195.00 }],
        createdAt: new Date("2025-10-08T16:30:00").toISOString()
      }
    ];
    localStorage.setItem("orders", JSON.stringify(dummyOrders));
    return dummyOrders;
  });
  const [products, setProducts] = useState(() => {
    const stored = localStorage.getItem("adminProducts");
    const productsData = stored && JSON.parse(stored).length > 0 ? JSON.parse(stored) : INITIAL_PRODUCTS;
    // Add inventory tracking if not present
    return productsData.map((p) => ({
      ...p,
      stock: p.stock ?? 0,
      inventoryHistory: p.inventoryHistory ?? []
    }));
  });
  const [gallery, setGallery] = useState(() => JSON.parse(localStorage.getItem("adminGallery") || "[]"));

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [newGallery, setNewGallery] = useState({ title: "", image: "" });
  
  
  // Search and pagination states
  const [bookingSearchInput, setBookingSearchInput] = useState({ query: "", startDate: "", endDate: "" });
  const [orderSearchInput, setOrderSearchInput] = useState({ query: "", startDate: "", endDate: "" });
  const [bookingSearch, setBookingSearch] = useState({ query: "", startDate: "", endDate: "" });
  const [orderSearch, setOrderSearch] = useState({ query: "", startDate: "", endDate: "" });
  const [bookingPage, setBookingPage] = useState(1);
  const [orderPage, setOrderPage] = useState(1);
  const itemsPerPage = 4;
  
  // Order details dialog state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  
  // Inventory management dialog state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [inventoryDialogOpen, setInventoryDialogOpen] = useState(false);
  const [inventoryUnits, setInventoryUnits] = useState("");
  const [inventoryHistoryPage, setInventoryHistoryPage] = useState(1);
  const inventoryHistoryPerPage = 5;

  const handleBookingSearch = () => {
    setBookingSearch(bookingSearchInput);
    setBookingPage(1);
  };

  const handleOrderSearch = () => {
    setOrderSearch(orderSearchInput);
    setOrderPage(1);
  };


  const addProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.image) {
      toast.error("Please fill in all required fields (name, price, category, image)");
      return;
    }

    // Create a URL for the uploaded image file
    const imageUrl = URL.createObjectURL(newProduct.image);

    const product = {
      id: `product-${Date.now()}`,
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      image: imageUrl,
    };

    const updated = [...products, product];
    setProducts(updated);
    localStorage.setItem("adminProducts", JSON.stringify(updated));
    setNewProduct({ name: "", price: "", category: "", image: null });
    setImagePreview("");
    toast.success("Product added successfully!");
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewProduct({ ...newProduct, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleManageInventory = (product) => {
    setSelectedProduct(product);
    setInventoryDialogOpen(true);
    setInventoryUnits("");
    setInventoryHistoryPage(1);
  };

  const handleAddInventory = () => {
    if (!inventoryUnits || parseInt(inventoryUnits) <= 0) {
      toast.error("Please enter a valid number of units");
      return;
    }

    const unitsToAdd = parseInt(inventoryUnits);
    const updated = products.map((p) => {
      if (p.id === selectedProduct.id) {
        const newStock = (p.stock || 0) + unitsToAdd;
        const historyEntry = {
          id: `inv-${Date.now()}`,
          date: new Date().toISOString(),
          addedBy: user?.email || "Admin",
          unitsAdded: unitsToAdd,
          totalAfter: newStock
        };
        return {
          ...p,
          stock: newStock,
          inventoryHistory: [...(p.inventoryHistory || []), historyEntry]
        };
      }
      return p;
    });

    setProducts(updated);
    localStorage.setItem("adminProducts", JSON.stringify(updated));
    setSelectedProduct(updated.find((p) => p.id === selectedProduct.id));
    setInventoryUnits("");
    toast.success(`Added ${unitsToAdd} units to inventory!`);
  };

  const addGalleryItem = () => {
    if (!newGallery.title || !newGallery.image) {
      toast.error("Please fill in all fields");
      return;
    }
    const item = { ...newGallery, id: Date.now().toString() };
    const updated = [...gallery, item];
    setGallery(updated);
    localStorage.setItem("adminGallery", JSON.stringify(updated));
    setNewGallery({ title: "", image: "" });
    toast.success("Gallery item added!");
  };

  const deleteGalleryItem = (id) => {
    const updated = gallery.filter((g) => g.id !== id);
    setGallery(updated);
    localStorage.setItem("adminGallery", JSON.stringify(updated));
    toast.success("Gallery item deleted!");
  };

  const updateOrderStatus = (orderId, status) => {
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, paymentStatus: status } : o
    );
    setOrders(updated);
    localStorage.setItem("orders", JSON.stringify(updated));
    
    // Update selectedOrder if it's the one being updated
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, paymentStatus: status });
    }
    
    toast.success(`Order status updated to ${status}!`);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOrderDialogOpen(true);
  };


  // Filter bookings based on search
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesQuery = bookingSearch.query === "" || 
        booking.id.toLowerCase().includes(bookingSearch.query.toLowerCase()) ||
        booking.fullName.toLowerCase().includes(bookingSearch.query.toLowerCase()) ||
        booking.email.toLowerCase().includes(bookingSearch.query.toLowerCase());
      
      const bookingDate = new Date(booking.date);
      const matchesStartDate = bookingSearch.startDate === "" || 
        bookingDate >= new Date(bookingSearch.startDate);
      const matchesEndDate = bookingSearch.endDate === "" || 
        bookingDate <= new Date(bookingSearch.endDate);
      
      return matchesQuery && matchesStartDate && matchesEndDate;
    });
  }, [bookings, bookingSearch]);

  // Filter orders based on search
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesQuery = orderSearch.query === "" || 
        order.id.toLowerCase().includes(orderSearch.query.toLowerCase()) ||
        order.fullName?.toLowerCase().includes(orderSearch.query.toLowerCase()) ||
        order.customerInfo?.fullName?.toLowerCase().includes(orderSearch.query.toLowerCase()) ||
        order.email?.toLowerCase().includes(orderSearch.query.toLowerCase()) ||
        order.customerInfo?.email?.toLowerCase().includes(orderSearch.query.toLowerCase());
      
      const orderDate = new Date(order.createdAt || order.date);
      const matchesStartDate = orderSearch.startDate === "" || 
        orderDate >= new Date(orderSearch.startDate);
      const matchesEndDate = orderSearch.endDate === "" || 
        orderDate <= new Date(orderSearch.endDate);
      
      return matchesQuery && matchesStartDate && matchesEndDate;
    });
  }, [orders, orderSearch]);

  // Paginate bookings
  const paginatedBookings = useMemo(() => {
    const startIndex = (bookingPage - 1) * itemsPerPage;
    return filteredBookings.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBookings, bookingPage]);

  const totalBookingPages = Math.ceil(filteredBookings.length / itemsPerPage);

  // Paginate orders
  const paginatedOrders = useMemo(() => {
    const startIndex = (orderPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, orderPage]);

  const totalOrderPages = Math.ceil(filteredOrders.length / itemsPerPage);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <SidebarProvider defaultOpen={false}>
        <div className="flex flex-1 w-full">
          <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          
          <main className="flex-1 w-full px-4 py-8">
            <div className="flex items-center gap-4 mb-6">
              <SidebarTrigger />
              <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
            </div>
            
            {activeTab === "bookings" && (
              <BookingsAdmin />
            )}

            {activeTab === "orders" && (
              <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">All Orders ({filteredOrders.length})</h2>
              
              {/* Search Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Search Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row items-end gap-2">
                    <div className="space-y-2 flex-1 w-full">
                      <Label>Search by Name, Email or ID</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search..."
                          value={orderSearchInput.query}
                          onChange={(e) => setOrderSearchInput({ ...orderSearchInput, query: e.target.value })}
                          className="pl-9"
                          onKeyDown={(e) => e.key === 'Enter' && handleOrderSearch()}
                        />
                      </div>
                    </div>
                    <div className="space-y-2 w-full md:w-auto md:min-w-[180px]">
                      <Label>Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !orderSearchInput.startDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {orderSearchInput.startDate ? format(new Date(orderSearchInput.startDate), "PPP") : "Start"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={orderSearchInput.startDate ? new Date(orderSearchInput.startDate) : undefined}
                            onSelect={(date) => setOrderSearchInput({ ...orderSearchInput, startDate: date ? format(date, "yyyy-MM-dd") : "" })}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2 w-full md:w-auto md:min-w-[180px]">
                      <Label>End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !orderSearchInput.endDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {orderSearchInput.endDate ? format(new Date(orderSearchInput.endDate), "PPP") : "End"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={orderSearchInput.endDate ? new Date(orderSearchInput.endDate) : undefined}
                            onSelect={(date) => setOrderSearchInput({ ...orderSearchInput, endDate: date ? format(date, "yyyy-MM-dd") : "" })}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                      <Button onClick={handleOrderSearch} className="flex-1 md:flex-initial">
                        <Search className="mr-2 h-4 w-4" />
                        Search
                      </Button>
                      {(orderSearchInput.query || orderSearchInput.startDate || orderSearchInput.endDate) && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setOrderSearchInput({ query: "", startDate: "", endDate: "" });
                            setOrderSearch({ query: "", startDate: "", endDate: "" });
                            setOrderPage(1);
                          }}
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Orders List */}
            <div className="grid gap-4 md:grid-cols-2">
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/50 pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            {order.id}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1 text-xs">
                            <Clock className="h-3 w-3" />
                            {new Date(order.createdAt).toLocaleDateString('en-GB', { 
                              day: '2-digit', 
                              month: 'short', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </CardDescription>
                        </div>
                        <Badge 
                          variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'}
                          className={cn(
                            order.paymentStatus === 'paid' && 'bg-green-500 hover:bg-green-600',
                            order.paymentStatus === 'pending' && 'bg-orange-500 hover:bg-orange-600'
                          )}
                        >
                          {order.paymentStatus}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                      {/* Customer Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{order.fullName || order.customerInfo?.fullName}</span>
                        </div>
                        <div className="text-xs text-muted-foreground pl-6">
                          <p>{order.email || order.customerInfo?.email}</p>
                          <p>{order.phone || order.customerInfo?.phone}</p>
                        </div>
                      </div>

                      {/* Order Items Summary */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span>Items ({order.items?.length || 1})</span>
                        </div>
                        <div className="pl-6 space-y-1">
                          {order.items?.slice(0, 2).map((item, idx) => (
                            <p key={idx} className="text-xs text-muted-foreground">
                              {item.name} × {item.quantity}
                            </p>
                          ))}
                          {order.items?.length > 2 && (
                            <p className="text-xs text-muted-foreground italic">
                              +{order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Total Amount */}
                      <div className="pt-3 border-t">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            <span>Total</span>
                          </div>
                          <span className="text-lg font-bold">₦{order.total.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        {order.paymentStatus === 'pending' && (
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => updateOrderStatus(order.id, "paid")}
                          >
                            Mark Paid
                          </Button>
                        )}
                        {order.paymentStatus === 'paid' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => updateOrderStatus(order.id, "pending")}
                          >
                            Mark Pending
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="md:col-span-2">
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No orders found matching your search criteria.
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Pagination */}
            {totalOrderPages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setOrderPage(Math.max(1, orderPage - 1))}
                        className={orderPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalOrderPages }, (_, i) => i + 1).map((page) => {
                      if (
                        page === 1 ||
                        page === totalOrderPages ||
                        (page >= orderPage - 1 && page <= orderPage + 1)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setOrderPage(page)}
                              isActive={orderPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (page === orderPage - 2 || page === orderPage + 2) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}
                    
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setOrderPage(Math.min(totalOrderPages, orderPage + 1))}
                        className={orderPage === totalOrderPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
              </div>
            )}

          {/* Order Details Dialog */}
          <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
                <DialogDescription>
                  Placed on {selectedOrder && new Date(selectedOrder.createdAt).toLocaleDateString('en-GB', { 
                    day: '2-digit', 
                    month: 'long', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </DialogDescription>
              </DialogHeader>

              {selectedOrder && (
                <div className="space-y-6">
                  {/* Status Management */}
                  <div className="space-y-3">
                    <Label>Order Status</Label>
                    <Select 
                      value={selectedOrder.paymentStatus} 
                      onValueChange={(value) => updateOrderStatus(selectedOrder.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Customer Information */}
                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Customer Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-muted-foreground">Full Name</Label>
                        <p className="font-medium">{selectedOrder.fullName || selectedOrder.customerInfo?.fullName}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Email</Label>
                        <p className="font-medium">{selectedOrder.email || selectedOrder.customerInfo?.email}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Phone</Label>
                        <p className="font-medium">{selectedOrder.phone || selectedOrder.customerInfo?.phone}</p>
                      </div>
                      {selectedOrder.customerInfo?.address && (
                        <div className="col-span-2">
                          <Label className="text-muted-foreground">Delivery Address</Label>
                          <p className="font-medium">
                            {selectedOrder.customerInfo.address}, {selectedOrder.customerInfo.city}, {selectedOrder.customerInfo.postcode}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Order Items */}
                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" />
                      Order Items
                    </h3>
                    <div className="space-y-2">
                      {selectedOrder.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                          </div>
                          <p className="font-bold">£{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg">
                      <span className="font-bold text-lg">Total</span>
                      <span className="font-bold text-2xl text-primary">£{selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Payment Information */}
                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Payment Information
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-muted-foreground">Payment Method</Label>
                        <p className="font-medium capitalize">
                          {selectedOrder.paymentMethod?.replace("-", " ") || "N/A"}
                        </p>
                      </div>
                      
                      {/* Payment Receipt */}
                      {selectedOrder.receiptUrl && (
                        <div className="mt-4">
                          <Label className="text-muted-foreground mb-2 block">Payment Receipt (Uploaded by Customer)</Label>
                          <div className="border-2 border-primary/20 rounded-lg p-4 bg-muted/30">
                            <div className="mb-2">
                              <img 
                                src={selectedOrder.receiptUrl} 
                                alt="Payment Receipt" 
                                className="max-w-full h-auto rounded-md border"
                              />
                            </div>
                            <div className="flex gap-2">
                              <a 
                                href={selectedOrder.receiptUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                              >
                                <Eye className="h-4 w-4" />
                                View Full Size →
                              </a>
                              <a 
                                href={selectedOrder.receiptUrl} 
                                download={`Receipt-${selectedOrder.id}.jpg`}
                                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                              >
                                <Download className="h-4 w-4" />
                                Download
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {!selectedOrder.receiptUrl && selectedOrder.paymentMethod === "bank-transfer" && (
                        <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-700">
                          No receipt uploaded yet
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Generate Receipt Section */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Official Receipt</h3>
                    <p className="text-sm text-muted-foreground">
                      Send receipt details to customer or view printable version
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => {
                          const customerEmail = selectedOrder.customerInfo?.email || selectedOrder.email;
                          const subject = `Your Receipt - Order ${selectedOrder.id}`;
                          const body = `Dear ${selectedOrder.customerInfo?.fullName || selectedOrder.fullName},\n\nThank you for your order ${selectedOrder.id}.\n\nOrder Details:\nTotal: £${selectedOrder.total.toFixed(2)}\nStatus: ${selectedOrder.paymentStatus}\nDate: ${new Date(selectedOrder.createdAt).toLocaleDateString("en-GB")}\n\nItems:\n${selectedOrder.items?.map((item) => `- ${item.name} x${item.quantity} - £${(item.price * item.quantity).toFixed(2)}`).join("\n")}\n\nIf you have any questions, please contact us.\n\nBest regards,\nGlow Beauty Emporium`;
                          
                          window.location.href = `mailto:${customerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                          toast.info("Opening email client with receipt details...");
                        }}
                        size="sm"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Email Receipt
                      </Button>
                      
                      <Button
                        onClick={() => {
                          // Open receipt in new window for printing/downloading
                          const receiptWindow = window.open("", "_blank");
                          if (!receiptWindow) return;
                          
                          receiptWindow.document.write(`
                            <!DOCTYPE html>
                            <html>
                              <head>
                                <title>Receipt - ${selectedOrder.id}</title>
                                <style>
                                  * { margin: 0; padding: 0; box-sizing: border-box; }
                                  body { font-family: Arial, sans-serif; padding: 40px; background: #f5f5f5; }
                                  .receipt { max-width: 800px; margin: 0 auto; background: white; padding: 60px; box-shadow: 0 0 20px rgba(0,0,0,0.1); position: relative; }
                                  .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); text-align: center; opacity: 0.08; pointer-events: none; }
                                  .watermark-logo { width: 200px; height: 200px; margin: 0 auto 20px; }
                                  .watermark-text { font-size: 32px; font-weight: 900; color: #000; margin-bottom: 15px; white-space: nowrap; }
                                  .watermark-id { font-size: 24px; font-weight: 700; color: #000; }
                                  .header { text-align: center; border-bottom: 3px solid #d4af37; padding-bottom: 20px; margin-bottom: 40px; }
                                  .company-logo { width: 100px; height: 100px; margin: 0 auto 15px; }
                                  .company-name { font-size: 36px; font-weight: 900; margin-bottom: 10px; color: #000; }
                                  .receipt-title { font-size: 18px; color: #666; text-transform: uppercase; letter-spacing: 2px; }
                                  .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
                                  .detail-section h3 { font-size: 14px; color: #666; text-transform: uppercase; margin-bottom: 15px; letter-spacing: 1px; }
                                  .detail-section p { margin: 8px 0; line-height: 1.6; }
                                  table { width: 100%; border-collapse: collapse; margin: 30px 0; }
                                  thead { background: #f5f5f5; border-top: 2px solid #ddd; border-bottom: 2px solid #ddd; }
                                  th { padding: 15px; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
                                  th:last-child, td:last-child { text-align: right; }
                                  td { padding: 15px; border-bottom: 1px solid #eee; }
                                  .totals { margin: 30px 0; border-top: 2px solid #d4af37; padding-top: 20px; }
                                  .total-row { display: flex; justify-content: space-between; padding: 10px 0; font-size: 18px; font-weight: bold; }
                                  .status-badge { display: inline-block; padding: 10px 20px; border-radius: 30px; font-weight: 600; margin: 20px 0; font-size: 16px; }
                                  .status-paid { background: #d4edda; color: #155724; }
                                  .status-pending { background: #fff3cd; color: #856404; }
                                  .footer { text-align: center; margin-top: 60px; padding-top: 30px; border-top: 2px solid #eee; color: #666; font-size: 14px; }
                                  @media print { body { background: white; padding: 0; } .receipt { box-shadow: none; } }
                                </style>
                              </head>
                              <body>
                                <div class="receipt">
                                  <div class="watermark">
                                    <img src="/src/assets/logo.png" alt="Logo" class="watermark-logo" />
                                    <div class="watermark-text">GLOW BEAUTY EMPORIUM</div>
                                    <div class="watermark-id">Receipt #${selectedOrder.id}</div>
                                  </div>
                                  <div class="header">
                                    <img src="/src/assets/logo.png" alt="Glow Beauty Emporium" class="company-logo" />
                                    <div class="company-name">GLOW BEAUTY EMPORIUM</div>
                                    <div class="receipt-title">Official Receipt</div>
                                  </div>
                                  <div class="details-grid">
                                    <div class="detail-section">
                                      <h3>Receipt Details</h3>
                                      <p><strong>Receipt No:</strong> ${selectedOrder.id}</p>
                                      <p><strong>Date:</strong> ${new Date(selectedOrder.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</p>
                                      <p><strong>Payment Method:</strong> ${selectedOrder.paymentMethod?.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "N/A"}</p>
                                    </div>
                                    <div class="detail-section">
                                      <h3>Customer</h3>
                                      <p><strong>${selectedOrder.customerInfo?.fullName || selectedOrder.fullName}</strong></p>
                                      <p>${selectedOrder.customerInfo?.email || selectedOrder.email}</p>
                                      <p>${selectedOrder.customerInfo?.phone || selectedOrder.phone}</p>
                                    </div>
                                  </div>
                                  <table>
                                    <thead>
                                      <tr>
                                        <th>Item</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Total</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      ${selectedOrder.items?.map((item) => `
                                        <tr>
                                          <td>${item.name}</td>
                                          <td>${item.quantity}</td>
                                          <td>£${item.price.toFixed(2)}</td>
                                          <td>£${(item.price * item.quantity).toFixed(2)}</td>
                                        </tr>
                                      `).join("")}
                                    </tbody>
                                  </table>
                                  <div class="totals">
                                    <div class="total-row">
                                      <span>Total Amount</span>
                                      <span>£${selectedOrder.total.toFixed(2)}</span>
                                    </div>
                                  </div>
                                  <div style="text-align: center;">
                                    <span class="status-badge ${selectedOrder.paymentStatus === "paid" || selectedOrder.paymentStatus === "approved" || selectedOrder.paymentStatus === "completed" ? "status-paid" : "status-pending"}">
                                      ${selectedOrder.paymentStatus === "paid" || selectedOrder.paymentStatus === "approved" || selectedOrder.paymentStatus === "completed" ? "✓ PAID" : "⏱ PENDING"}
                                    </span>
                                  </div>
                                  <div class="footer">
                                    <p><strong>Thank you for your business!</strong></p>
                                    <p>Glow Beauty Emporium | For questions, please contact us at support@glowbeautyemporium.com</p>
                                  </div>
                                </div>
                              </body>
                            </html>
                          `);
                          receiptWindow.document.close();
                          toast.success("Receipt opened in new window. You can print or save as PDF!");
                        }}
                        variant="outline"
                        size="sm"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View/Print Receipt
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => updateOrderStatus(selectedOrder.id, "paid")}
                      disabled={selectedOrder.paymentStatus === "paid"}
                      className="flex-1"
                    >
                      Mark as Paid
                    </Button>
                    <Button 
                      onClick={() => updateOrderStatus(selectedOrder.id, "completed")}
                      disabled={selectedOrder.paymentStatus === "completed"}
                      variant="outline"
                      className="flex-1"
                    >
                      Mark as Completed
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
          
          
          {activeTab === "inventory" && (
            <div className="space-y-6">
              {/* Sales Metrics */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sales Today</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      £{orders
                        .filter((o) => {
                          const orderDate = new Date(o.createdAt || o.date);
                          const today = new Date();
                          return orderDate.toDateString() === today.toDateString() && 
                                 (o.paymentStatus === "paid" || o.paymentStatus === "completed");
                        })
                        .reduce((sum, o) => sum + o.total, 0)
                        .toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {orders.filter((o) => {
                        const orderDate = new Date(o.createdAt || o.date);
                        const today = new Date();
                        return orderDate.toDateString() === today.toDateString();
                      }).length} orders
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sales This Week</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      £{orders
                        .filter((o) => {
                          const orderDate = new Date(o.createdAt || o.date);
                          const weekAgo = new Date();
                          weekAgo.setDate(weekAgo.getDate() - 7);
                          return orderDate >= weekAgo && 
                                 (o.paymentStatus === "paid" || o.paymentStatus === "completed");
                        })
                        .reduce((sum, o) => sum + o.total, 0)
                        .toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {orders.filter((o) => {
                        const orderDate = new Date(o.createdAt || o.date);
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return orderDate >= weekAgo;
                      }).length} orders
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sales This Year</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      £{orders
                        .filter((o) => {
                          const orderDate = new Date(o.createdAt || o.date);
                          const currentYear = new Date().getFullYear();
                          return orderDate.getFullYear() === currentYear && 
                                 (o.paymentStatus === "paid" || o.paymentStatus === "completed");
                        })
                        .reduce((sum, o) => sum + o.total, 0)
                        .toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {orders.filter((o) => {
                        const orderDate = new Date(o.createdAt || o.date);
                        const currentYear = new Date().getFullYear();
                        return orderDate.getFullYear() === currentYear;
                      }).length} orders
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Add New Product */}
              <Card>
                <CardHeader>
                  <CardTitle>Add New Product</CardTitle>
                  <CardDescription>Add a new product to your inventory</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Product Name *</Label>
                      <Input
                        placeholder="e.g., Brazilian Hair Wig"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Price (£) *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Category *</Label>
                      <Select
                        value={newProduct.category}
                        onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Braided Wigs">Braided Wigs</SelectItem>
                          <SelectItem value="Human Hair Extension">Human Hair Extension</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Product Image *</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      {imagePreview && (
                        <div className="mt-2">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-24 h-24 object-cover rounded-md border-2 border-primary/20"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <Button onClick={addProduct} className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Product
                  </Button>
                </CardContent>
              </Card>

              {/* Products Table */}
              <Card>
                <CardHeader>
                  <CardTitle>All Products ({products.length})</CardTitle>
                  <CardDescription>Manage your inventory items</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Stock</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                            No products yet. Add your first product above.
                          </TableCell>
                        </TableRow>
                      ) : (
                        products.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              {product.image ? (
                                <img 
                                  src={product.image} 
                                  alt={product.name} 
                                  className="w-16 h-16 object-cover rounded-md"
                                />
                              ) : (
                                <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                                  <Package className="h-6 w-6 text-muted-foreground" />
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>
                              {product.category ? (
                                <Badge variant="secondary">{product.category}</Badge>
                              ) : (
                                <span className="text-muted-foreground text-sm">No category</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              £{typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price).toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                                {product.stock || 0} units
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleManageInventory(product)}
                              >
                                <Settings className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "services" && (
            <div className="space-y-4">
              <ServicesAdmin />
            </div>
          )}
          
          {activeTab === "gallery" && (
            <div className="space-y-4">
              <GalleryAdmin />
            </div>
          )}
          </main>
        </div>
      </SidebarProvider>
      
      {/* Inventory Management Dialog */}
      <Dialog open={inventoryDialogOpen} onOpenChange={setInventoryDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle className="text-2xl">Inventory Management</DialogTitle>
                <DialogDescription>
                  Manage stock levels and view inventory history for {selectedProduct.name}
                </DialogDescription>
              </DialogHeader>

              {/* Product Preview */}
              <div className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                {selectedProduct.image && (
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name} 
                    className="w-24 h-24 object-cover rounded-md"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{selectedProduct.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedProduct.category}</p>
                  <p className="text-lg font-bold mt-1">£{selectedProduct.price.toFixed(2)}</p>
                </div>
              </div>

              <Separator />

              {/* Current Stock */}
              <div className="space-y-2">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Current Stock
                </h3>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-primary">
                    {selectedProduct.stock || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    units available
                  </div>
                </div>
              </div>

              <Separator />

              {/* Add Units */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add Units to Stock
                </h3>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      type="number"
                      min="1"
                      placeholder="Enter number of units"
                      value={inventoryUnits}
                      onChange={(e) => setInventoryUnits(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAddInventory}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Units
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Inventory History */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Inventory History
                </h3>
                {selectedProduct.inventoryHistory && selectedProduct.inventoryHistory.length > 0 ? (
                  <div className="space-y-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Added By</TableHead>
                          <TableHead className="text-right">Units Added</TableHead>
                          <TableHead className="text-right">Total After</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[...selectedProduct.inventoryHistory]
                          .reverse()
                          .slice(
                            (inventoryHistoryPage - 1) * inventoryHistoryPerPage,
                            inventoryHistoryPage * inventoryHistoryPerPage
                          )
                          .map((entry) => (
                            <TableRow key={entry.id}>
                              <TableCell>
                                {new Date(entry.date).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  {entry.addedBy}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <Badge variant="outline" className="bg-green-500/10 text-green-700">
                                  +{entry.unitsAdded}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-semibold">
                                {entry.totalAfter} units
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                    
                    {/* Pagination for Inventory History */}
                    {selectedProduct.inventoryHistory.length > inventoryHistoryPerPage && (
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => setInventoryHistoryPage(Math.max(1, inventoryHistoryPage - 1))}
                              className={inventoryHistoryPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                          </PaginationItem>
                          {Array.from({ 
                            length: Math.ceil(selectedProduct.inventoryHistory.length / inventoryHistoryPerPage) 
                          }).map((_, idx) => (
                            <PaginationItem key={idx}>
                              <PaginationLink
                                onClick={() => setInventoryHistoryPage(idx + 1)}
                                isActive={inventoryHistoryPage === idx + 1}
                                className="cursor-pointer"
                              >
                                {idx + 1}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => setInventoryHistoryPage(
                                Math.min(
                                  Math.ceil(selectedProduct.inventoryHistory.length / inventoryHistoryPerPage),
                                  inventoryHistoryPage + 1
                                )
                              )}
                              className={
                                inventoryHistoryPage >= Math.ceil(selectedProduct.inventoryHistory.length / inventoryHistoryPerPage)
                                  ? "pointer-events-none opacity-50"
                                  : "cursor-pointer"
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No inventory history yet</p>
                    <p className="text-sm">Add units to start tracking inventory changes</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
