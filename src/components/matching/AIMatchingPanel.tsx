import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Phone,
  Calendar,
  Mail,
  MessageSquare,
  Info,
  Search,
  Filter,
  SlidersHorizontal,
} from "lucide-react";

interface Property {
  id: string;
  title: string;
  type: string;
  price: number;
  currency: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  imageUrl: string;
}

interface Prospect {
  id: string;
  name: string;
  email: string;
  phone: string;
  budget: number;
  currency: string;
  preferredLocation: string;
  preferredType: string;
  avatarUrl: string;
}

interface Match {
  propertyId: string;
  prospectId: string;
  score: number;
  reasons: string[];
}

interface AIMatchingPanelProps {
  language?: string;
  currency?: string;
}

const AIMatchingPanel: React.FC<AIMatchingPanelProps> = ({
  language = "fr",
  currency = "TND",
}) => {
  const [relevanceThreshold, setRelevanceThreshold] = useState<number>(70);
  const [activeTab, setActiveTab] = useState<string>("properties");
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [selectedProspect, setSelectedProspect] = useState<string | null>(null);

  // Mock data
  const properties: Property[] = [
    {
      id: "prop1",
      title: "Villa Moderne avec Vue Mer",
      type: "Villa",
      price: 850000,
      currency: "EUR",
      location: "La Marsa, Tunis",
      bedrooms: 4,
      bathrooms: 3,
      area: 280,
      imageUrl:
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    },
    {
      id: "prop2",
      title: "Appartement de Luxe Centre-Ville",
      type: "Appartement",
      price: 450000,
      currency: "EUR",
      location: "Lac 2, Tunis",
      bedrooms: 3,
      bathrooms: 2,
      area: 150,
      imageUrl:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    },
    {
      id: "prop3",
      title: "Maison Traditionnelle Rénovée",
      type: "Maison",
      price: 1200000,
      currency: "TND",
      location: "Sidi Bou Said, Tunis",
      bedrooms: 5,
      bathrooms: 4,
      area: 320,
      imageUrl:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    },
  ];

  const prospects: Prospect[] = [
    {
      id: "pros1",
      name: "Sophie Martin",
      email: "sophie.martin@example.com",
      phone: "+216 55 123 456",
      budget: 900000,
      currency: "EUR",
      preferredLocation: "La Marsa, Tunis",
      preferredType: "Villa",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=sophie",
    },
    {
      id: "pros2",
      name: "Ahmed Ben Ali",
      email: "ahmed.benali@example.com",
      phone: "+216 99 876 543",
      budget: 500000,
      currency: "EUR",
      preferredLocation: "Lac 2, Tunis",
      preferredType: "Appartement",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed",
    },
    {
      id: "pros3",
      name: "Isabelle Dubois",
      email: "isabelle.dubois@example.com",
      phone: "+33 6 12 34 56 78",
      budget: 1500000,
      currency: "TND",
      preferredLocation: "Sidi Bou Said, Tunis",
      preferredType: "Maison",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=isabelle",
    },
  ];

  const matches: Match[] = [
    {
      propertyId: "prop1",
      prospectId: "pros1",
      score: 92,
      reasons: [
        "Budget compatible",
        "Localisation idéale",
        "Type de bien recherché",
      ],
    },
    {
      propertyId: "prop2",
      prospectId: "pros2",
      score: 88,
      reasons: [
        "Budget compatible",
        "Localisation idéale",
        "Type de bien recherché",
      ],
    },
    {
      propertyId: "prop3",
      prospectId: "pros3",
      score: 95,
      reasons: [
        "Budget compatible",
        "Localisation idéale",
        "Type de bien recherché",
        "Caractéristiques correspondantes",
      ],
    },
    {
      propertyId: "prop1",
      prospectId: "pros2",
      score: 65,
      reasons: ["Budget légèrement supérieur", "Type de bien différent"],
    },
    {
      propertyId: "prop2",
      prospectId: "pros1",
      score: 72,
      reasons: ["Budget compatible", "Type de bien différent"],
    },
  ];

  // Filter matches based on relevance threshold
  const filteredMatches = matches.filter(
    (match) => match.score >= relevanceThreshold,
  );

  // Get matches for a specific property
  const getPropertyMatches = (propertyId: string) => {
    return filteredMatches
      .filter((match) => match.propertyId === propertyId)
      .sort((a, b) => b.score - a.score);
  };

  // Get matches for a specific prospect
  const getProspectMatches = (prospectId: string) => {
    return filteredMatches
      .filter((match) => match.prospectId === prospectId)
      .sort((a, b) => b.score - a.score);
  };

  // Get property by ID
  const getProperty = (id: string) => {
    return properties.find((property) => property.id === id);
  };

  // Get prospect by ID
  const getProspect = (id: string) => {
    return prospects.find((prospect) => prospect.id === id);
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    switch (currency) {
      case "EUR":
        return `${amount.toLocaleString()} €`;
      case "USD":
        return `$${amount.toLocaleString()}`;
      case "GBP":
        return `£${amount.toLocaleString()}`;
      case "TND":
        return `${amount.toLocaleString()} TND`;
      default:
        return `${amount.toLocaleString()}`;
    }
  };

  // Score color based on match percentage
  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 75) return "bg-emerald-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-background w-full p-6">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Matching IA</h2>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">
                Seuil de pertinence: {relevanceThreshold}%
              </span>
              <div className="w-48">
                <Slider
                  value={[relevanceThreshold]}
                  onValueChange={(value) => setRelevanceThreshold(value[0])}
                  min={0}
                  max={100}
                  step={5}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Input
                className="w-64"
                placeholder="Rechercher des correspondances..."
                type="search"
                icon={<Search className="h-4 w-4" />}
              />
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Tabs
          defaultValue="properties"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="properties">Biens → Prospects</TabsTrigger>
            <TabsTrigger value="prospects">Prospects → Biens</TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Biens Immobiliers</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-4">
                      {properties.map((property) => (
                        <div
                          key={property.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedProperty === property.id ? "border-primary bg-primary/5" : "hover:border-primary/50"}`}
                          onClick={() => setSelectedProperty(property.id)}
                        >
                          <div className="flex space-x-4">
                            <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                              <img
                                src={property.imageUrl}
                                alt={property.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h3 className="font-medium">
                                  {property.title}
                                </h3>
                                <Badge>{property.type}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {property.location}
                              </p>
                              <p className="font-semibold mt-2">
                                {formatCurrency(
                                  property.price,
                                  property.currency,
                                )}
                              </p>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                                <span>{property.bedrooms} chambres</span>
                                <span>{property.bathrooms} SDB</span>
                                <span>{property.area} m²</span>
                              </div>
                              <div className="mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {getPropertyMatches(property.id).length}{" "}
                                  correspondances
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>
                    {selectedProperty
                      ? `Prospects correspondants (${getPropertyMatches(selectedProperty).length})`
                      : "Sélectionnez un bien pour voir les correspondances"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedProperty ? (
                    <ScrollArea className="h-[600px] pr-4">
                      <div className="space-y-4">
                        {getPropertyMatches(selectedProperty).length > 0 ? (
                          getPropertyMatches(selectedProperty).map((match) => {
                            const prospect = getProspect(match.prospectId);
                            if (!prospect) return null;

                            return (
                              <Card
                                key={match.prospectId}
                                className="overflow-hidden"
                              >
                                <div className="flex items-center p-4">
                                  <div className="relative">
                                    <Avatar className="h-16 w-16">
                                      <AvatarImage
                                        src={prospect.avatarUrl}
                                        alt={prospect.name}
                                      />
                                      <AvatarFallback>
                                        {prospect.name
                                          .substring(0, 2)
                                          .toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div
                                      className={`absolute -bottom-1 -right-1 rounded-full w-8 h-8 flex items-center justify-center text-white text-xs font-bold ${getScoreColor(match.score)}`}
                                    >
                                      {match.score}%
                                    </div>
                                  </div>
                                  <div className="ml-4 flex-1">
                                    <h3 className="font-medium">
                                      {prospect.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                      {prospect.preferredType} -{" "}
                                      {prospect.preferredLocation}
                                    </p>
                                    <p className="text-sm font-medium mt-1">
                                      {formatCurrency(
                                        prospect.budget,
                                        prospect.currency,
                                      )}
                                    </p>
                                  </div>
                                </div>

                                <div className="px-4 pb-2">
                                  <div className="text-sm font-medium mb-1">
                                    Critères correspondants:
                                  </div>
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    {match.reasons.map((reason, index) => (
                                      <Badge
                                        key={index}
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {reason}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                <Separator />

                                <div className="p-3 flex justify-between bg-muted/30">
                                  <Button variant="ghost" size="sm">
                                    <Phone className="h-4 w-4 mr-1" />
                                    Appeler
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Mail className="h-4 w-4 mr-1" />
                                    Email
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    RDV
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <MessageSquare className="h-4 w-4 mr-1" />
                                    Message
                                  </Button>
                                </div>
                              </Card>
                            );
                          })
                        ) : (
                          <div className="flex flex-col items-center justify-center h-[400px] text-center">
                            <Info className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium">
                              Aucune correspondance
                            </h3>
                            <p className="text-muted-foreground mt-2">
                              Essayez d'ajuster le seuil de pertinence pour voir
                              plus de résultats
                            </p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[400px] text-center">
                      <Info className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">
                        Sélectionnez un bien
                      </h3>
                      <p className="text-muted-foreground mt-2">
                        Choisissez un bien immobilier pour voir les prospects
                        correspondants
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="prospects" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Prospects</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-4">
                      {prospects.map((prospect) => (
                        <div
                          key={prospect.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedProspect === prospect.id ? "border-primary bg-primary/5" : "hover:border-primary/50"}`}
                          onClick={() => setSelectedProspect(prospect.id)}
                        >
                          <div className="flex space-x-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage
                                src={prospect.avatarUrl}
                                alt={prospect.name}
                              />
                              <AvatarFallback>
                                {prospect.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="font-medium">{prospect.name}</h3>
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                                <Mail className="h-3 w-3" />
                                <span>{prospect.email}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                                <Phone className="h-3 w-3" />
                                <span>{prospect.phone}</span>
                              </div>
                              <div className="mt-2">
                                <p className="text-sm">
                                  <span className="font-medium">
                                    Recherche:
                                  </span>{" "}
                                  {prospect.preferredType} à{" "}
                                  {prospect.preferredLocation}
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Budget:</span>{" "}
                                  {formatCurrency(
                                    prospect.budget,
                                    prospect.currency,
                                  )}
                                </p>
                              </div>
                              <div className="mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {getProspectMatches(prospect.id).length}{" "}
                                  correspondances
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>
                    {selectedProspect
                      ? `Biens correspondants (${getProspectMatches(selectedProspect).length})`
                      : "Sélectionnez un prospect pour voir les correspondances"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedProspect ? (
                    <ScrollArea className="h-[600px] pr-4">
                      <div className="space-y-4">
                        {getProspectMatches(selectedProspect).length > 0 ? (
                          getProspectMatches(selectedProspect).map((match) => {
                            const property = getProperty(match.propertyId);
                            if (!property) return null;

                            return (
                              <Card
                                key={match.propertyId}
                                className="overflow-hidden"
                              >
                                <div className="flex p-4">
                                  <div className="relative">
                                    <div className="w-24 h-24 rounded-md overflow-hidden">
                                      <img
                                        src={property.imageUrl}
                                        alt={property.title}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div
                                      className={`absolute -bottom-1 -right-1 rounded-full w-8 h-8 flex items-center justify-center text-white text-xs font-bold ${getScoreColor(match.score)}`}
                                    >
                                      {match.score}%
                                    </div>
                                  </div>
                                  <div className="ml-4 flex-1">
                                    <div className="flex justify-between items-start">
                                      <h3 className="font-medium">
                                        {property.title}
                                      </h3>
                                      <Badge>{property.type}</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      {property.location}
                                    </p>
                                    <p className="font-semibold mt-1">
                                      {formatCurrency(
                                        property.price,
                                        property.currency,
                                      )}
                                    </p>
                                    <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                                      <span>{property.bedrooms} chambres</span>
                                      <span>{property.bathrooms} SDB</span>
                                      <span>{property.area} m²</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="px-4 pb-2">
                                  <div className="text-sm font-medium mb-1">
                                    Critères correspondants:
                                  </div>
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    {match.reasons.map((reason, index) => (
                                      <Badge
                                        key={index}
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {reason}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                <Separator />

                                <div className="p-3 flex justify-between bg-muted/30">
                                  <Button variant="ghost" size="sm">
                                    <Info className="h-4 w-4 mr-1" />
                                    Détails
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    Visite
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Mail className="h-4 w-4 mr-1" />
                                    Envoyer
                                  </Button>
                                </div>
                              </Card>
                            );
                          })
                        ) : (
                          <div className="flex flex-col items-center justify-center h-[400px] text-center">
                            <Info className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium">
                              Aucune correspondance
                            </h3>
                            <p className="text-muted-foreground mt-2">
                              Essayez d'ajuster le seuil de pertinence pour voir
                              plus de résultats
                            </p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[400px] text-center">
                      <Info className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">
                        Sélectionnez un prospect
                      </h3>
                      <p className="text-muted-foreground mt-2">
                        Choisissez un prospect pour voir les biens immobiliers
                        correspondants
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AIMatchingPanel;
