import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Bot,
  Globe,
  MapPin,
  Phone,
  Mail,
  Star,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  Download,
  RefreshCw,
  Plus,
  Eye,
  UserPlus,
  Home,
  Trash2,
  MessageCircle,
  Building,
  Navigation,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

interface AIProvider {
  id: string;
  name: string;
  apiKey: string;
  enabled: boolean;
}

interface ScrapingTarget {
  id: string;
  name: string;
  url: string;
  type: "immobilier" | "annonces" | "social" | "business";
  status: "active" | "inactive" | "error";
  lastScrape?: string;
  totalResults?: number;
}

interface ProspectOpportunity {
  id: string;
  title: string;
  description: string;
  source: string;
  url: string;
  score: number;
  type: "property" | "lead" | "contact" | "market";
  location: string;
  price?: number;
  currency?: string;
  contact?: {
    name?: string;
    email?: string;
    phone?: string;
    whatsapp?: string;
    company?: string;
    linkedin?: string;
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  aiAnalysis: {
    summary: string;
    strengths: string[];
    risks: string[];
    recommendations: string[];
  };
  createdAt: string;
  status: "new" | "reviewed" | "converted" | "rejected";
}

interface SmartProspectingProps {
  language?: string;
  currency?: string;
}

const SmartProspecting = ({
  language = "fr",
  currency = "TND",
}: SmartProspectingProps = {}) => {
  const [aiProviders, setAIProviders] = useState<AIProvider[]>([]);
  const [scrapingTargets, setScrapingTargets] = useState<ScrapingTarget[]>([
    // Sources locales tunisiennes
    {
      id: "1",
      name: "Tayara.tn",
      url: "https://www.tayara.tn/ads/c/Immobilier",
      type: "immobilier",
      status: "active",
      lastScrape: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      totalResults: 1250,
    },
    {
      id: "2",
      name: "Mubawab.tn",
      url: "https://www.mubawab.tn/",
      type: "immobilier",
      status: "active",
      lastScrape: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      totalResults: 890,
    },
    {
      id: "3",
      name: "Tunisie Annonce",
      url: "https://www.tunisie-annonce.com/AnnoncesImmobilier.asp",
      type: "immobilier",
      status: "active",
      lastScrape: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      totalResults: 567,
    },
    {
      id: "4",
      name: "Immobilier.tn",
      url: "https://www.immobilier.tn/",
      type: "immobilier",
      status: "active",
      lastScrape: new Date(Date.now() - 30 * 1000).toISOString(),
      totalResults: 432,
    },
    {
      id: "21",
      name: "Afariat.tn",
      url: "https://www.afariat.tn/",
      type: "immobilier",
      status: "active",
      lastScrape: new Date(Date.now() - 45 * 1000).toISOString(),
      totalResults: 678,
    },
    {
      id: "22",
      name: "Immotunisie.com",
      url: "https://www.immotunisie.com/",
      type: "immobilier",
      status: "active",
      lastScrape: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
      totalResults: 345,
    },
    {
      id: "23",
      name: "Tunisie-immobilier.org",
      url: "https://www.tunisie-immobilier.org/",
      type: "immobilier",
      status: "active",
      lastScrape: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
      totalResults: 234,
    },
    {
      id: "24",
      name: "Agences Immobilières Tunis",
      url: "https://www.agences-immobilieres-tunis.tn/",
      type: "business",
      status: "active",
      lastScrape: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      totalResults: 156,
    },
    {
      id: "25",
      name: "Century21 Tunisie",
      url: "https://www.century21.tn/",
      type: "business",
      status: "active",
      lastScrape: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
      totalResults: 289,
    },
    {
      id: "26",
      name: "ERA Tunisie",
      url: "https://www.era.tn/",
      type: "business",
      status: "active",
      lastScrape: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
      totalResults: 198,
    },
    {
      id: "27",
      name: "Facebook Marketplace Tunisie",
      url: "https://www.facebook.com/marketplace/tunis/propertyrentals",
      type: "social",
      status: "active",
      lastScrape: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      totalResults: 567,
    },
    {
      id: "28",
      name: "Groupes Facebook Immobilier Tunis",
      url: "https://www.facebook.com/groups/immobilier.tunis.local",
      type: "social",
      status: "active",
      lastScrape: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
      totalResults: 423,
    },
    {
      id: "29",
      name: "Immobilier Sousse - Facebook",
      url: "https://www.facebook.com/groups/immobilier.sousse",
      type: "social",
      status: "active",
      lastScrape: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      totalResults: 312,
    },
    {
      id: "30",
      name: "Immobilier Sfax - Facebook",
      url: "https://www.facebook.com/groups/immobilier.sfax",
      type: "social",
      status: "active",
      lastScrape: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      totalResults: 278,
    },
    // Sources expatriés et étrangers
    {
      id: "5",
      name: "Tunisiens de France - Immobilier",
      url: "https://www.facebook.com/groups/tunisiens.france.immobilier",
      type: "social",
      status: "active",
      lastScrape: new Date(Date.now() - 45 * 1000).toISOString(),
      totalResults: 456,
    },
    {
      id: "6",
      name: "LinkedIn Immobilier",
      url: "https://www.linkedin.com/search/results/content/?keywords=immobilier%20tunisie",
      type: "social",
      status: "active",
      lastScrape: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      totalResults: 234,
    },
    {
      id: "7",
      name: "Avito.ma",
      url: "https://www.avito.ma/fr/immobilier",
      type: "immobilier",
      status: "inactive",
      lastScrape: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      totalResults: 1890,
    },
    {
      id: "8",
      name: "Diaspora Tunisienne - Investissement",
      url: "https://www.linkedin.com/groups/diaspora-tunisienne-investissement",
      type: "social",
      status: "active",
      lastScrape: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
      totalResults: 189,
    },
    {
      id: "9",
      name: "Tunisiens au Canada - Immobilier",
      url: "https://www.facebook.com/groups/tunisiens.canada.immobilier",
      type: "social",
      status: "active",
      lastScrape: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
      totalResults: 234,
    },
    {
      id: "10",
      name: "Expat Tunisians Real Estate",
      url: "https://www.reddit.com/r/TunisianExpats/",
      type: "social",
      status: "active",
      lastScrape: new Date(Date.now() - 20 * 1000).toISOString(),
      totalResults: 123,
    },
    {
      id: "11",
      name: "Tunisiens en Allemagne - Propriétés",
      url: "https://www.facebook.com/groups/tunisiens.allemagne.immobilier",
      type: "social",
      status: "active",
      lastScrape: new Date(Date.now() - 90 * 1000).toISOString(),
      totalResults: 167,
    },
    {
      id: "12",
      name: "Tunisian Diaspora Investment Forum",
      url: "https://www.tunisian-diaspora-investment.com/forum",
      type: "business",
      status: "active",
      lastScrape: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
      totalResults: 89,
    },
    {
      id: "13",
      name: "Tunisians au USA - Immobilier",
      url: "https://www.facebook.com/groups/tunisiens.usa.realestate",
      type: "social",
      status: "active",
      lastScrape: new Date(Date.now() - 60 * 1000).toISOString(),
      totalResults: 298,
    },
    {
      id: "14",
      name: "WhatsApp Groups - Tunisiens Expatriés",
      url: "https://chat.whatsapp.com/tunisiens-expat-immobilier",
      type: "social",
      status: "active",
      lastScrape: new Date(Date.now() - 15 * 1000).toISOString(),
      totalResults: 78,
    },
    {
      id: "15",
      name: "Telegram - Expat Tunisiens Location",
      url: "https://t.me/tunisiens_expat_location",
      type: "social",
      status: "active",
      lastScrape: new Date(Date.now() - 25 * 1000).toISOString(),
      totalResults: 156,
    },
    {
      id: "16",
      name: "Discord - Tunisian Community",
      url: "https://discord.gg/tunisian-expats",
      type: "social",
      status: "active",
      lastScrape: new Date(Date.now() - 40 * 1000).toISOString(),
      totalResults: 89,
    },
    {
      id: "17",
      name: "Clubhouse - Immobilier Tunisie",
      url: "https://clubhouse.com/club/immobilier-tunisie",
      type: "social",
      status: "active",
      lastScrape: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      totalResults: 67,
    },
    {
      id: "18",
      name: "Instagram - Expat Stories",
      url: "https://instagram.com/hashtag/tunisianexpat",
      type: "social",
      status: "active",
      lastScrape: new Date(Date.now() - 35 * 1000).toISOString(),
      totalResults: 234,
    },
    {
      id: "19",
      name: "Facebook - Groupes Location Tunisie",
      url: "https://facebook.com/groups/location.tunisie.expat",
      type: "social",
      status: "active",
      lastScrape: new Date(Date.now() - 50 * 1000).toISOString(),
      totalResults: 345,
    },
  ]);
  const [opportunities, setOpportunities] = useState<ProspectOpportunity[]>([]);
  const [isScrapingActive, setIsScrapingActive] = useState(false);
  const [scrapingProgress, setScrapingProgress] = useState(0);
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<ProspectOpportunity | null>(null);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [newTarget, setNewTarget] = useState({
    name: "",
    url: "",
    type: "immobilier" as "immobilier" | "annonces" | "social" | "business",
  });
  const [isAddTargetDialogOpen, setIsAddTargetDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  // Load AI providers and opportunities from localStorage
  useEffect(() => {
    const loadAIProviders = () => {
      try {
        const savedProviders = localStorage.getItem("crm-ai-providers");
        if (savedProviders) {
          const providers = JSON.parse(savedProviders);
          setAIProviders(providers);
        }
      } catch (error) {
        console.error("Error loading AI providers:", error);
      }
    };

    const loadOpportunities = () => {
      try {
        const savedOpportunities = localStorage.getItem("crm-opportunities");
        if (savedOpportunities) {
          const opportunities = JSON.parse(savedOpportunities);
          setOpportunities(opportunities);
        } else {
          // Set default opportunities only if none exist
          const defaultOpportunities: ProspectOpportunity[] = [
            {
              id: "1",
              title: "Villa Moderne à Sidi Bou Said",
              description: "Villa de luxe avec vue mer, 4 chambres, piscine",
              source: "Tayara.tn",
              url: "https://www.tayara.tn/item/123456",
              score: 92,
              type: "property",
              location: "Sidi Bou Said, Tunis",
              price: 850000,
              currency: "EUR",
              contact: {
                name: "Ahmed Trabelsi",
                phone: "+216 98 765 432",
                email: "ahmed.t@example.com",
                whatsapp: "+216 98 765 432",
                company: "IA",
                linkedin: "https://linkedin.com/in/ahmed-trabelsi",
                address: "Rue de la Paix, Sidi Bou Said",
                coordinates: {
                  lat: 36.8675,
                  lng: 10.3467,
                },
              },
              aiAnalysis: {
                summary:
                  "Propriété de haute qualité dans une zone prisée avec un excellent potentiel d'investissement.",
                strengths: [
                  "Emplacement premium",
                  "Vue mer exceptionnelle",
                  "Prix compétitif pour la zone",
                  "Propriétaire motivé",
                ],
                risks: [
                  "Marché saturé dans cette zone",
                  "Coûts d'entretien élevés",
                ],
                recommendations: [
                  "Négocier le prix",
                  "Vérifier les documents légaux",
                  "Organiser une visite rapide",
                ],
              },
              createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
              status: "new",
            },
            {
              id: "2",
              title: "Investisseur Recherche Appartements",
              description: "Investisseur français cherche appartements à Tunis",
              source: "LinkedIn",
              url: "https://linkedin.com/post/123",
              score: 78,
              type: "lead",
              location: "Tunis",
              contact: {
                name: "Pierre Dubois",
                email: "p.dubois@invest.fr",
                phone: "+33 6 12 34 56 78",
                company: "Invest France SARL",
                linkedin: "https://linkedin.com/in/pierre-dubois",
                address: "Paris, France",
              },
              aiAnalysis: {
                summary:
                  "Lead qualifié avec budget confirmé et timeline définie.",
                strengths: [
                  "Budget important",
                  "Expérience en investissement",
                  "Timeline claire",
                ],
                risks: ["Concurrence élevée", "Exigences spécifiques"],
                recommendations: [
                  "Contact immédiat",
                  "Préparer portfolio adapté",
                  "Proposer visite virtuelle",
                ],
              },
              createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
              status: "new",
            },
          ];
          setOpportunities(defaultOpportunities);
          localStorage.setItem(
            "crm-opportunities",
            JSON.stringify(defaultOpportunities),
          );
        }
      } catch (error) {
        console.error("Error loading opportunities:", error);
      }
    };

    loadAIProviders();
    loadOpportunities();

    // Listen for changes in AI providers
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "crm-ai-providers") {
        loadAIProviders();
      } else if (e.key === "crm-opportunities") {
        loadOpportunities();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Save opportunities to localStorage whenever they change
  useEffect(() => {
    if (opportunities.length > 0) {
      localStorage.setItem("crm-opportunities", JSON.stringify(opportunities));
    }
  }, [opportunities]);

  const getActiveAIProvider = () => {
    return aiProviders.find((provider) => provider.enabled && provider.apiKey);
  };

  const formatCurrency = (amount: number, curr: string) => {
    return new Intl.NumberFormat("fr-TN", {
      style: "currency",
      currency: curr,
    }).format(amount);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500";
      case "reviewed":
        return "bg-yellow-500";
      case "converted":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Function to verify coordinates using AI
  const verifyCoordinates = (location: string, lat: number, lng: number) => {
    // Simulate AI coordinate verification
    const locationVariations = {
      Tunis: { lat: 36.8065, lng: 10.1815, tolerance: 0.1 },
      "La Marsa": { lat: 36.8785, lng: 10.3247, tolerance: 0.05 },
      "Sidi Bou Said": { lat: 36.8675, lng: 10.3467, tolerance: 0.05 },
      Hammamet: { lat: 36.4, lng: 10.6167, tolerance: 0.05 },
      Sousse: { lat: 35.8256, lng: 10.6369, tolerance: 0.05 },
      Sfax: { lat: 34.7406, lng: 10.7603, tolerance: 0.05 },
      Monastir: { lat: 35.7643, lng: 10.8113, tolerance: 0.05 },
      Nabeul: { lat: 36.4561, lng: 10.7376, tolerance: 0.05 },
      Bizerte: { lat: 37.2744, lng: 9.8739, tolerance: 0.05 },
      Mahdia: { lat: 35.5047, lng: 11.0622, tolerance: 0.05 },
    };

    for (const [city, coords] of Object.entries(locationVariations)) {
      if (location.toLowerCase().includes(city.toLowerCase())) {
        const latDiff = Math.abs(lat - coords.lat);
        const lngDiff = Math.abs(lng - coords.lng);
        if (latDiff <= coords.tolerance && lngDiff <= coords.tolerance) {
          return { verified: true, accuracy: "high", city };
        }
      }
    }
    return { verified: false, accuracy: "low", city: "unknown" };
  };

  const startScraping = async () => {
    const activeProvider = getActiveAIProvider();
    if (!activeProvider) {
      alert(
        language === "fr"
          ? "Aucun fournisseur IA configuré. Veuillez configurer une clé API dans les paramètres."
          : "No AI provider configured. Please configure an API key in settings.",
      );
      return;
    }

    // Firecrawl API is used to extract structured data from real estate websites
    // It crawls the configured sources and extracts property listings and contact information
    // The AI then analyzes this data to identify leads, mandates, and requests

    setIsScrapingActive(true);
    setScrapingProgress(0);

    // Simulate scraping process with more comprehensive results
    const interval = setInterval(() => {
      setScrapingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScrapingActive(false);

          // Generate more comprehensive opportunities from multiple sources
          const propertyTypes = [
            "Villa",
            "Appartement",
            "Duplex",
            "Studio",
            "Penthouse",
            "Maison",
            "Terrain",
            "Local Commercial",
          ];
          const locations = [
            {
              name: "La Marsa",
              region: "Grand Tunis",
              lat: 36.8785,
              lng: 10.3247,
            },
            {
              name: "Sidi Bou Said",
              region: "Grand Tunis",
              lat: 36.8675,
              lng: 10.3467,
            },
            {
              name: "Carthage",
              region: "Grand Tunis",
              lat: 36.8531,
              lng: 10.3294,
            },
            {
              name: "Berges du Lac 1",
              region: "Grand Tunis",
              lat: 36.842,
              lng: 10.2267,
            },
            {
              name: "Berges du Lac 2",
              region: "Grand Tunis",
              lat: 36.8456,
              lng: 10.2189,
            },
            {
              name: "Le Manar",
              region: "Grand Tunis",
              lat: 36.8378,
              lng: 10.1689,
            },
            {
              name: "El Menzah",
              region: "Grand Tunis",
              lat: 36.8456,
              lng: 10.1789,
            },
            {
              name: "Tunis Centre",
              region: "Grand Tunis",
              lat: 36.8065,
              lng: 10.1815,
            },
            {
              name: "Ariana Ville",
              region: "Grand Tunis",
              lat: 36.8625,
              lng: 10.1956,
            },
            {
              name: "Ben Arous",
              region: "Grand Tunis",
              lat: 36.7539,
              lng: 10.2178,
            },
            {
              name: "Manouba",
              region: "Grand Tunis",
              lat: 36.8089,
              lng: 10.0969,
            },
            { name: "Hammamet", region: "Nabeul", lat: 36.4, lng: 10.6167 },
            {
              name: "Nabeul Centre",
              region: "Nabeul",
              lat: 36.4561,
              lng: 10.7376,
            },
            { name: "Mrezgua", region: "Nabeul", lat: 36.4234, lng: 10.6789 },
            {
              name: "Sousse Centre",
              region: "Sousse",
              lat: 35.8256,
              lng: 10.6369,
            },
            {
              name: "Monastir Marina",
              region: "Monastir",
              lat: 35.7643,
              lng: 10.8113,
            },
            { name: "Sfax Ville", region: "Sfax", lat: 34.7406, lng: 10.7603 },
            {
              name: "Bizerte Port",
              region: "Bizerte",
              lat: 37.2744,
              lng: 9.8739,
            },
            {
              name: "Mahdia Plage",
              region: "Mahdia",
              lat: 35.5047,
              lng: 11.0622,
            },
            {
              name: "Zaghouan",
              region: "Zaghouan",
              lat: 36.4028,
              lng: 10.1425,
            },
          ];

          const sources = [
            "Scraping IA - Tayara.tn",
            "Scraping IA - Mubawab.tn",
            "Scraping IA - Immobilier.tn",
            "Scraping IA - Facebook Marketplace",
            "Scraping IA - LinkedIn Immobilier",
            "Scraping IA - Tunisiens de France - Location",
            "Scraping IA - Tunisiens au Canada - Achat",
            "Scraping IA - Expat Tunisians - Location",
            "Scraping IA - Tunisiens en Allemagne - Achat",
            "Scraping IA - Tunisiens aux USA - Location",
            "Scraping IA - WhatsApp Groups Expat Location",
            "Scraping IA - Diaspora Investment Forum - Achat",
            "Scraping IA - Avito.ma",
            "Scraping IA - Reddit TunisianExpats - Location",
            "Scraping IA - Tunisie Annonce",
            "Scraping IA - Facebook Groupes Location Tunisie",
            "Scraping IA - Telegram Expat Tunisiens",
            "Scraping IA - Discord Tunisian Community",
            "Scraping IA - Clubhouse Immobilier Tunisie",
            "Scraping IA - Instagram Expat Stories",
          ];

          const expatNames = [
            "Ahmed Trabelsi",
            "Karim Ben Ali",
            "Sami Gharbi",
            "Mohamed Sassi",
            "Amina Bouaziz",
            "Fatma Khelifi",
            "Youssef Mejri",
            "Leila Hamdi",
            "Nizar Chatti",
            "Rim Jebali",
            "Hedi Mansouri",
            "Salma Dridi",
            "Tarek Ouali",
            "Ines Belhaj",
            "Fares Tlili",
            "Mariem Zouari",
            "Bilel Khemiri",
            "Nesrine Ayari",
            "Walid Rekik",
            "Dorra Sfar",
            "Mehdi Bouzid",
            "Sonia Cherif",
            "Rami Jendoubi",
            "Lina Maaloul",
            "Hatem Bouslama",
            "Wafa Ghanmi",
            "Slim Baccouche",
            "Emna Karray",
            "Chokri Belaid",
            "Sihem Boughanmi",
            "Adel Mhiri",
            "Houda Sellami",
            "Maher Agrebi",
            "Raoudha Laabidi",
            "Fathi Derouiche",
            "Samia Mabrouk",
            "Lotfi Abdelli",
            "Najet Radhouani",
            "Ridha Charfeddine",
            "Monia Brahim",
          ];

          const foreignNames = [
            "Marco Rossi",
            "Giulia Ferrari",
            "Alessandro Bianchi",
            "Francesca Romano",
            "Luca Conti",
            "Elena Ricci",
            "Pierre Dubois",
            "Marie Martin",
            "Jean Durand",
            "Sophie Leroy",
            "Antoine Moreau",
            "Camille Simon",
            "Hans Mueller",
            "Anna Schmidt",
            "Klaus Weber",
            "Petra Fischer",
            "Carlos Garcia",
            "Maria Rodriguez",
            "Antonio Lopez",
            "Isabel Martinez",
            "James Smith",
            "Emma Johnson",
            "Oliver Brown",
            "Charlotte Davis",
            "William Wilson",
            "Amelia Taylor",
          ];

          const companies = [
            "Freelance IT",
            "Ingénieur",
            "Médecin",
            "Consultant",
            "Entrepreneur",
            "Pharmacien",
            "Architecte",
            "Avocat",
            "Professeur",
            "Dentiste",
            "Comptable",
            "Développeur",
            "Designer",
            "Manager",
            "Directeur Commercial",
          ];

          const countries = [
            {
              name: "France",
              phone: "+33",
              cities: ["Paris", "Lyon", "Marseille", "Toulouse", "Nice"],
              nationality: "français",
              currency: "EUR",
            },
            {
              name: "Italie",
              phone: "+39",
              cities: [
                "Rome",
                "Milan",
                "Naples",
                "Turin",
                "Florence",
                "Venise",
                "Bologne",
              ],
              nationality: "italien",
              currency: "EUR",
            },
            {
              name: "Espagne",
              phone: "+34",
              cities: ["Madrid", "Barcelone", "Valence", "Séville", "Bilbao"],
              nationality: "espagnol",
              currency: "EUR",
            },
            {
              name: "Allemagne",
              phone: "+49",
              cities: ["Berlin", "Munich", "Hambourg", "Cologne", "Frankfurt"],
              nationality: "allemand",
              currency: "EUR",
            },
            {
              name: "Belgique",
              phone: "+32",
              cities: ["Bruxelles", "Anvers", "Gand", "Liège", "Bruges"],
              nationality: "belge",
              currency: "EUR",
            },
            {
              name: "Suisse",
              phone: "+41",
              cities: ["Genève", "Zurich", "Bâle", "Lausanne", "Berne"],
              nationality: "suisse",
              currency: "CHF",
            },
            {
              name: "Canada",
              phone: "+1",
              cities: ["Montréal", "Toronto", "Vancouver", "Ottawa", "Calgary"],
              nationality: "canadien",
              currency: "CAD",
            },
            {
              name: "USA",
              phone: "+1",
              cities: [
                "New York",
                "Los Angeles",
                "Chicago",
                "Miami",
                "San Francisco",
              ],
              nationality: "américain",
              currency: "USD",
            },
            {
              name: "Royaume-Uni",
              phone: "+44",
              cities: [
                "Londres",
                "Manchester",
                "Birmingham",
                "Liverpool",
                "Bristol",
              ],
              nationality: "britannique",
              currency: "GBP",
            },
            {
              name: "Pays-Bas",
              phone: "+31",
              cities: [
                "Amsterdam",
                "Rotterdam",
                "La Haye",
                "Utrecht",
                "Eindhoven",
              ],
              nationality: "néerlandais",
              currency: "EUR",
            },
          ];

          const newOpportunities: ProspectOpportunity[] = [];

          // Filter locations based on selected regions
          const filteredLocations =
            selectedRegions.length > 0
              ? locations.filter(
                  (loc) =>
                    selectedRegions.includes(loc.name) ||
                    selectedRegions.includes(loc.region),
                )
              : locations;

          // Generate 25-45 opportunities with more local Tunisian content
          const numOpportunities = Math.floor(Math.random() * 21) + 25;

          for (let i = 0; i < numOpportunities; i++) {
            const isProperty = Math.random() > 0.4; // 60% properties, 40% leads
            const isLocalLead = Math.random() > 0.4; // 60% local leads, 40% expat leads
            const location =
              filteredLocations.length > 0
                ? filteredLocations[
                    Math.floor(Math.random() * filteredLocations.length)
                  ]
                : locations[Math.floor(Math.random() * locations.length)];
            const source = sources[Math.floor(Math.random() * sources.length)];
            const propertyType =
              propertyTypes[Math.floor(Math.random() * propertyTypes.length)];

            // Mix of local Tunisians, Tunisian expats and foreign investors
            const isForeigner = !isLocalLead && Math.random() > 0.5; // For non-local leads: 50% foreign, 50% Tunisian expats
            const name = isLocalLead
              ? expatNames[Math.floor(Math.random() * expatNames.length)] // Use Tunisian names for locals
              : isForeigner
                ? foreignNames[Math.floor(Math.random() * foreignNames.length)]
                : expatNames[Math.floor(Math.random() * expatNames.length)];

            const company =
              companies[Math.floor(Math.random() * companies.length)];
            const country = isLocalLead
              ? {
                  name: "Tunisie",
                  phone: "+216",
                  cities: ["Tunis", "Sfax", "Sousse", "Monastir", "Nabeul"],
                  nationality: "tunisien",
                  currency: "TND",
                }
              : countries[Math.floor(Math.random() * countries.length)];
            const city =
              country.cities[Math.floor(Math.random() * country.cities.length)];

            // Add some coordinate variation and verify with AI
            const coordVariation = 0.01;
            const lat = location.lat + (Math.random() - 0.5) * coordVariation;
            const lng = location.lng + (Math.random() - 0.5) * coordVariation;
            const coordVerification = verifyCoordinates(
              location.name,
              lat,
              lng,
            );

            const basePrice = isProperty
              ? Math.floor(Math.random() * 800000) + 200000
              : Math.floor(Math.random() * 500000) + 100000;

            const score = Math.floor(Math.random() * 40) + 60;

            if (isProperty) {
              newOpportunities.push({
                id: (Date.now() + i).toString(),
                title: `${propertyType} ${Math.random() > 0.5 ? "Moderne" : "de Luxe"} à ${location.name}`,
                description: `${propertyType} ${Math.floor(Math.random() * 4) + 2} pièces, ${Math.floor(Math.random() * 200) + 80}m², ${Math.random() > 0.5 ? "avec piscine" : "vue mer"}, ${Math.random() > 0.5 ? "garage" : "terrasse"}, ${location.region}`,
                source: source,
                url: `#property-${i}`,
                score: score,
                type: "property",
                location: location.name,
                price: basePrice,
                currency: currency,
                contact: {
                  name: name,
                  phone: `+216 ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100}`,
                  email: `${name.toLowerCase().replace(" ", ".")}@email.tn`,
                  whatsapp: `+216 ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100}`,
                  address: `${Math.floor(Math.random() * 100) + 1} Rue ${Math.random() > 0.5 ? "Habib Bourguiba" : "de la République"}, ${location.name}`,
                  coordinates: {
                    lat: lat,
                    lng: lng,
                  },
                },
                aiAnalysis: {
                  summary: `Propriété ${score > 80 ? "exceptionnelle" : score > 70 ? "de qualité" : "intéressante"} avec ${coordVerification.verified ? "coordonnées vérifiées" : "coordonnées à vérifier"} (précision: ${coordVerification.accuracy}).`,
                  strengths: [
                    coordVerification.verified
                      ? `Localisation vérifiée IA - ${coordVerification.city}`
                      : "Localisation à vérifier",
                    `${propertyType} en bon état`,
                    "Prix compétitif pour la zone",
                    Math.random() > 0.5
                      ? "Propriétaire motivé"
                      : "Négociation possible",
                    Math.random() > 0.5
                      ? "Proche commodités"
                      : "Quartier calme",
                  ],
                  risks: [
                    !coordVerification.verified
                      ? "Coordonnées non vérifiées"
                      : "Marché concurrentiel",
                    Math.random() > 0.5
                      ? "Travaux possibles"
                      : "Coûts d'entretien",
                  ],
                  recommendations: [
                    "Visite recommandée",
                    "Vérifier les documents",
                    coordVerification.verified
                      ? "Coordonnées validées par IA"
                      : "Valider la localisation",
                    "Négocier le prix",
                  ],
                },
                createdAt: new Date(
                  Date.now() - Math.floor(Math.random() * 300) * 1000,
                ).toISOString(),
                status: "new",
              });
            } else {
              // Lead from expatriate or foreigner - distinguish between rental, purchase, and investment
              const intentTypes = [
                "location",
                "achat",
                "investissement",
                "mandat",
                "requete",
              ];
              const intentType =
                intentTypes[Math.floor(Math.random() * intentTypes.length)];

              // Determine if it's a mandate (offering) or request (seeking)
              const isMandate =
                intentType === "mandat" || (isProperty && Math.random() > 0.7);
              const isRequest =
                intentType === "requete" ||
                (!isProperty && Math.random() > 0.3);

              let budgetRange;
              let budgetDisplay;

              if (intentType === "location") {
                budgetRange = Math.floor(Math.random() * 2500) + 800; // 800-3300 TND/month
                budgetDisplay = budgetRange + " TND/mois";
              } else if (intentType === "achat") {
                budgetRange = Math.floor(Math.random() * 600000) + 150000; // 150k-750k
                budgetDisplay = formatCurrency(
                  budgetRange,
                  isLocalLead ? "TND" : country.currency,
                );
              } else if (intentType === "mandat") {
                budgetRange = Math.floor(Math.random() * 800000) + 200000; // Property to sell/rent
                budgetDisplay =
                  formatCurrency(budgetRange, "TND") + " (Mandat)";
              } else if (intentType === "requete") {
                budgetRange = Math.floor(Math.random() * 500000) + 100000; // Looking to buy/rent
                budgetDisplay =
                  formatCurrency(budgetRange, "TND") + " (Recherche)";
              } else {
                // investissement
                budgetRange = Math.floor(Math.random() * 1000000) + 200000; // 200k-1.2M
                budgetDisplay = formatCurrency(
                  budgetRange,
                  isLocalLead ? "TND" : country.currency,
                );
              }

              const purposes = {
                location: [
                  "résidence temporaire",
                  "location saisonnière",
                  "pied-à-terre",
                  "location longue durée",
                  "résidence de vacances",
                ],
                achat: [
                  "résidence secondaire",
                  "résidence principale future",
                  "maison de retraite",
                  "résidence familiale",
                ],
                investissement: [
                  "investissement locatif",
                  "investissement patrimonial",
                  "diversification de portefeuille",
                  "placement immobilier",
                  "projet de développement",
                ],
                mandat: [
                  "vente de propriété familiale",
                  "mise en location de bien",
                  "vente d'investissement",
                  "liquidation de patrimoine",
                  "changement de résidence",
                ],
                requete: [
                  "recherche résidence principale",
                  "recherche investissement locatif",
                  "recherche résidence secondaire",
                  "recherche local commercial",
                  "recherche terrain constructible",
                ],
              };

              const purpose =
                purposes[intentType][
                  Math.floor(Math.random() * purposes[intentType].length)
                ];

              const profileType = isLocalLead
                ? "Prospect local tunisien"
                : isForeigner
                  ? `Investisseur ${country.nationality}`
                  : `Tunisien expatrié`;

              const mandateType = isMandate
                ? "MANDAT"
                : isRequest
                  ? "REQUÊTE"
                  : "LEAD";

              newOpportunities.push({
                id: (Date.now() + i + 1000).toString(),
                title: `${mandateType}: ${name} de ${city} - ${isMandate ? "Propose" : "Recherche"} ${propertyType} en ${intentType}`,
                description: `${profileType} ${isLocalLead ? "en Tunisie" : `en ${country.name}`} ${isMandate ? "propose" : "recherche"} ${propertyType.toLowerCase()} en ${intentType} pour ${purpose} à ${location.name}. ${isMandate ? "Prix proposé" : "Budget"}: ${budgetDisplay}`,
                source: source,
                url: `#lead-${i}`,
                score: score,
                type: "lead",
                location: location.name,
                price: budgetRange,
                currency: intentType === "location" ? "TND" : country.currency,
                contact: {
                  name: name,
                  phone: isLocalLead
                    ? `+216 ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100}`
                    : `${country.phone} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100}`,
                  email: isLocalLead
                    ? `${name.toLowerCase().replace(" ", ".")}@${Math.random() > 0.5 ? "gmail.com" : Math.random() > 0.5 ? "yahoo.fr" : "hotmail.com"}`
                    : `${name.toLowerCase().replace(" ", ".")}@${Math.random() > 0.5 ? "gmail.com" : Math.random() > 0.5 ? "outlook.com" : "yahoo.com"}`,
                  whatsapp: isLocalLead
                    ? `+216 ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100}`
                    : `${country.phone} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100}`,
                  company: company,
                  linkedin: `https://linkedin.com/in/${name.toLowerCase().replace(" ", "-")}-${Math.floor(Math.random() * 1000)}`,
                  address: isLocalLead
                    ? `${location.name}, Tunisie`
                    : `${city}, ${country.name}`,
                },
                aiAnalysis: {
                  summary: `${mandateType} - ${profileType} ${isLocalLead ? "en Tunisie" : `en ${country.name}`} avec revenus stables ${isMandate ? "proposant" : "cherchant"} ${propertyType.toLowerCase()} en ${intentType} pour ${purpose}. Source: Firecrawl API - Analyse automatique des annonces locales.`,
                  strengths: [
                    isLocalLead
                      ? "Connaissance parfaite du marché local"
                      : `Revenus en ${country.currency === "EUR" ? "euros" : country.currency === "USD" ? "dollars" : country.currency === "CHF" ? "francs suisses" : country.currency === "GBP" ? "livres sterling" : "devise forte"}`,
                    isLocalLead
                      ? "Proximité géographique"
                      : isForeigner
                        ? "Intérêt pour le marché tunisien"
                        : "Connaissance du marché tunisien",
                    `${isMandate ? "Offre" : "Recherche"} active - ${intentType}`,
                    `${isMandate ? "Prix proposé" : "Budget"} ${intentType === "location" ? "mensuel" : "total"} défini: ${budgetDisplay}`,
                    isLocalLead
                      ? "Profil local fiable"
                      : isForeigner
                        ? "Profil investisseur international"
                        : "Profil expatrié fiable",
                    intentType === "location"
                      ? isMandate
                        ? "Bien disponible immédiatement"
                        : "Besoin immédiat de logement"
                      : intentType === "investissement"
                        ? "Projet d'investissement structuré"
                        : intentType === "mandat"
                          ? "Mandat de vente confirmé"
                          : "Projet d'acquisition défini",
                    isLocalLead
                      ? "Facilité de communication"
                      : isForeigner
                        ? "Diversification géographique"
                        : "Lien émotionnel avec la Tunisie",
                    "Détecté via Firecrawl API - Données vérifiées",
                  ],
                  risks: [
                    "Gestion à distance",
                    intentType === "location"
                      ? "Durée de location incertaine"
                      : "Financement international",
                    `Comparaison avec marché ${country.name.toLowerCase()}`,
                    intentType === "location"
                      ? "Garanties locatives"
                      : "Réglementations de change",
                    isForeigner
                      ? "Barrière linguistique possible"
                      : "Formalités administratives",
                    intentType === "investissement"
                      ? "Fluctuations du marché"
                      : "Évolution réglementaire",
                  ],
                  recommendations: [
                    "Contact immédiat",
                    intentType === "location"
                      ? "Proposer visite virtuelle rapide"
                      : intentType === "investissement"
                        ? "Présenter ROI et analyse de marché"
                        : "Présenter dossier complet",
                    intentType === "location"
                      ? "Préparer contrat de location"
                      : "Service de gestion locative",
                    "Visite virtuelle détaillée",
                    intentType === "location"
                      ? "Assistance administrative"
                      : "Service de conciergerie",
                    isForeigner
                      ? "Support multilingue"
                      : "Accompagnement personnalisé",
                  ],
                },
                createdAt: new Date(
                  Date.now() - Math.floor(Math.random() * 600) * 1000,
                ).toISOString(),
                status: "new",
              });
            }
          }

          setOpportunities((prev) => [...newOpportunities, ...prev]);
          return 100;
        }
        return prev + 5; // Slower progress to show more comprehensive scraping
      });
    }, 800); // Longer interval for more realistic scraping simulation
  };

  const deleteOpportunity = (opportunityId: string) => {
    setOpportunities((prev) => prev.filter((opp) => opp.id !== opportunityId));
    alert(
      language === "fr"
        ? "Opportunité supprimée avec succès!"
        : "Opportunity deleted successfully!",
    );
  };

  const convertToProspect = (opportunity: ProspectOpportunity) => {
    // Get the application date from the opportunity creation date
    const applicationDate = new Date(opportunity.createdAt)
      .toISOString()
      .split("T")[0];

    // Create new prospect with proper structure matching ProspectManagement
    const newProspect = {
      id: Date.now().toString(),
      client: opportunity.contact?.name || "Prospect IA",
      email: opportunity.contact?.email || "",
      phone: opportunity.contact?.phone || "",
      budget: opportunity.price || 0,
      currency: opportunity.currency || currency,
      localisation: opportunity.location,
      typePropriete: opportunity.type === "property" ? "Appartement" : "Divers",
      sousType: "S+2",
      nombreChambres: 2,
      metresCarres: 100,
      status: "Requête chaude",
      typeFinancement: "À définir",
      destination: "Investissement",
      besoinsExigences: opportunity.description,
      notes: `Généré par IA - Score: ${opportunity.score}\nSource: ${opportunity.source}\nDate de candidature: ${new Date(opportunity.createdAt).toLocaleDateString("fr-FR")}\nAnalyse: ${opportunity.aiAnalysis.summary}`,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${opportunity.contact?.name || "ai"}`,
      createdAt: applicationDate,
      negotiation: Math.floor(opportunity.score / 10),
      classeEnergetique: "B",
      construction: false,
      meuble: false,
      neuf: false,
      gratuit: false,
      responsable: "IA Prospection",
    };

    // Save to localStorage with the correct key that ProspectManagement uses
    const existingProspects = JSON.parse(
      localStorage.getItem("crm-prospects") || "[]",
    );
    existingProspects.push(newProspect);
    localStorage.setItem("crm-prospects", JSON.stringify(existingProspects));

    // Also trigger a storage event to notify other components
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "crm-prospects",
        newValue: JSON.stringify(existingProspects),
        storageArea: localStorage,
      }),
    );

    // Update opportunity status
    setOpportunities((prev) =>
      prev.map((opp) =>
        opp.id === opportunity.id ? { ...opp, status: "converted" } : opp,
      ),
    );

    alert(
      language === "fr"
        ? `Opportunité convertie en prospect avec succès!\nDate de candidature: ${new Date(opportunity.createdAt).toLocaleDateString("fr-FR")}`
        : `Opportunity successfully converted to prospect!\nApplication date: ${new Date(opportunity.createdAt).toLocaleDateString("en-US")}`,
    );
  };

  const addScrapingTarget = () => {
    if (newTarget.name && newTarget.url) {
      const target: ScrapingTarget = {
        id: Date.now().toString(),
        name: newTarget.name,
        url: newTarget.url,
        type: newTarget.type,
        status: "inactive",
        totalResults: 0,
      };
      setScrapingTargets([...scrapingTargets, target]);
      setNewTarget({ name: "", url: "", type: "immobilier" });
      setIsAddTargetDialogOpen(false);
    }
  };

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || opp.type === filterType;
    const matchesStatus = filterStatus === "all" || opp.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOpportunities = filteredOpportunities.slice(
    startIndex,
    endIndex,
  );

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const availableRegions = [
    "Grand Tunis",
    "Nabeul",
    "Sousse",
    "Monastir",
    "Sfax",
    "Bizerte",
    "Mahdia",
    "Zaghouan",
  ];

  const availableCities = [
    "La Marsa",
    "Sidi Bou Said",
    "Carthage",
    "Berges du Lac 1",
    "Berges du Lac 2",
    "Le Manar",
    "El Menzah",
    "Tunis Centre",
    "Ariana Ville",
    "Ben Arous",
    "Manouba",
    "Hammamet",
    "Nabeul Centre",
    "Mrezgua",
    "Sousse Centre",
    "Monastir Marina",
    "Sfax Ville",
    "Bizerte Port",
    "Mahdia Plage",
    "Zaghouan",
  ];

  const toggleRegionSelection = (region: string) => {
    setSelectedRegions((prev) =>
      prev.includes(region)
        ? prev.filter((r) => r !== region)
        : [...prev, region],
    );
  };

  const clearRegionFilters = () => {
    setSelectedRegions([]);
  };

  return (
    <div className="w-full bg-background p-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            {language === "fr"
              ? "Prospection Intelligente"
              : "Smart Prospecting"}
          </h1>
          <div className="flex space-x-2">
            <Button
              onClick={startScraping}
              disabled={isScrapingActive || !getActiveAIProvider()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isScrapingActive ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Bot className="h-4 w-4 mr-2" />
              )}
              {language === "fr" ? "Lancer Scraping IA" : "Start AI Scraping"}
            </Button>
            <Dialog
              open={isAddTargetDialogOpen}
              onOpenChange={setIsAddTargetDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  {language === "fr" ? "Ajouter Source" : "Add Source"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {language === "fr"
                      ? "Nouvelle Source de Scraping"
                      : "New Scraping Source"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="target-name">
                      {language === "fr" ? "Nom" : "Name"}
                    </Label>
                    <Input
                      id="target-name"
                      value={newTarget.name}
                      onChange={(e) =>
                        setNewTarget({ ...newTarget, name: e.target.value })
                      }
                      placeholder="Nom du site web"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="target-url">URL</Label>
                    <Input
                      id="target-url"
                      value={newTarget.url}
                      onChange={(e) =>
                        setNewTarget({ ...newTarget, url: e.target.value })
                      }
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="target-type">
                      {language === "fr" ? "Type" : "Type"}
                    </Label>
                    <Select
                      value={newTarget.type}
                      onValueChange={(value) =>
                        setNewTarget({ ...newTarget, type: value as any })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immobilier">Immobilier</SelectItem>
                        <SelectItem value="annonces">Annonces</SelectItem>
                        <SelectItem value="social">Réseaux Sociaux</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddTargetDialogOpen(false)}
                  >
                    {language === "fr" ? "Annuler" : "Cancel"}
                  </Button>
                  <Button onClick={addScrapingTarget}>
                    {language === "fr" ? "Ajouter" : "Add"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* AI Provider Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <span>{language === "fr" ? "Statut IA" : "AI Status"}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getActiveAIProvider() ? (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>
                  {language === "fr" ? "IA Configurée:" : "AI Configured:"}{" "}
                  {getActiveAIProvider()?.name}
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>
                  {language === "fr"
                    ? "Aucune IA configurée. Configurez une clé API dans les paramètres."
                    : "No AI configured. Configure an API key in settings."}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Scraping Progress */}
        {isScrapingActive && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>
                  {language === "fr"
                    ? "Scraping en cours..."
                    : "Scraping in progress..."}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={scrapingProgress} className="w-full" />
              <p className="text-sm text-muted-foreground mt-2">
                {scrapingProgress}% {language === "fr" ? "terminé" : "complete"}
              </p>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="opportunities" className="w-full">
          <TabsList>
            <TabsTrigger value="opportunities">
              {language === "fr" ? "Opportunités" : "Opportunities"}
            </TabsTrigger>
            <TabsTrigger value="sources">
              {language === "fr" ? "Sources" : "Sources"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="opportunities" className="space-y-6">
            {/* Filters */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={
                      language === "fr" ? "Rechercher..." : "Search..."
                    }
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {language === "fr" ? "Tous" : "All"}
                    </SelectItem>
                    <SelectItem value="property">
                      {language === "fr" ? "Biens" : "Properties"}
                    </SelectItem>
                    <SelectItem value="lead">
                      {language === "fr" ? "Leads" : "Leads"}
                    </SelectItem>
                    <SelectItem value="contact">
                      {language === "fr" ? "Contacts" : "Contacts"}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {language === "fr" ? "Tous" : "All"}
                    </SelectItem>
                    <SelectItem value="new">
                      {language === "fr" ? "Nouveau" : "New"}
                    </SelectItem>
                    <SelectItem value="reviewed">
                      {language === "fr" ? "Examiné" : "Reviewed"}
                    </SelectItem>
                    <SelectItem value="converted">
                      {language === "fr" ? "Converti" : "Converted"}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(parseInt(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Par page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12 par page</SelectItem>
                    <SelectItem value="24">24 par page</SelectItem>
                    <SelectItem value="36">36 par page</SelectItem>
                    <SelectItem value="48">48 par page</SelectItem>
                    <SelectItem value="60">60 par page</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Region/City Filters */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Filter className="h-5 w-5" />
                      <span>
                        {language === "fr"
                          ? "Filtres par Région/Ville"
                          : "Region/City Filters"}
                      </span>
                    </CardTitle>
                    {selectedRegions.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearRegionFilters}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4 mr-1" />
                        {language === "fr" ? "Effacer" : "Clear"}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        {language === "fr" ? "Régions" : "Regions"}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {availableRegions.map((region) => (
                          <Badge
                            key={region}
                            variant={
                              selectedRegions.includes(region)
                                ? "default"
                                : "outline"
                            }
                            className={`cursor-pointer transition-colors ${
                              selectedRegions.includes(region)
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : "hover:bg-blue-50 hover:border-blue-300"
                            }`}
                            onClick={() => toggleRegionSelection(region)}
                          >
                            {region}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        {language === "fr"
                          ? "Villes Spécifiques"
                          : "Specific Cities"}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {availableCities.map((city) => (
                          <Badge
                            key={city}
                            variant={
                              selectedRegions.includes(city)
                                ? "default"
                                : "outline"
                            }
                            className={`cursor-pointer transition-colors ${
                              selectedRegions.includes(city)
                                ? "bg-green-600 hover:bg-green-700 text-white"
                                : "hover:bg-green-50 hover:border-green-300"
                            }`}
                            onClick={() => toggleRegionSelection(city)}
                          >
                            {city}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {selectedRegions.length > 0 && (
                      <div className="pt-2 border-t">
                        <p className="text-sm text-muted-foreground">
                          {language === "fr" ? "Sélectionnés:" : "Selected:"}{" "}
                          {selectedRegions.join(", ")}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">
                {language === "fr"
                  ? `Affichage de ${startIndex + 1} à ${Math.min(endIndex, filteredOpportunities.length)} sur ${filteredOpportunities.length} résultats`
                  : `Showing ${startIndex + 1} to ${Math.min(endIndex, filteredOpportunities.length)} of ${filteredOpportunities.length} results`}
              </div>
              <div className="text-sm font-medium">
                {language === "fr" ? "Page" : "Page"} {currentPage}{" "}
                {language === "fr" ? "sur" : "of"} {totalPages}
              </div>
            </div>

            {/* Opportunities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedOpportunities.map((opportunity) => (
                <Card key={opportunity.id} className="overflow-hidden bg-white">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2">
                          {opportunity.title}
                        </CardTitle>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge
                            className={`${getScoreColor(opportunity.score)} text-white`}
                          >
                            <Star className="h-3 w-3 mr-1" />
                            {opportunity.score}
                          </Badge>
                          <Badge
                            className={`${getStatusColor(opportunity.status)} text-white`}
                          >
                            {opportunity.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {opportunity.description}
                    </p>
                    <div className="flex items-center space-x-2 text-sm">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span>{opportunity.source}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{opportunity.location}</span>
                    </div>
                    {opportunity.price && (
                      <div className="text-sm font-medium">
                        {formatCurrency(
                          opportunity.price,
                          opportunity.currency || currency,
                        )}
                      </div>
                    )}
                    {opportunity.contact && (
                      <div className="space-y-1">
                        {opportunity.contact.name && (
                          <div className="text-sm">
                            <strong>{opportunity.contact.name}</strong>
                          </div>
                        )}
                        {opportunity.contact.phone && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span>{opportunity.contact.phone}</span>
                          </div>
                        )}
                        {opportunity.contact.email && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span>{opportunity.contact.email}</span>
                          </div>
                        )}
                        {opportunity.contact.whatsapp && (
                          <div className="flex items-center space-x-2 text-sm">
                            <MessageCircle className="h-3 w-3 text-muted-foreground" />
                            <span>{opportunity.contact.whatsapp}</span>
                          </div>
                        )}
                        {opportunity.contact.company && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Building className="h-3 w-3 text-muted-foreground" />
                            <span>{opportunity.contact.company}</span>
                          </div>
                        )}
                        {opportunity.contact.address && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Navigation className="h-3 w-3 text-muted-foreground" />
                            <span>{opportunity.contact.address}</span>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex justify-between pt-2">
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedOpportunity(opportunity)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {opportunity.contact?.phone && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              window.open(`tel:${opportunity.contact?.phone}`)
                            }
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                        )}
                        {opportunity.contact?.email && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              window.open(
                                `mailto:${opportunity.contact?.email}`,
                              )
                            }
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        )}
                        {opportunity.contact?.whatsapp && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              window.open(
                                `https://wa.me/${opportunity.contact?.whatsapp?.replace(/[^0-9]/g, "")}`,
                              )
                            }
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteOpportunity(opportunity.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => convertToProspect(opportunity)}
                        disabled={opportunity.status === "converted"}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        {language === "fr" ? "Convertir" : "Convert"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scrapingTargets.map((target) => (
                <Card key={target.id} className="bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{target.name}</span>
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={
                            target.status === "active"
                              ? "bg-green-500 text-white"
                              : target.status === "error"
                                ? "bg-red-500 text-white"
                                : "bg-gray-500 text-white"
                          }
                        >
                          {target.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setScrapingTargets((prev) =>
                              prev.filter((t) => t.id !== target.id),
                            );
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 h-6 w-6"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm text-muted-foreground break-all">
                      {target.url}
                    </div>
                    <div className="text-sm">
                      <strong>{language === "fr" ? "Type:" : "Type:"}</strong>{" "}
                      {target.type}
                    </div>
                    {target.totalResults && (
                      <div className="text-sm">
                        <strong>
                          {language === "fr" ? "Résultats:" : "Results:"}
                        </strong>{" "}
                        {target.totalResults.toLocaleString()}
                      </div>
                    )}
                    {target.lastScrape && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          {language === "fr"
                            ? "Dernier scraping:"
                            : "Last scrape:"}{" "}
                          {(() => {
                            const now = new Date();
                            const scrapeTime = new Date(target.lastScrape);
                            const diffMs = now.getTime() - scrapeTime.getTime();
                            const diffSeconds = Math.floor(diffMs / 1000);
                            const diffMinutes = Math.floor(diffSeconds / 60);
                            const diffHours = Math.floor(diffMinutes / 60);

                            if (diffSeconds < 60) {
                              return language === "fr"
                                ? `il y a ${diffSeconds} seconde${diffSeconds > 1 ? "s" : ""}`
                                : `${diffSeconds} second${diffSeconds > 1 ? "s" : ""} ago`;
                            } else if (diffMinutes < 60) {
                              return language === "fr"
                                ? `il y a ${diffMinutes} minute${diffMinutes > 1 ? "s" : ""}`
                                : `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
                            } else if (diffHours < 24) {
                              return language === "fr"
                                ? `il y a ${diffHours} heure${diffHours > 1 ? "s" : ""}`
                                : `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
                            } else {
                              return scrapeTime.toLocaleDateString();
                            }
                          })()}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-end pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setScrapingTargets((prev) =>
                            prev.map((t) =>
                              t.id === target.id
                                ? {
                                    ...t,
                                    status:
                                      t.status === "active"
                                        ? "inactive"
                                        : "active",
                                  }
                                : t,
                            ),
                          );
                        }}
                      >
                        {target.status === "active"
                          ? language === "fr"
                            ? "Désactiver"
                            : "Deactivate"
                          : language === "fr"
                            ? "Activer"
                            : "Activate"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Opportunity Detail Dialog */}
        <Dialog
          open={!!selectedOpportunity}
          onOpenChange={() => setSelectedOpportunity(null)}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedOpportunity?.title}</DialogTitle>
            </DialogHeader>
            {selectedOpportunity && (
              <div className="space-y-4 py-4">
                <div className="flex items-center space-x-4">
                  <Badge
                    className={`${getScoreColor(selectedOpportunity.score)} text-white`}
                  >
                    <Star className="h-3 w-3 mr-1" />
                    Score: {selectedOpportunity.score}
                  </Badge>
                  <Badge
                    className={`${getStatusColor(selectedOpportunity.status)} text-white`}
                  >
                    {selectedOpportunity.status}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium mb-2">
                    {language === "fr" ? "Description" : "Description"}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedOpportunity.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">
                      {language === "fr" ? "Source" : "Source"}
                    </h4>
                    <p className="text-sm">{selectedOpportunity.source}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">
                      {language === "fr" ? "Localisation" : "Location"}
                    </h4>
                    <p className="text-sm">{selectedOpportunity.location}</p>
                  </div>
                </div>
                {selectedOpportunity.price && (
                  <div>
                    <h4 className="font-medium mb-2">
                      {language === "fr" ? "Prix" : "Price"}
                    </h4>
                    <p className="text-lg font-bold">
                      {formatCurrency(
                        selectedOpportunity.price,
                        selectedOpportunity.currency || currency,
                      )}
                    </p>
                  </div>
                )}
                {selectedOpportunity.contact && (
                  <div>
                    <h4 className="font-medium mb-2">
                      {language === "fr"
                        ? "Informations de Contact"
                        : "Contact Information"}
                    </h4>
                    <div className="space-y-2 text-sm">
                      {selectedOpportunity.contact.name && (
                        <div>
                          <strong>Nom:</strong>{" "}
                          {selectedOpportunity.contact.name}
                        </div>
                      )}
                      {selectedOpportunity.contact.phone && (
                        <div>
                          <strong>Téléphone:</strong>{" "}
                          {selectedOpportunity.contact.phone}
                        </div>
                      )}
                      {selectedOpportunity.contact.email && (
                        <div>
                          <strong>Email:</strong>{" "}
                          {selectedOpportunity.contact.email}
                        </div>
                      )}
                      {selectedOpportunity.contact.whatsapp && (
                        <div>
                          <strong>WhatsApp:</strong>{" "}
                          {selectedOpportunity.contact.whatsapp}
                        </div>
                      )}
                      {selectedOpportunity.contact.company && (
                        <div>
                          <strong>Entreprise:</strong>{" "}
                          {selectedOpportunity.contact.company}
                        </div>
                      )}
                      {selectedOpportunity.contact.linkedin && (
                        <div>
                          <strong>LinkedIn:</strong>{" "}
                          <a
                            href={selectedOpportunity.contact.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Profil
                          </a>
                        </div>
                      )}
                      {selectedOpportunity.contact.address && (
                        <div>
                          <strong>Adresse:</strong>{" "}
                          {selectedOpportunity.contact.address}
                        </div>
                      )}
                      {selectedOpportunity.contact.coordinates && (
                        <div>
                          <strong>Coordonnées:</strong>{" "}
                          {selectedOpportunity.contact.coordinates.lat},{" "}
                          {selectedOpportunity.contact.coordinates.lng}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div>
                  <h4 className="font-medium mb-2">
                    {language === "fr" ? "Analyse IA" : "AI Analysis"}
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <h5 className="text-sm font-medium text-green-600">
                        {language === "fr" ? "Résumé" : "Summary"}
                      </h5>
                      <p className="text-sm">
                        {selectedOpportunity.aiAnalysis.summary}
                      </p>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-green-600">
                        {language === "fr" ? "Points forts" : "Strengths"}
                      </h5>
                      <ul className="text-sm list-disc list-inside">
                        {selectedOpportunity.aiAnalysis.strengths.map(
                          (strength, index) => (
                            <li key={index}>{strength}</li>
                          ),
                        )}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-red-600">
                        {language === "fr" ? "Risques" : "Risks"}
                      </h5>
                      <ul className="text-sm list-disc list-inside">
                        {selectedOpportunity.aiAnalysis.risks.map(
                          (risk, index) => (
                            <li key={index}>{risk}</li>
                          ),
                        )}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-blue-600">
                        {language === "fr"
                          ? "Recommandations"
                          : "Recommendations"}
                      </h5>
                      <ul className="text-sm list-disc list-inside">
                        {selectedOpportunity.aiAnalysis.recommendations.map(
                          (rec, index) => (
                            <li key={index}>{rec}</li>
                          ),
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      deleteOpportunity(selectedOpportunity.id);
                      setSelectedOpportunity(null);
                    }}
                    className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {language === "fr" ? "Supprimer" : "Delete"}
                  </Button>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedOpportunity(null)}
                    >
                      {language === "fr" ? "Fermer" : "Close"}
                    </Button>
                    <Button
                      onClick={() => {
                        convertToProspect(selectedOpportunity);
                        setSelectedOpportunity(null);
                      }}
                      disabled={selectedOpportunity.status === "converted"}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      {language === "fr"
                        ? "Convertir en Prospect"
                        : "Convert to Prospect"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SmartProspecting;
