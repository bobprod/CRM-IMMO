import React, { useState } from "react";
import {
  Search,
  Filter,
  Grid,
  List,
  Map,
  Upload,
  Download,
  ChevronDown,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import AddPropertyDialog from "./AddPropertyDialog";

interface Property {
  id: string;
  mandatId: string;
  title: string;
  price: number;
  currency: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  status: string;
  image: string;
  featured: boolean;
  documents: string[];
  ownerId: string;
  ownerName: string;
}

interface PropertyListProps {
  language?: string;
  currency?: string;
}

const PropertyList = ({
  language = "fr",
  currency = "TND",
}: PropertyListProps = {}) => {
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");
  const [priceRange, setPriceRange] = useState<[number]>([500000]);
  const [selectedCurrency, setCurrency] = useState<string>(currency);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // Mock properties data with mandat IDs
  const [properties, setProperties] = useState<Property[]>([
    {
      id: "PROP-001",
      mandatId: "MANDAT-001",
      title:
        language === "fr"
          ? "Villa Moderne avec Piscine"
          : "Modern Villa with Pool",
      price: 850000,
      currency: "TND",
      location: "La Marsa, Tunis",
      bedrooms: 4,
      bathrooms: 3,
      area: 320,
      type: "Villa",
      status: language === "fr" ? "À Vendre" : "For Sale",
      image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      featured: true,
      documents: [],
      ownerId: "OWNER-001",
      ownerName: "Mohamed Trabelsi",
    },
    {
      id: "PROP-002",
      mandatId: "MANDAT-002",
      title:
        language === "fr"
          ? "Appartement de Luxe avec Vue Mer"
          : "Luxury Apartment with Sea View",
      price: 450000,
      currency: "TND",
      location: "Sidi Bou Said, Tunis",
      bedrooms: 3,
      bathrooms: 2,
      area: 180,
      type: language === "fr" ? "Appartement" : "Apartment",
      status: language === "fr" ? "À Vendre" : "For Sale",
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
      featured: false,
      documents: [],
      ownerId: "OWNER-002",
      ownerName: "Fatma Ben Salem",
    },
    {
      id: "PROP-003",
      mandatId: "MANDAT-003",
      title:
        language === "fr"
          ? "Espace Bureau Commercial"
          : "Commercial Office Space",
      price: 320000,
      currency: "TND",
      location: "Les Berges du Lac, Tunis",
      bedrooms: 0,
      bathrooms: 2,
      area: 250,
      type: "Commercial",
      status: language === "fr" ? "À Vendre" : "For Sale",
      image:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80",
      featured: false,
      documents: [],
      ownerId: "OWNER-003",
      ownerName: "Ahmed Khelifi",
    },
    {
      id: "PROP-004",
      mandatId: "MANDAT-004",
      title: language === "fr" ? "Studio en Bord de Mer" : "Beachfront Studio",
      price: 1200,
      currency: "TND",
      location: "Hammamet, Nabeul",
      bedrooms: 1,
      bathrooms: 1,
      area: 65,
      type: "Studio",
      status: language === "fr" ? "À Louer" : "For Rent",
      image:
        "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800&q=80",
      featured: true,
      documents: [],
      ownerId: "OWNER-004",
      ownerName: "Leila Mansouri",
    },
    {
      id: "PROP-005",
      mandatId: "MANDAT-005",
      title:
        language === "fr"
          ? "Maison Traditionnelle avec Jardin"
          : "Traditional House with Garden",
      price: 580000,
      currency: "TND",
      location: "Carthage, Tunis",
      bedrooms: 5,
      bathrooms: 3,
      area: 400,
      type: language === "fr" ? "Maison" : "House",
      status: language === "fr" ? "À Vendre" : "For Sale",
      image:
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
      featured: false,
      documents: [],
      ownerId: "OWNER-005",
      ownerName: "Karim Bouazizi",
    },
    {
      id: "PROP-006",
      mandatId: "MANDAT-006",
      title:
        language === "fr"
          ? "Immeuble de Bureau Moderne"
          : "Modern Office Building",
      price: 1200000,
      currency: "TND",
      location: "Centre Urbain Nord, Tunis",
      bedrooms: 0,
      bathrooms: 4,
      area: 800,
      type: "Commercial",
      status: language === "fr" ? "À Vendre" : "For Sale",
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
      featured: true,
      documents: [],
      ownerId: "OWNER-006",
      ownerName: "Sonia Gharbi",
    },
  ]);

  const propertyTypes =
    language === "fr"
      ? ["Appartement", "Villa", "Maison", "Studio", "Commercial", "Terrain"]
      : ["Apartment", "Villa", "House", "Studio", "Commercial", "Land"];

  const propertyFeatures =
    language === "fr"
      ? [
          "Piscine",
          "Jardin",
          "Garage",
          "Balcon",
          "Ascenseur",
          "Sécurité",
          "Climatisation",
          "Chauffage",
          "Cuisine",
          "Parking",
          "Terrasse",
          "Meublé",
        ]
      : [
          "Swimming Pool",
          "Garden",
          "Garage",
          "Balcony",
          "Elevator",
          "Security",
          "Air Conditioning",
          "Heating",
          "Kitchen",
          "Parking",
          "Terrace",
          "Furnished",
        ];

  const propertyStatuses =
    language === "fr"
      ? ["À Vendre", "À Louer", "Vendu", "Réservé"]
      : ["For Sale", "For Rent", "Sold", "Reserved"];

  const toggleFilter = (filter: string) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter((f) => f !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  const formatPrice = (price: number, curr: string) => {
    return new Intl.NumberFormat("fr-TN", {
      style: "currency",
      currency: curr,
    }).format(price);
  };

  return (
    <div className="w-full bg-background p-4">
      <div className="flex flex-col space-y-4">
        {/* Header with search and view toggles */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center justify-between w-full">
            <h1 className="text-2xl font-bold">
              {language === "fr" ? "Gestion des Biens" : "Property Management"}
            </h1>
            <AddPropertyDialog
              language={language}
              currency={selectedCurrency}
              onAddProperty={(property) => {
                const newProperty: Property = {
                  id: `PROP-${Date.now()}`,
                  mandatId: `MANDAT-${Date.now()}`,
                  title: property.title,
                  price: property.price,
                  currency: property.currency,
                  location: property.location,
                  bedrooms: property.bedrooms,
                  bathrooms: property.bathrooms,
                  area: property.area,
                  type: property.type,
                  status: property.status,
                  image:
                    property.images[0] ||
                    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
                  featured: false,
                  documents: property.images,
                  ownerId: `OWNER-${Date.now()}`,
                  ownerName: "Nouveau Propriétaire",
                };
                setProperties([...properties, newProperty]);
              }}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={
                  language === "fr"
                    ? "Rechercher des biens..."
                    : "Search properties..."
                }
                className="pl-8 w-full"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode("grid")}
                className={
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground"
                    : ""
                }
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode("list")}
                className={
                  viewMode === "list"
                    ? "bg-primary text-primary-foreground"
                    : ""
                }
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode("map")}
                className={
                  viewMode === "map" ? "bg-primary text-primary-foreground" : ""
                }
              >
                <Map className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Filters section */}
        <div className="bg-card rounded-lg border p-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">
                {language === "fr" ? "Type de Bien" : "Property Type"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {propertyTypes.map((type) => (
                  <Badge
                    key={type}
                    variant={
                      selectedFilters.includes(type) ? "default" : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => toggleFilter(type)}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">
                {language === "fr" ? "Statut" : "Status"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {propertyStatuses.map((status) => (
                  <Badge
                    key={status}
                    variant={
                      selectedFilters.includes(status) ? "default" : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => toggleFilter(status)}
                  >
                    {status}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 min-w-[200px]">
              <div className="flex justify-between">
                <h3 className="text-sm font-medium">
                  {language === "fr" ? "Gamme de Prix" : "Price Range"}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {formatPrice(priceRange[0], selectedCurrency)}
                  </span>
                  <Select value={selectedCurrency} onValueChange={setCurrency}>
                    <SelectTrigger className="w-[80px] h-7">
                      <SelectValue
                        placeholder={language === "fr" ? "Devise" : "Currency"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TND">TND</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Slider
                defaultValue={[500000]}
                max={2000000}
                step={10000}
                value={priceRange}
                onValueChange={setPriceRange}
                className="py-4"
              />
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">
              {language === "fr" ? "Caractéristiques" : "Features"}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {propertyFeatures.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox id={feature} />
                  <label htmlFor={feature} className="text-sm">
                    {feature}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <Button variant="outline" size="sm">
              <X className="mr-2 h-4 w-4" />{" "}
              {language === "fr" ? "Effacer les Filtres" : "Clear Filters"}
            </Button>
            <Button size="sm">
              <Filter className="mr-2 h-4 w-4" />{" "}
              {language === "fr" ? "Appliquer les Filtres" : "Apply Filters"}
            </Button>
          </div>
        </div>

        {/* WordPress Sync Controls */}
        <div className="flex justify-between items-center bg-card rounded-lg border p-4">
          <h3 className="text-sm font-medium">
            {language === "fr"
              ? "Synchronisation WordPress"
              : "WordPress Synchronization"}
          </h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Simulate WordPress import
                alert(
                  language === "fr"
                    ? "Import depuis WordPress en cours..."
                    : "Importing from WordPress...",
                );
                // Here you would implement actual WordPress API integration
              }}
            >
              <Download className="mr-2 h-4 w-4" />{" "}
              {language === "fr"
                ? "Importer depuis WordPress"
                : "Import from WordPress"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Simulate WordPress export
                alert(
                  language === "fr"
                    ? "Export vers WordPress en cours..."
                    : "Exporting to WordPress...",
                );
                // Here you would implement actual WordPress API integration
              }}
            >
              <Upload className="mr-2 h-4 w-4" />{" "}
              {language === "fr"
                ? "Exporter vers WordPress"
                : "Export to WordPress"}
            </Button>
          </div>
        </div>

        {/* Properties Display */}
        <Tabs
          defaultValue={viewMode}
          value={viewMode}
          onValueChange={(value) =>
            setViewMode(value as "grid" | "list" | "map")
          }
        >
          <TabsList className="hidden">
            {" "}
            {/* Hidden but needed for TabsContent to work */}
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
          </TabsList>

          <TabsContent value="grid" className="m-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {properties.map((property) => (
                <Card key={property.id} className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-48 object-cover"
                    />
                    {property.featured && (
                      <Badge className="absolute top-2 right-2 bg-yellow-500">
                        {language === "fr" ? "En Vedette" : "Featured"}
                      </Badge>
                    )}
                    <Badge className="absolute bottom-2 left-2">
                      {property.status}
                    </Badge>
                    <Badge className="absolute top-2 left-2 bg-blue-500 text-white text-xs">
                      ID: {property.mandatId}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold truncate">
                        {property.title}
                      </h3>
                      <p className="font-bold text-primary">
                        {formatPrice(property.price, property.currency)}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {property.location}
                    </p>
                    <div className="flex justify-between mt-4 text-sm">
                      <div className="flex items-center gap-4">
                        <span>
                          {property.bedrooms}{" "}
                          {language === "fr" ? "Ch." : "Beds"}
                        </span>
                        <span>
                          {property.bathrooms}{" "}
                          {language === "fr" ? "SdB" : "Baths"}
                        </span>
                        <span>{property.area} m²</span>
                      </div>
                      <Badge variant="outline">{property.type}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {language === "fr" ? "Propriétaire:" : "Owner:"}{" "}
                      {property.ownerName}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <Button variant="outline" size="sm">
                      {language === "fr" ? "Voir Détails" : "View Details"}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        // Create a proper edit dialog or form
                        const newTitle = prompt(
                          `${language === "fr" ? "Nouveau titre pour" : "New title for"} ${property.title}:`,
                          property.title,
                        );
                        if (newTitle && newTitle !== property.title) {
                          const updatedProperties = properties.map((p) =>
                            p.id === property.id
                              ? { ...p, title: newTitle }
                              : p,
                          );
                          setProperties(updatedProperties);
                          alert(
                            `${language === "fr" ? "Bien modifié avec succès" : "Property updated successfully"}: ${newTitle}`,
                          );
                        }
                      }}
                    >
                      {language === "fr" ? "Modifier Bien" : "Edit Property"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list" className="m-0">
            <div className="flex flex-col gap-4">
              {properties.map((property) => (
                <Card key={property.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative md:w-1/4">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-48 md:h-full object-cover"
                      />
                      {property.featured && (
                        <Badge className="absolute top-2 right-2 bg-yellow-500">
                          {language === "fr" ? "En Vedette" : "Featured"}
                        </Badge>
                      )}
                      <Badge className="absolute bottom-2 left-2">
                        {property.status}
                      </Badge>
                      <Badge className="absolute top-2 left-2 bg-blue-500 text-white text-xs">
                        ID: {property.mandatId}
                      </Badge>
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold">{property.title}</h3>
                        <p className="font-bold text-primary">
                          {formatPrice(property.price, property.currency)}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {property.location}
                      </p>
                      <div className="flex flex-wrap gap-4 mt-4 text-sm">
                        <span>
                          {property.bedrooms}{" "}
                          {language === "fr" ? "Ch." : "Beds"}
                        </span>
                        <span>
                          {property.bathrooms}{" "}
                          {language === "fr" ? "SdB" : "Baths"}
                        </span>
                        <span>{property.area} m²</span>
                        <Badge variant="outline">{property.type}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {language === "fr" ? "Propriétaire:" : "Owner:"}{" "}
                        {property.ownerName}
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" size="sm">
                          {language === "fr" ? "Voir Détails" : "View Details"}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            // Create a proper edit dialog or form
                            const newTitle = prompt(
                              `${language === "fr" ? "Nouveau titre pour" : "New title for"} ${property.title}:`,
                              property.title,
                            );
                            if (newTitle && newTitle !== property.title) {
                              const updatedProperties = properties.map((p) =>
                                p.id === property.id
                                  ? { ...p, title: newTitle }
                                  : p,
                              );
                              setProperties(updatedProperties);
                              alert(
                                `${language === "fr" ? "Bien modifié avec succès" : "Property updated successfully"}: ${newTitle}`,
                              );
                            }
                          }}
                        >
                          {language === "fr"
                            ? "Modifier Bien"
                            : "Edit Property"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="map" className="m-0">
            <div className="bg-card rounded-lg border h-[500px] flex items-center justify-center">
              <div className="text-center">
                <Map className="h-16 w-16 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">
                  {language === "fr" ? "Vue Carte" : "Map View"}
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {language === "fr"
                    ? "Intégration de carte interactive avec Google Maps ou OpenStreetMap serait affichée ici, montrant les emplacements des propriétés avec des marqueurs et des popups d'information."
                    : "Interactive map integration with Google Maps or OpenStreetMap would be displayed here, showing property locations with markers and information popups."}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PropertyList;
