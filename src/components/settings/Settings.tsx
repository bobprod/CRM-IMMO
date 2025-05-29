import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Settings as SettingsIcon,
  Globe,
  MapPin,
  Bot,
  Key,
  Save,
  Plus,
  Trash2,
} from "lucide-react";

interface Zone {
  id: string;
  name: string;
  cities: string[];
}

interface AIProvider {
  id: string;
  name: string;
  apiKey: string;
  enabled: boolean;
}

interface SettingsProps {
  language?: string;
  currency?: string;
  onLanguageChange?: (lang: string) => void;
  onCurrencyChange?: (curr: string) => void;
}

const Settings = ({
  language = "fr",
  currency = "TND",
  onLanguageChange,
  onCurrencyChange,
}: SettingsProps = {}) => {
  const [zones, setZones] = useState<Zone[]>([
    {
      id: "1",
      name: "Grand Tunis",
      cities: ["Tunis", "La Marsa", "Sidi Bou Said", "Carthage", "Ariana"],
    },
    {
      id: "2",
      name: "Sahel",
      cities: ["Sousse", "Monastir", "Mahdia", "Hammamet"],
    },
  ]);

  const [aiProviders, setAIProviders] = useState<AIProvider[]>([
    {
      id: "1",
      name: "OpenAI GPT",
      apiKey: "",
      enabled: false,
    },
    {
      id: "2",
      name: "Google Gemini",
      apiKey: "",
      enabled: false,
    },
    {
      id: "3",
      name: "Anthropic Claude",
      apiKey: "",
      enabled: false,
    },
    {
      id: "4",
      name: "DeepSeek",
      apiKey: "",
      enabled: false,
    },
    {
      id: "5",
      name: "OpenRouter",
      apiKey: "",
      enabled: false,
    },
  ]);

  const [newZone, setNewZone] = useState({ name: "", cities: "" });
  const [mapProvider, setMapProvider] = useState("google");

  const handleAddZone = () => {
    if (newZone.name && newZone.cities) {
      const zone: Zone = {
        id: Date.now().toString(),
        name: newZone.name,
        cities: newZone.cities.split(",").map((city) => city.trim()),
      };
      setZones([...zones, zone]);
      setNewZone({ name: "", cities: "" });
    }
  };

  const handleRemoveZone = (id: string) => {
    setZones(zones.filter((zone) => zone.id !== id));
  };

  const handleUpdateAIProvider = (id: string, updates: Partial<AIProvider>) => {
    setAIProviders(
      aiProviders.map((provider) =>
        provider.id === id ? { ...provider, ...updates } : provider,
      ),
    );
  };

  const handleLanguageChange = (newLanguage: string) => {
    if (onLanguageChange) {
      onLanguageChange(newLanguage);
    }
  };

  const handleCurrencyChange = (newCurrency: string) => {
    if (onCurrencyChange) {
      onCurrencyChange(newCurrency);
    }
  };

  return (
    <div className="w-full bg-background p-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center space-x-2">
          <SettingsIcon className="h-8 w-8" />
          <h1 className="text-3xl font-bold">
            {language === "fr" ? "Paramètres" : "Settings"}
          </h1>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">
              {language === "fr" ? "Général" : "General"}
            </TabsTrigger>
            <TabsTrigger value="locations">
              {language === "fr" ? "Zones & Villes" : "Zones & Cities"}
            </TabsTrigger>
            <TabsTrigger value="maps">
              {language === "fr" ? "Cartes" : "Maps"}
            </TabsTrigger>
            <TabsTrigger value="ai">
              {language === "fr" ? "Intelligence Artificielle" : "AI"}
            </TabsTrigger>
            <TabsTrigger value="whatsapp">
              {language === "fr" ? "WhatsApp Business" : "WhatsApp Business"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>
                    {language === "fr"
                      ? "Préférences de langue et devise"
                      : "Language and Currency Preferences"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">
                      {language === "fr" ? "Langue" : "Language"}
                    </Label>
                    <Select
                      value={language}
                      onValueChange={handleLanguageChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">
                      {language === "fr" ? "Devise" : "Currency"}
                    </Label>
                    <Select
                      value={currency}
                      onValueChange={handleCurrencyChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TND">
                          Dinar Tunisien (TND)
                        </SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                        <SelectItem value="USD">Dollar US (USD)</SelectItem>
                        <SelectItem value="GBP">
                          Livre Sterling (GBP)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  {language === "fr" ? "Sauvegarder" : "Save"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="locations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>
                    {language === "fr"
                      ? "Gestion des zones et villes"
                      : "Zones and Cities Management"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zoneName">
                      {language === "fr" ? "Nom de la zone" : "Zone Name"}
                    </Label>
                    <Input
                      id="zoneName"
                      value={newZone.name}
                      onChange={(e) =>
                        setNewZone({ ...newZone, name: e.target.value })
                      }
                      placeholder="Grand Tunis"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cities">
                      {language === "fr"
                        ? "Villes (séparées par des virgules)"
                        : "Cities (comma separated)"}
                    </Label>
                    <Input
                      id="cities"
                      value={newZone.cities}
                      onChange={(e) =>
                        setNewZone({ ...newZone, cities: e.target.value })
                      }
                      placeholder="Tunis, La Marsa, Sidi Bou Said"
                    />
                  </div>
                </div>
                <Button onClick={handleAddZone}>
                  <Plus className="h-4 w-4 mr-2" />
                  {language === "fr" ? "Ajouter Zone" : "Add Zone"}
                </Button>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    {language === "fr" ? "Zones existantes" : "Existing Zones"}
                  </h3>
                  {zones.map((zone) => (
                    <Card key={zone.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{zone.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {zone.cities.join(", ")}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveZone(zone.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maps" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === "fr" ? "Fournisseur de cartes" : "Map Provider"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>
                    {language === "fr"
                      ? "Choisir le fournisseur de cartes"
                      : "Choose map provider"}
                  </Label>
                  <Select value={mapProvider} onValueChange={setMapProvider}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select map provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google">Google Maps</SelectItem>
                      <SelectItem value="openstreet">OpenStreetMap</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {mapProvider === "google" && (
                  <div className="space-y-2">
                    <Label htmlFor="googleApiKey">
                      {language === "fr"
                        ? "Clé API Google Maps"
                        : "Google Maps API Key"}
                    </Label>
                    <Input
                      id="googleApiKey"
                      type="password"
                      placeholder="AIzaSy..."
                    />
                  </div>
                )}
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  {language === "fr" ? "Sauvegarder" : "Save"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="h-5 w-5" />
                  <span>
                    {language === "fr"
                      ? "Configuration des IA"
                      : "AI Configuration"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {aiProviders.map((provider) => (
                  <div
                    key={provider.id}
                    className="space-y-4 p-4 border rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Key className="h-4 w-4" />
                        <span className="font-medium">{provider.name}</span>
                      </div>
                      <Switch
                        checked={provider.enabled}
                        onCheckedChange={(checked) =>
                          handleUpdateAIProvider(provider.id, {
                            enabled: checked,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`api-key-${provider.id}`}>
                        {language === "fr" ? "Clé API" : "API Key"}
                      </Label>
                      <Input
                        id={`api-key-${provider.id}`}
                        type="password"
                        value={provider.apiKey}
                        onChange={(e) =>
                          handleUpdateAIProvider(provider.id, {
                            apiKey: e.target.value,
                          })
                        }
                        placeholder="sk-..."
                        disabled={!provider.enabled}
                      />
                    </div>
                  </div>
                ))}
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  {language === "fr" ? "Sauvegarder" : "Save"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="whatsapp" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="h-5 w-5" />
                  <span>
                    {language === "fr"
                      ? "Configuration WhatsApp Business"
                      : "WhatsApp Business Configuration"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span className="font-medium">WhatsApp Business API</span>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp-token">
                      {language === "fr" ? "Token d'accès" : "Access Token"}
                    </Label>
                    <Input
                      id="whatsapp-token"
                      type="password"
                      placeholder="EAAx..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp-phone">
                      {language === "fr"
                        ? "Numéro de téléphone"
                        : "Phone Number"}
                    </Label>
                    <Input id="whatsapp-phone" placeholder="+216XXXXXXXX" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp-webhook">
                      {language === "fr" ? "URL Webhook" : "Webhook URL"}
                    </Label>
                    <Input
                      id="whatsapp-webhook"
                      placeholder="https://your-domain.com/webhook"
                    />
                  </div>
                </div>

                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Meta Business</span>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meta-app-id">
                      {language === "fr" ? "ID de l'application" : "App ID"}
                    </Label>
                    <Input id="meta-app-id" placeholder="123456789..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meta-app-secret">
                      {language === "fr"
                        ? "Secret de l'application"
                        : "App Secret"}
                    </Label>
                    <Input
                      id="meta-app-secret"
                      type="password"
                      placeholder="abc123..."
                    />
                  </div>
                </div>

                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  {language === "fr" ? "Sauvegarder" : "Save"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
