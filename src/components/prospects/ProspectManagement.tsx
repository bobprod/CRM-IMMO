import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Upload,
  Edit,
  Trash2,
  Home,
  Users,
  Clock,
} from "lucide-react";

interface Requete {
  id: string;
  client: string;
  email: string;
  phone: string;
  budget: number;
  currency: string;
  localisation: string;
  typePropriete: string;
  sousType: string;
  nombreChambres: number;
  metresCarres: number;
  status: string;
  typeFinancement: string;
  destination: string;
  besoinsExigences: string;
  notes: string;
  avatarUrl: string;
  createdAt: string;
  negotiation: number;
  classeEnergetique: string;
  construction: boolean;
  meuble: boolean;
  neuf: boolean;
  gratuit: boolean;
  responsable: string;
}

interface Mandat {
  id: string;
  proprietaire: string;
  email: string;
  phone: string;
  prix: number;
  currency: string;
  localisation: string;
  typePropriete: string;
  sousType: string;
  nombreChambres: number;
  metresCarres: number;
  status: string;
  notes: string;
  avatarUrl: string;
  createdAt: string;
  propertyId?: string;
  propertyImage?: string;
  propertyTitle?: string;
}

interface Appointment {
  id: string;
  title: string;
  type: "viewing" | "signing" | "meeting" | "call";
  date: string;
  time: string;
  duration: number;
  location: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  propertyTitle?: string;
  notes: string;
  status: "scheduled" | "confirmed" | "completed" | "cancelled";
}

interface ProspectManagementProps {
  language?: string;
  currency?: string;
  onAppointmentCreated?: (appointment: Appointment) => void;
}

const ProspectManagement = ({
  language = "fr",
  currency = "TND",
  onAppointmentCreated,
}: ProspectManagementProps = {}) => {
  const [requetes, setRequetes] = useState<Requete[]>([
    {
      id: "1",
      client: "Sophie Martin",
      email: "sophie.martin@example.com",
      phone: "+216 55 123 456",
      budget: 900000,
      currency: "EUR",
      localisation: "La Marsa, Tunis",
      typePropriete: "Villa",
      sousType: "S+4",
      nombreChambres: 4,
      metresCarres: 250,
      status: "Requête chaude",
      typeFinancement: "Achat 100% avec crédit",
      destination: "Investissement",
      besoinsExigences: "Vue sur mer, parking",
      notes: "Cliente sérieuse, budget confirmé",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=sophie",
      createdAt: "2024-01-15",
      negotiation: 5,
      classeEnergetique: "B",
      construction: false,
      meuble: false,
      neuf: true,
      gratuit: false,
      responsable: "Agent Commercial",
    },
    {
      id: "2",
      client: "Ahmed Ben Ali",
      email: "ahmed.benali@example.com",
      phone: "+216 99 876 543",
      budget: 500000,
      currency: "EUR",
      localisation: "Lac 2, Tunis",
      typePropriete: "Appartement",
      sousType: "S+2",
      nombreChambres: 2,
      metresCarres: 120,
      status: "En négociation",
      typeFinancement: "Achat comptant",
      destination: "Résidence principale",
      besoinsExigences: "Moderne, ascenseur, parking",
      notes: "Première acquisition, besoin d'accompagnement",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed",
      createdAt: "2024-01-20",
      negotiation: 8,
      classeEnergetique: "A",
      construction: false,
      meuble: true,
      neuf: false,
      gratuit: false,
      responsable: "Agent Commercial",
    },
  ]);

  // Load prospects from localStorage on component mount
  useEffect(() => {
    const loadProspects = () => {
      try {
        const savedProspects = localStorage.getItem("crm-prospects");
        if (savedProspects) {
          const prospects = JSON.parse(savedProspects);
          // Merge with existing default prospects, avoiding duplicates
          const existingIds = requetes.map((r) => r.id);
          const newProspects = prospects.filter(
            (p: Requete) => !existingIds.includes(p.id),
          );
          if (newProspects.length > 0) {
            setRequetes((prev) => [...prev, ...newProspects]);
          }
        }
      } catch (error) {
        console.error("Error loading prospects:", error);
      }
    };

    loadProspects();

    // Listen for storage changes to update prospects in real-time
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "crm-prospects") {
        loadProspects();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const [mandats, setMandats] = useState<Mandat[]>([
    {
      id: "1",
      proprietaire: "Mohamed Trabelsi",
      email: "m.trabelsi@example.com",
      phone: "+216 98 765 432",
      prix: 850000,
      currency: "EUR",
      localisation: "Sidi Bou Said, Tunis",
      typePropriete: "Villa",
      sousType: "S+5",
      nombreChambres: 5,
      metresCarres: 300,
      status: "Mandat exclusif",
      notes: "Villa avec vue mer, jardin 500m²",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=mohamed",
      createdAt: "2024-01-10",
      propertyId: "MANDAT-001",
      propertyImage:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      propertyTitle: "Villa Moderne avec Piscine",
    },
  ]);

  const [activeTab, setActiveTab] = useState("requetes");
  const [isAddRequeteDialogOpen, setIsAddRequeteDialogOpen] = useState(false);
  const [isAddMandatDialogOpen, setIsAddMandatDialogOpen] = useState(false);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedContact, setSelectedContact] = useState<{
    name: string;
    type: "requete" | "mandat";
  } | null>(null);
  const [appointmentData, setAppointmentData] = useState({
    date: "",
    time: "",
    motif: "",
    type: "viewing" as "viewing" | "meeting" | "call" | "signing",
  });
  const [newRequete, setNewRequete] = useState<Partial<Requete>>({
    client: "",
    email: "",
    phone: "",
    budget: 0,
    currency: currency,
    localisation: "",
    typePropriete: "",
    sousType: "",
    nombreChambres: 0,
    metresCarres: 0,
    status: "Requête chaude",
    typeFinancement: "",
    destination: "",
    besoinsExigences: "",
    notes: "",
    negotiation: 0,
    classeEnergetique: "",
    construction: false,
    meuble: false,
    neuf: false,
    gratuit: false,
    responsable: "",
  });
  const [newMandat, setNewMandat] = useState<Partial<Mandat>>({
    proprietaire: "",
    email: "",
    phone: "",
    prix: 0,
    currency: currency,
    localisation: "",
    typePropriete: "",
    sousType: "",
    nombreChambres: 0,
    metresCarres: 0,
    status: "Mandat simple",
    notes: "",
  });

  const formatCurrency = (amount: number, curr: string) => {
    return new Intl.NumberFormat("fr-TN", {
      style: "currency",
      currency: curr,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Requête chaude":
        return "bg-red-500";
      case "En négociation":
        return "bg-orange-500";
      case "Requête froide":
        return "bg-blue-500";
      case "Convertie":
        return "bg-green-500";
      case "Mandat exclusif":
        return "bg-purple-500";
      case "Mandat simple":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleAddRequete = () => {
    const requete: Requete = {
      ...newRequete,
      id: Date.now().toString(),
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newRequete.client}`,
      createdAt: new Date().toISOString().split("T")[0],
    } as Requete;

    setRequetes([...requetes, requete]);
    setNewRequete({
      client: "",
      email: "",
      phone: "",
      budget: 0,
      currency: currency,
      localisation: "",
      typePropriete: "",
      sousType: "",
      nombreChambres: 0,
      metresCarres: 0,
      status: "Requête chaude",
      typeFinancement: "",
      destination: "",
      besoinsExigences: "",
      notes: "",
      negotiation: 0,
      classeEnergetique: "",
      construction: false,
      meuble: false,
      neuf: false,
      gratuit: false,
      responsable: "",
    });
    setIsAddRequeteDialogOpen(false);
  };

  const handleAddMandat = () => {
    const mandat: Mandat = {
      ...newMandat,
      id: Date.now().toString(),
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newMandat.proprietaire}`,
      createdAt: new Date().toISOString().split("T")[0],
    } as Mandat;

    setMandats([...mandats, mandat]);
    setNewMandat({
      proprietaire: "",
      email: "",
      phone: "",
      prix: 0,
      currency: currency,
      localisation: "",
      typePropriete: "",
      sousType: "",
      nombreChambres: 0,
      metresCarres: 0,
      status: "Mandat simple",
      notes: "",
    });
    setIsAddMandatDialogOpen(false);
  };

  const filteredRequetes = requetes.filter((requete) => {
    const matchesSearch = requete.client
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || requete.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredMandats = mandats.filter((mandat) => {
    const matchesSearch = mandat.proprietaire
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || mandat.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full bg-background p-6">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            {language === "fr"
              ? "Gestion Requêtes & Mandats"
              : "Requests & Mandates Management"}
          </h1>
        </div>

        {/* Tabs for Requêtes and Mandats */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="requetes" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {language === "fr" ? "Requêtes" : "Requests"}
              </TabsTrigger>
              <TabsTrigger value="mandats" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                {language === "fr" ? "Mandats" : "Mandates"}
              </TabsTrigger>
            </TabsList>

            <div className="flex space-x-2">
              {activeTab === "requetes" && (
                <Dialog
                  open={isAddRequeteDialogOpen}
                  onOpenChange={setIsAddRequeteDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      {language === "fr" ? "Nouvelle Requête" : "New Request"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {language === "fr" ? "Nouvelle Requête" : "New Request"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-3 gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="client">
                          {language === "fr" ? "Client" : "Client"}
                        </Label>
                        <Input
                          id="client"
                          value={newRequete.client}
                          onChange={(e) =>
                            setNewRequete({
                              ...newRequete,
                              client: e.target.value,
                            })
                          }
                          placeholder={
                            language === "fr" ? "Nom du client" : "Client name"
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newRequete.email}
                          onChange={(e) =>
                            setNewRequete({
                              ...newRequete,
                              email: e.target.value,
                            })
                          }
                          placeholder="client@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">
                          {language === "fr" ? "Téléphone" : "Phone"}
                        </Label>
                        <Input
                          id="phone"
                          value={newRequete.phone}
                          onChange={(e) =>
                            setNewRequete({
                              ...newRequete,
                              phone: e.target.value,
                            })
                          }
                          placeholder="+216 XX XXX XXX"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="budget">
                          {language === "fr" ? "Budget" : "Budget"}
                        </Label>
                        <Input
                          id="budget"
                          type="number"
                          value={newRequete.budget}
                          onChange={(e) =>
                            setNewRequete({
                              ...newRequete,
                              budget: Number(e.target.value),
                            })
                          }
                          placeholder="500000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="localisation">
                          {language === "fr" ? "Localisation" : "Location"}
                        </Label>
                        <Input
                          id="localisation"
                          value={newRequete.localisation}
                          onChange={(e) =>
                            setNewRequete({
                              ...newRequete,
                              localisation: e.target.value,
                            })
                          }
                          placeholder="Tunis, La Marsa"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="typePropriete">
                          {language === "fr"
                            ? "Type de propriété"
                            : "Property Type"}
                        </Label>
                        <Select
                          value={newRequete.typePropriete}
                          onValueChange={(value) =>
                            setNewRequete({
                              ...newRequete,
                              typePropriete: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                language === "fr"
                                  ? "Sélectionner type"
                                  : "Select type"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Villa">Villa</SelectItem>
                            <SelectItem value="Appartement">
                              Appartement
                            </SelectItem>
                            <SelectItem value="Maison">Maison</SelectItem>
                            <SelectItem value="Studio">Studio</SelectItem>
                            <SelectItem value="Commercial">
                              Commercial
                            </SelectItem>
                            <SelectItem value="Terrain">Terrain</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sousType">
                          {language === "fr" ? "Sous-type" : "Sub-type"}
                        </Label>
                        <Select
                          value={newRequete.sousType}
                          onValueChange={(value) =>
                            setNewRequete({ ...newRequete, sousType: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="S+1, S+2..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Studio">Studio</SelectItem>
                            <SelectItem value="S+1">S+1</SelectItem>
                            <SelectItem value="S+2">S+2</SelectItem>
                            <SelectItem value="S+3">S+3</SelectItem>
                            <SelectItem value="S+4">S+4</SelectItem>
                            <SelectItem value="S+5">S+5</SelectItem>
                            <SelectItem value="S+6+">S+6+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nombreChambres">
                          {language === "fr"
                            ? "Nombre de chambres"
                            : "Number of rooms"}
                        </Label>
                        <Input
                          id="nombreChambres"
                          type="number"
                          value={newRequete.nombreChambres}
                          onChange={(e) =>
                            setNewRequete({
                              ...newRequete,
                              nombreChambres: Number(e.target.value),
                            })
                          }
                          placeholder="2"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="metresCarres">
                          {language === "fr"
                            ? "Mètres carrés"
                            : "Square meters"}
                        </Label>
                        <Input
                          id="metresCarres"
                          type="number"
                          value={newRequete.metresCarres}
                          onChange={(e) =>
                            setNewRequete({
                              ...newRequete,
                              metresCarres: Number(e.target.value),
                            })
                          }
                          placeholder="120"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="typeFinancement">
                          {language === "fr"
                            ? "Type de financement"
                            : "Financing type"}
                        </Label>
                        <Select
                          value={newRequete.typeFinancement}
                          onValueChange={(value) =>
                            setNewRequete({
                              ...newRequete,
                              typeFinancement: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                language === "fr" ? "Sélectionner" : "Select"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Achat comptant">
                              Achat comptant
                            </SelectItem>
                            <SelectItem value="Achat 100% avec crédit">
                              Achat 100% avec crédit
                            </SelectItem>
                            <SelectItem value="Achat avec apport">
                              Achat avec apport
                            </SelectItem>
                            <SelectItem value="Location">Location</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="destination">
                          {language === "fr" ? "Destination" : "Purpose"}
                        </Label>
                        <Select
                          value={newRequete.destination}
                          onValueChange={(value) =>
                            setNewRequete({ ...newRequete, destination: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                language === "fr" ? "Sélectionner" : "Select"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Résidence principale">
                              Résidence principale
                            </SelectItem>
                            <SelectItem value="Résidence secondaire">
                              Résidence secondaire
                            </SelectItem>
                            <SelectItem value="Investissement">
                              Investissement
                            </SelectItem>
                            <SelectItem value="Location saisonnière">
                              Location saisonnière
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="classeEnergetique">
                          {language === "fr"
                            ? "Classe énergétique"
                            : "Energy class"}
                        </Label>
                        <Select
                          value={newRequete.classeEnergetique}
                          onValueChange={(value) =>
                            setNewRequete({
                              ...newRequete,
                              classeEnergetique: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="A, B, C..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">A</SelectItem>
                            <SelectItem value="B">B</SelectItem>
                            <SelectItem value="C">C</SelectItem>
                            <SelectItem value="D">D</SelectItem>
                            <SelectItem value="E">E</SelectItem>
                            <SelectItem value="F">F</SelectItem>
                            <SelectItem value="G">G</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-3 grid grid-cols-4 gap-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="construction"
                            checked={newRequete.construction}
                            onCheckedChange={(checked) =>
                              setNewRequete({
                                ...newRequete,
                                construction: !!checked,
                              })
                            }
                          />
                          <Label htmlFor="construction">
                            {language === "fr"
                              ? "Construction"
                              : "Construction"}
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="meuble"
                            checked={newRequete.meuble}
                            onCheckedChange={(checked) =>
                              setNewRequete({
                                ...newRequete,
                                meuble: !!checked,
                              })
                            }
                          />
                          <Label htmlFor="meuble">
                            {language === "fr" ? "Meublé" : "Furnished"}
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="neuf"
                            checked={newRequete.neuf}
                            onCheckedChange={(checked) =>
                              setNewRequete({ ...newRequete, neuf: !!checked })
                            }
                          />
                          <Label htmlFor="neuf">
                            {language === "fr" ? "Neuf/Récent" : "New/Recent"}
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="gratuit"
                            checked={newRequete.gratuit}
                            onCheckedChange={(checked) =>
                              setNewRequete({
                                ...newRequete,
                                gratuit: !!checked,
                              })
                            }
                          />
                          <Label htmlFor="gratuit">
                            {language === "fr" ? "Gratuit/Libre" : "Free"}
                          </Label>
                        </div>
                      </div>
                      <div className="col-span-3 space-y-2">
                        <Label htmlFor="besoinsExigences">
                          {language === "fr"
                            ? "Besoins/Exigences"
                            : "Needs/Requirements"}
                        </Label>
                        <Textarea
                          id="besoinsExigences"
                          value={newRequete.besoinsExigences}
                          onChange={(e) =>
                            setNewRequete({
                              ...newRequete,
                              besoinsExigences: e.target.value,
                            })
                          }
                          placeholder={
                            language === "fr"
                              ? "Détails des besoins et exigences du client..."
                              : "Client needs and requirements details..."
                          }
                        />
                      </div>
                      <div className="col-span-3 space-y-2">
                        <Label htmlFor="notes">
                          {language === "fr" ? "Notes" : "Notes"}
                        </Label>
                        <Textarea
                          id="notes"
                          value={newRequete.notes}
                          onChange={(e) =>
                            setNewRequete({
                              ...newRequete,
                              notes: e.target.value,
                            })
                          }
                          placeholder={
                            language === "fr"
                              ? "Notes additionnelles..."
                              : "Additional notes..."
                          }
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsAddRequeteDialogOpen(false)}
                      >
                        {language === "fr" ? "Annuler" : "Cancel"}
                      </Button>
                      <Button onClick={handleAddRequete}>
                        {language === "fr" ? "Ajouter" : "Add"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {activeTab === "mandats" && (
                <Dialog
                  open={isAddMandatDialogOpen}
                  onOpenChange={setIsAddMandatDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      {language === "fr" ? "Nouveau Mandat" : "New Mandate"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {language === "fr" ? "Nouveau Mandat" : "New Mandate"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="proprietaire">
                          {language === "fr" ? "Propriétaire" : "Owner"}
                        </Label>
                        <Input
                          id="proprietaire"
                          value={newMandat.proprietaire}
                          onChange={(e) =>
                            setNewMandat({
                              ...newMandat,
                              proprietaire: e.target.value,
                            })
                          }
                          placeholder={
                            language === "fr"
                              ? "Nom du propriétaire"
                              : "Owner name"
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newMandat.email}
                          onChange={(e) =>
                            setNewMandat({
                              ...newMandat,
                              email: e.target.value,
                            })
                          }
                          placeholder="proprietaire@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">
                          {language === "fr" ? "Téléphone" : "Phone"}
                        </Label>
                        <Input
                          id="phone"
                          value={newMandat.phone}
                          onChange={(e) =>
                            setNewMandat({
                              ...newMandat,
                              phone: e.target.value,
                            })
                          }
                          placeholder="+216 XX XXX XXX"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="prix">
                          {language === "fr" ? "Prix" : "Price"}
                        </Label>
                        <Input
                          id="prix"
                          type="number"
                          value={newMandat.prix}
                          onChange={(e) =>
                            setNewMandat({
                              ...newMandat,
                              prix: Number(e.target.value),
                            })
                          }
                          placeholder="850000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="localisation">
                          {language === "fr" ? "Localisation" : "Location"}
                        </Label>
                        <Input
                          id="localisation"
                          value={newMandat.localisation}
                          onChange={(e) =>
                            setNewMandat({
                              ...newMandat,
                              localisation: e.target.value,
                            })
                          }
                          placeholder="Sidi Bou Said, Tunis"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="typePropriete">
                          {language === "fr"
                            ? "Type de propriété"
                            : "Property Type"}
                        </Label>
                        <Select
                          value={newMandat.typePropriete}
                          onValueChange={(value) =>
                            setNewMandat({ ...newMandat, typePropriete: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                language === "fr"
                                  ? "Sélectionner type"
                                  : "Select type"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Villa">Villa</SelectItem>
                            <SelectItem value="Appartement">
                              Appartement
                            </SelectItem>
                            <SelectItem value="Maison">Maison</SelectItem>
                            <SelectItem value="Studio">Studio</SelectItem>
                            <SelectItem value="Commercial">
                              Commercial
                            </SelectItem>
                            <SelectItem value="Terrain">Terrain</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">
                          {language === "fr"
                            ? "Type de mandat"
                            : "Mandate type"}
                        </Label>
                        <Select
                          value={newMandat.status}
                          onValueChange={(value) =>
                            setNewMandat({ ...newMandat, status: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                language === "fr" ? "Sélectionner" : "Select"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Mandat simple">
                              Mandat simple
                            </SelectItem>
                            <SelectItem value="Mandat exclusif">
                              Mandat exclusif
                            </SelectItem>
                            <SelectItem value="Mandat semi-exclusif">
                              Mandat semi-exclusif
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="notes">
                          {language === "fr" ? "Notes" : "Notes"}
                        </Label>
                        <Textarea
                          id="notes"
                          value={newMandat.notes}
                          onChange={(e) =>
                            setNewMandat({
                              ...newMandat,
                              notes: e.target.value,
                            })
                          }
                          placeholder={
                            language === "fr"
                              ? "Description du bien, particularités..."
                              : "Property description, particularities..."
                          }
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsAddMandatDialogOpen(false)}
                      >
                        {language === "fr" ? "Annuler" : "Cancel"}
                      </Button>
                      <Button onClick={handleAddMandat}>
                        {language === "fr" ? "Ajouter" : "Add"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={language === "fr" ? "Rechercher..." : "Search..."}
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue
                  placeholder={
                    language === "fr"
                      ? "Filtrer par statut"
                      : "Filter by status"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {language === "fr" ? "Tous" : "All"}
                </SelectItem>
                {activeTab === "requetes" && (
                  <>
                    <SelectItem value="Requête chaude">
                      Requête chaude
                    </SelectItem>
                    <SelectItem value="En négociation">
                      En négociation
                    </SelectItem>
                    <SelectItem value="Requête froide">
                      Requête froide
                    </SelectItem>
                    <SelectItem value="Convertie">Convertie</SelectItem>
                  </>
                )}
                {activeTab === "mandats" && (
                  <>
                    <SelectItem value="Mandat simple">Mandat simple</SelectItem>
                    <SelectItem value="Mandat exclusif">
                      Mandat exclusif
                    </SelectItem>
                    <SelectItem value="Mandat semi-exclusif">
                      Mandat semi-exclusif
                    </SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Requêtes Tab */}
          <TabsContent value="requetes" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRequetes.map((requete) => (
                <Card key={requete.id} className="overflow-hidden bg-white">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={requete.avatarUrl}
                          alt={requete.client}
                        />
                        <AvatarFallback>
                          {requete.client.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {requete.client}
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={`${getStatusColor(requete.status)} text-white`}
                          >
                            {requete.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{requete.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{requete.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{requete.localisation}</span>
                    </div>
                    <div className="pt-2 space-y-1">
                      <div className="text-sm font-medium">
                        {language === "fr" ? "Budget:" : "Budget:"}{" "}
                        {formatCurrency(requete.budget, requete.currency)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {language === "fr" ? "Recherche:" : "Looking for:"}{" "}
                        {requete.typePropriete} {requete.sousType}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {requete.metresCarres}m² • {requete.nombreChambres}{" "}
                        {language === "fr" ? "ch." : "beds"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {requete.typeFinancement}
                      </div>
                    </div>
                    {requete.besoinsExigences && (
                      <div className="text-sm text-muted-foreground border-t pt-2">
                        <strong>
                          {language === "fr" ? "Exigences:" : "Requirements:"}
                        </strong>{" "}
                        {requete.besoinsExigences}
                      </div>
                    )}
                    <div className="flex justify-between pt-2">
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const choice = confirm(
                              language === "fr"
                                ? "Choisissez: OK pour appel téléphonique, Annuler pour WhatsApp"
                                : "Choose: OK for phone call, Cancel for WhatsApp",
                            );
                            if (choice) {
                              window.open(`tel:${requete.phone}`);
                            } else {
                              window.open(
                                `https://wa.me/${requete.phone.replace(/[^0-9]/g, "")}`,
                              );
                            }
                          }}
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            window.open(
                              `mailto:${requete.email}?subject=${encodeURIComponent(language === "fr" ? "Concernant votre demande immobilière" : "Regarding your property request")}`,
                            );
                          }}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedContact({
                              name: requete.client,
                              type: "requete",
                            });
                            setIsAppointmentDialogOpen(true);
                          }}
                        >
                          <Calendar className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Mandats Tab */}
          <TabsContent value="mandats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMandats.map((mandat) => (
                <Card key={mandat.id} className="overflow-hidden bg-white">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={mandat.avatarUrl}
                          alt={mandat.proprietaire}
                        />
                        <AvatarFallback>
                          {mandat.proprietaire.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {mandat.proprietaire}
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={`${getStatusColor(mandat.status)} text-white`}
                          >
                            {mandat.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{mandat.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{mandat.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{mandat.localisation}</span>
                    </div>
                    <div className="pt-2 space-y-1">
                      <div className="text-sm font-medium">
                        {language === "fr" ? "Prix:" : "Price:"}{" "}
                        {formatCurrency(mandat.prix, mandat.currency)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {language === "fr" ? "Bien:" : "Property:"}{" "}
                        {mandat.typePropriete} {mandat.sousType}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {mandat.metresCarres}m² • {mandat.nombreChambres}{" "}
                        {language === "fr" ? "ch." : "beds"}
                      </div>
                      {mandat.propertyId && (
                        <div className="text-xs text-blue-600 font-medium">
                          ID: {mandat.propertyId}
                        </div>
                      )}
                    </div>
                    {mandat.propertyImage && (
                      <div className="mt-2">
                        <img
                          src={mandat.propertyImage}
                          alt={mandat.propertyTitle || "Property"}
                          className="w-full h-32 object-cover rounded-md"
                        />
                        {mandat.propertyTitle && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {mandat.propertyTitle}
                          </p>
                        )}
                      </div>
                    )}
                    {mandat.notes && (
                      <div className="text-sm text-muted-foreground border-t pt-2">
                        {mandat.notes}
                      </div>
                    )}
                    <div className="flex justify-between pt-2">
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const choice = confirm(
                              language === "fr"
                                ? "Choisissez: OK pour appel téléphonique, Annuler pour WhatsApp"
                                : "Choose: OK for phone call, Cancel for WhatsApp",
                            );
                            if (choice) {
                              window.open(`tel:${mandat.phone}`);
                            } else {
                              window.open(
                                `https://wa.me/${mandat.phone.replace(/[^0-9]/g, "")}`,
                              );
                            }
                          }}
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            window.open(
                              `mailto:${mandat.email}?subject=${encodeURIComponent(language === "fr" ? "Concernant votre mandat immobilier" : "Regarding your property mandate")}`,
                            );
                          }}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedContact({
                              name: mandat.proprietaire,
                              type: "mandat",
                            });
                            setIsAppointmentDialogOpen(true);
                          }}
                        >
                          <Calendar className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Appointment Dialog */}
        <Dialog
          open={isAppointmentDialogOpen}
          onOpenChange={setIsAppointmentDialogOpen}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {language === "fr"
                  ? "Planifier un rendez-vous"
                  : "Schedule Appointment"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="contact-name">
                  {language === "fr" ? "Contact" : "Contact"}
                </Label>
                <Input
                  id="contact-name"
                  value={selectedContact?.name || ""}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="appointment-date">
                  {language === "fr" ? "Date" : "Date"}
                </Label>
                <Input
                  id="appointment-date"
                  type="date"
                  value={appointmentData.date}
                  onChange={(e) =>
                    setAppointmentData({
                      ...appointmentData,
                      date: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="appointment-time">
                  {language === "fr" ? "Heure" : "Time"}
                </Label>
                <Input
                  id="appointment-time"
                  type="time"
                  value={appointmentData.time}
                  onChange={(e) =>
                    setAppointmentData({
                      ...appointmentData,
                      time: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="appointment-type">
                  {language === "fr" ? "Type" : "Type"}
                </Label>
                <Select
                  value={appointmentData.type}
                  onValueChange={(value) =>
                    setAppointmentData({
                      ...appointmentData,
                      type: value as any,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewing">
                      {language === "fr" ? "Visite" : "Viewing"}
                    </SelectItem>
                    <SelectItem value="meeting">
                      {language === "fr" ? "Réunion" : "Meeting"}
                    </SelectItem>
                    <SelectItem value="call">
                      {language === "fr" ? "Appel" : "Call"}
                    </SelectItem>
                    <SelectItem value="signing">
                      {language === "fr" ? "Signature" : "Signing"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="appointment-motif">
                  {language === "fr" ? "Motif" : "Reason"}
                </Label>
                <Textarea
                  id="appointment-motif"
                  value={appointmentData.motif}
                  onChange={(e) =>
                    setAppointmentData({
                      ...appointmentData,
                      motif: e.target.value,
                    })
                  }
                  placeholder={
                    language === "fr"
                      ? "Motif du rendez-vous..."
                      : "Appointment reason..."
                  }
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAppointmentDialogOpen(false);
                  setAppointmentData({
                    date: "",
                    time: "",
                    motif: "",
                    type: "viewing",
                  });
                  setSelectedContact(null);
                }}
              >
                {language === "fr" ? "Annuler" : "Cancel"}
              </Button>
              <Button
                onClick={() => {
                  // Create appointment object
                  const newAppointment: Appointment = {
                    id: Date.now().toString(),
                    title: `${appointmentData.type === "viewing" ? "Visite" : appointmentData.type === "meeting" ? "Réunion" : appointmentData.type === "call" ? "Appel" : "Signature"} - ${selectedContact?.name}`,
                    type: appointmentData.type,
                    date: appointmentData.date,
                    time: appointmentData.time,
                    duration:
                      appointmentData.type === "viewing"
                        ? 60
                        : appointmentData.type === "signing"
                          ? 90
                          : 30,
                    location:
                      appointmentData.type === "call"
                        ? "Appel téléphonique"
                        : "À définir",
                    clientName: selectedContact?.name || "",
                    clientEmail:
                      selectedContact?.type === "requete"
                        ? requetes.find(
                            (r) => r.client === selectedContact?.name,
                          )?.email || ""
                        : mandats.find(
                            (m) => m.proprietaire === selectedContact?.name,
                          )?.email || "",
                    clientPhone:
                      selectedContact?.type === "requete"
                        ? requetes.find(
                            (r) => r.client === selectedContact?.name,
                          )?.phone || ""
                        : mandats.find(
                            (m) => m.proprietaire === selectedContact?.name,
                          )?.phone || "",
                    propertyTitle:
                      selectedContact?.type === "requete"
                        ? `${requetes.find((r) => r.client === selectedContact?.name)?.typePropriete} ${requetes.find((r) => r.client === selectedContact?.name)?.sousType}`
                        : `${mandats.find((m) => m.proprietaire === selectedContact?.name)?.typePropriete} ${mandats.find((m) => m.proprietaire === selectedContact?.name)?.sousType}`,
                    notes: appointmentData.motif,
                    status: "scheduled",
                  };

                  // Call the callback to add appointment to calendar
                  if (onAppointmentCreated) {
                    onAppointmentCreated(newAppointment);
                  }

                  // Store in localStorage as backup
                  const existingAppointments = JSON.parse(
                    localStorage.getItem("crm-appointments") || "[]",
                  );
                  existingAppointments.push(newAppointment);
                  localStorage.setItem(
                    "crm-appointments",
                    JSON.stringify(existingAppointments),
                  );

                  alert(
                    `${language === "fr" ? "Rendez-vous planifié avec" : "Appointment scheduled with"} ${selectedContact?.name}\n` +
                      `${language === "fr" ? "Date:" : "Date:"} ${appointmentData.date}\n` +
                      `${language === "fr" ? "Heure:" : "Time:"} ${appointmentData.time}\n` +
                      `${language === "fr" ? "Type:" : "Type:"} ${appointmentData.type}\n` +
                      `${language === "fr" ? "Motif:" : "Reason:"} ${appointmentData.motif}`,
                  );
                  setIsAppointmentDialogOpen(false);
                  setAppointmentData({
                    date: "",
                    time: "",
                    motif: "",
                    type: "viewing",
                  });
                  setSelectedContact(null);
                }}
                disabled={
                  !appointmentData.date ||
                  !appointmentData.time ||
                  !appointmentData.motif
                }
              >
                {language === "fr" ? "Planifier" : "Schedule"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProspectManagement;
