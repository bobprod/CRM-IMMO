import React, { useState, useEffect } from "react";
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
  Phone,
  Mail,
  MessageSquare,
  Search,
  Zap,
  CheckCircle,
  XCircle,
  Loader2,
  Send,
  Facebook,
  Instagram,
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

interface Integration {
  id: string;
  name: string;
  type: "sms" | "email" | "meta" | "scraping" | "automation";
  enabled: boolean;
  status: "connected" | "disconnected" | "testing";
  config: Record<string, any>;
  lastTest?: Date;
  logs: Array<{
    id: string;
    timestamp: Date;
    type: "success" | "error" | "info";
    message: string;
  }>;
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

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "twilio",
      name: "Twilio SMS",
      type: "sms",
      enabled: false,
      status: "disconnected",
      config: {
        accountSid: "",
        authToken: "",
        phoneNumber: "",
        serviceSid: "",
        webhookSid: "",
      },
      logs: [],
    },
    {
      id: "mailgun",
      name: "Mailgun",
      type: "email",
      enabled: false,
      status: "disconnected",
      config: {
        apiKey: "",
        domain: "",
        fromEmail: "",
      },
      logs: [],
    },
    {
      id: "meta",
      name: "Meta Business",
      type: "meta",
      enabled: false,
      status: "disconnected",
      config: {
        accessToken: "",
        appId: "",
        appSecret: "",
        pageId: "",
      },
      logs: [],
    },
    {
      id: "serpapi",
      name: "SerpApi",
      type: "scraping",
      enabled: false,
      status: "disconnected",
      config: {
        apiKey: "",
      },
      logs: [],
    },
    {
      id: "firecrawl",
      name: "Firecrawl",
      type: "scraping",
      enabled: false,
      status: "disconnected",
      config: {
        apiKey: "",
      },
      logs: [],
    },
    {
      id: "n8n",
      name: "n8n Automation",
      type: "automation",
      enabled: false,
      status: "disconnected",
      config: {
        webhookUrl: "",
        apiKey: "",
      },
      logs: [],
    },
  ]);

  const [newZone, setNewZone] = useState({ name: "", cities: "" });
  const [mapProvider, setMapProvider] = useState("google");
  const [googleApiKey, setGoogleApiKey] = useState("");

  // Load settings from localStorage on component mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        // Load map provider
        const savedMapProvider = localStorage.getItem("crm-map-provider");
        if (savedMapProvider) {
          setMapProvider(savedMapProvider);
        }

        // Load Google API key
        const savedGoogleApiKey = localStorage.getItem("crm-google-api-key");
        if (savedGoogleApiKey) {
          setGoogleApiKey(savedGoogleApiKey);
        }

        // Load AI providers
        const savedAIProviders = localStorage.getItem("crm-ai-providers");
        if (savedAIProviders) {
          setAIProviders(JSON.parse(savedAIProviders));
        }

        // Load integrations
        const savedIntegrations = localStorage.getItem("crm-integrations");
        if (savedIntegrations) {
          setIntegrations(JSON.parse(savedIntegrations));
        }

        // Load zones
        const savedZones = localStorage.getItem("crm-zones");
        if (savedZones) {
          setZones(JSON.parse(savedZones));
        }
      } catch (error) {
        console.error("Error loading settings:", error);
        // Don't break the component if localStorage fails
      }
    };

    loadSettings();
  }, []);

  const handleAddZone = () => {
    if (newZone.name && newZone.cities) {
      const zone: Zone = {
        id: Date.now().toString(),
        name: newZone.name,
        cities: newZone.cities.split(",").map((city) => city.trim()),
      };
      const updatedZones = [...zones, zone];
      setZones(updatedZones);
      localStorage.setItem("crm-zones", JSON.stringify(updatedZones));
      setNewZone({ name: "", cities: "" });
    }
  };

  const handleRemoveZone = (id: string) => {
    const updatedZones = zones.filter((zone) => zone.id !== id);
    setZones(updatedZones);
    localStorage.setItem("crm-zones", JSON.stringify(updatedZones));
  };

  const handleUpdateAIProvider = (id: string, updates: Partial<AIProvider>) => {
    const updatedProviders = aiProviders.map((provider) =>
      provider.id === id ? { ...provider, ...updates } : provider,
    );
    setAIProviders(updatedProviders);
    // Save to localStorage immediately when changed
    localStorage.setItem("crm-ai-providers", JSON.stringify(updatedProviders));
  };

  const handleMapProviderChange = (newProvider: string) => {
    setMapProvider(newProvider);
    localStorage.setItem("crm-map-provider", newProvider);
  };

  const handleGoogleApiKeyChange = (newKey: string) => {
    setGoogleApiKey(newKey);
    localStorage.setItem("crm-google-api-key", newKey);
  };

  const handleUpdateIntegration = (
    id: string,
    updates: Partial<Integration>,
  ) => {
    const updatedIntegrations = integrations.map((integration) =>
      integration.id === id ? { ...integration, ...updates } : integration,
    );
    setIntegrations(updatedIntegrations);
    localStorage.setItem(
      "crm-integrations",
      JSON.stringify(updatedIntegrations),
    );
  };

  const testIntegrationConnection = async (integration: Integration) => {
    handleUpdateIntegration(integration.id, { status: "testing" });

    try {
      let result;

      switch (integration.id) {
        case "twilio":
          // Test Twilio connection by updating webhook
          result = await fetch(
            "https://elegant-kapitsa6-bqb8c.supabase.co/functions/v1/supabase-functions-twilio-webhook",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              },
              body: JSON.stringify({
                serviceSid: integration.config.serviceSid,
                sid: integration.config.webhookSid,
                data: { Status: "enabled" },
              }),
            },
          );
          break;

        case "mailgun":
          // Test Mailgun by sending a test email
          result = await fetch(
            "https://elegant-kapitsa6-bqb8c.supabase.co/functions/v1/supabase-functions-mailgun-send",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              },
              body: JSON.stringify({
                domain: integration.config.domain,
                emailData: {
                  from: integration.config.fromEmail,
                  to: [integration.config.fromEmail],
                  subject: "Test de connexion Mailgun",
                  text: "Ceci est un test de connexion depuis votre CRM.",
                },
              }),
            },
          );
          break;

        case "meta":
          // Test Meta connection
          result = await fetch(
            "https://elegant-kapitsa6-bqb8c.supabase.co/functions/v1/supabase-functions-meta-test",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              },
              body: JSON.stringify({
                accessToken: integration.config.accessToken,
              }),
            },
          );
          break;

        case "serpapi":
          // Test SerpApi
          result = await fetch(
            "https://elegant-kapitsa6-bqb8c.supabase.co/functions/v1/supabase-functions-serp-search",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              },
              body: JSON.stringify({
                query: "test",
                options: { location: "Tunisia" },
                apiKey: integration.config.apiKey,
              }),
            },
          );
          break;

        case "firecrawl":
          // Test Firecrawl
          result = await fetch(
            "https://elegant-kapitsa6-bqb8c.supabase.co/functions/v1/supabase-functions-firecrawl-extract",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              },
              body: JSON.stringify({
                query: "test search",
                limit: 5,
                apiKey: integration.config.apiKey,
              }),
            },
          );
          break;

        default:
          throw new Error("Integration non supportée");
      }

      const data = await result.json();

      if (result.ok && !data.error) {
        handleUpdateIntegration(integration.id, {
          status: "connected",
          lastTest: new Date(),
          logs: [
            ...integration.logs,
            {
              id: Date.now().toString(),
              timestamp: new Date(),
              type: "success",
              message: "Test de connexion réussi",
            },
          ],
        });
      } else {
        throw new Error(data.error || data.message || "Erreur de connexion");
      }
    } catch (error) {
      handleUpdateIntegration(integration.id, {
        status: "disconnected",
        logs: [
          ...integration.logs,
          {
            id: Date.now().toString(),
            timestamp: new Date(),
            type: "error",
            message: error.message || "Erreur de test de connexion",
          },
        ],
      });
    }
  };

  const getIntegrationIcon = (type: string) => {
    switch (type) {
      case "sms":
        return <MessageSquare className="h-5 w-5" />;
      case "email":
        return <Mail className="h-5 w-5" />;
      case "meta":
        return <Facebook className="h-5 w-5" />;
      case "scraping":
        return <Search className="h-5 w-5" />;
      case "automation":
        return <Zap className="h-5 w-5" />;
      default:
        return <Key className="h-5 w-5" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "disconnected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "testing":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const saveAllSettings = () => {
    try {
      // Save all settings to localStorage
      localStorage.setItem("crm-map-provider", mapProvider);
      localStorage.setItem("crm-google-api-key", googleApiKey);
      localStorage.setItem("crm-ai-providers", JSON.stringify(aiProviders));
      localStorage.setItem("crm-integrations", JSON.stringify(integrations));
      localStorage.setItem("crm-zones", JSON.stringify(zones));

      alert(
        language === "fr"
          ? "Tous les paramètres ont été sauvegardés avec succès!"
          : "All settings have been saved successfully!",
      );
    } catch (error) {
      console.error("Error saving settings:", error);
      alert(
        language === "fr"
          ? "Erreur lors de la sauvegarde des paramètres"
          : "Error saving settings",
      );
    }
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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">
              {language === "fr" ? "Général" : "General"}
            </TabsTrigger>
            <TabsTrigger value="integrations">
              {language === "fr" ? "Intégrations API" : "API Integrations"}
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

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>
                    {language === "fr"
                      ? "Connexions API et Webhooks"
                      : "API & Webhook Connections"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {integrations.map((integration) => (
                  <Card key={integration.id} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getIntegrationIcon(integration.type)}
                          <div>
                            <h4 className="font-medium">{integration.name}</h4>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              {getStatusIcon(integration.status)}
                              <span className="capitalize">
                                {integration.status}
                              </span>
                              {integration.lastTest && (
                                <span>
                                  • Testé le{" "}
                                  {integration.lastTest.toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              testIntegrationConnection(integration)
                            }
                            disabled={integration.status === "testing"}
                          >
                            {integration.status === "testing" ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Send className="h-4 w-4 mr-2" />
                            )}
                            {language === "fr" ? "Tester" : "Test"}
                          </Button>
                          <Switch
                            checked={integration.enabled}
                            onCheckedChange={(checked) =>
                              handleUpdateIntegration(integration.id, {
                                enabled: checked,
                              })
                            }
                          />
                        </div>
                      </div>

                      {/* Configuration fields based on integration type */}
                      <div className="grid grid-cols-2 gap-4">
                        {integration.id === "twilio" && (
                          <>
                            <div className="space-y-2">
                              <Label>Account SID</Label>
                              <Input
                                type="password"
                                value={integration.config.accountSid}
                                onChange={(e) =>
                                  handleUpdateIntegration(integration.id, {
                                    config: {
                                      ...integration.config,
                                      accountSid: e.target.value,
                                    },
                                  })
                                }
                                placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Auth Token</Label>
                              <Input
                                type="password"
                                value={integration.config.authToken}
                                onChange={(e) =>
                                  handleUpdateIntegration(integration.id, {
                                    config: {
                                      ...integration.config,
                                      authToken: e.target.value,
                                    },
                                  })
                                }
                                placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Phone Number</Label>
                              <Input
                                value={integration.config.phoneNumber}
                                onChange={(e) =>
                                  handleUpdateIntegration(integration.id, {
                                    config: {
                                      ...integration.config,
                                      phoneNumber: e.target.value,
                                    },
                                  })
                                }
                                placeholder="+1234567890"
                              />
                            </div>
                          </>
                        )}

                        {integration.id === "mailgun" && (
                          <>
                            <div className="space-y-2">
                              <Label>API Key</Label>
                              <Input
                                type="password"
                                value={integration.config.apiKey}
                                onChange={(e) =>
                                  handleUpdateIntegration(integration.id, {
                                    config: {
                                      ...integration.config,
                                      apiKey: e.target.value,
                                    },
                                  })
                                }
                                placeholder="key-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Domain</Label>
                              <Input
                                value={integration.config.domain}
                                onChange={(e) =>
                                  handleUpdateIntegration(integration.id, {
                                    config: {
                                      ...integration.config,
                                      domain: e.target.value,
                                    },
                                  })
                                }
                                placeholder="mg.yourdomain.com"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>From Email</Label>
                              <Input
                                type="email"
                                value={integration.config.fromEmail}
                                onChange={(e) =>
                                  handleUpdateIntegration(integration.id, {
                                    config: {
                                      ...integration.config,
                                      fromEmail: e.target.value,
                                    },
                                  })
                                }
                                placeholder="noreply@yourdomain.com"
                              />
                            </div>
                          </>
                        )}

                        {integration.id === "meta" && (
                          <>
                            <div className="space-y-2">
                              <Label>Access Token</Label>
                              <Input
                                type="password"
                                value={integration.config.accessToken}
                                onChange={(e) =>
                                  handleUpdateIntegration(integration.id, {
                                    config: {
                                      ...integration.config,
                                      accessToken: e.target.value,
                                    },
                                  })
                                }
                                placeholder="EAAx..."
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>App ID</Label>
                              <Input
                                value={integration.config.appId}
                                onChange={(e) =>
                                  handleUpdateIntegration(integration.id, {
                                    config: {
                                      ...integration.config,
                                      appId: e.target.value,
                                    },
                                  })
                                }
                                placeholder="123456789..."
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Page ID</Label>
                              <Input
                                value={integration.config.pageId}
                                onChange={(e) =>
                                  handleUpdateIntegration(integration.id, {
                                    config: {
                                      ...integration.config,
                                      pageId: e.target.value,
                                    },
                                  })
                                }
                                placeholder="987654321..."
                              />
                            </div>
                          </>
                        )}

                        {(integration.id === "serpapi" ||
                          integration.id === "firecrawl") && (
                          <div className="space-y-2">
                            <Label>API Key</Label>
                            <Input
                              type="password"
                              value={integration.config.apiKey}
                              onChange={(e) =>
                                handleUpdateIntegration(integration.id, {
                                  config: {
                                    ...integration.config,
                                    apiKey: e.target.value,
                                  },
                                })
                              }
                              placeholder="fc-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                            />
                          </div>
                        )}

                        {integration.id === "n8n" && (
                          <>
                            <div className="space-y-2">
                              <Label>Webhook URL</Label>
                              <Input
                                value={integration.config.webhookUrl}
                                onChange={(e) =>
                                  handleUpdateIntegration(integration.id, {
                                    config: {
                                      ...integration.config,
                                      webhookUrl: e.target.value,
                                    },
                                  })
                                }
                                placeholder="https://your-n8n.com/webhook/..."
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>API Key (optionnel)</Label>
                              <Input
                                type="password"
                                value={integration.config.apiKey}
                                onChange={(e) =>
                                  handleUpdateIntegration(integration.id, {
                                    config: {
                                      ...integration.config,
                                      apiKey: e.target.value,
                                    },
                                  })
                                }
                                placeholder="n8n_api_key..."
                              />
                            </div>
                          </>
                        )}
                      </div>

                      {/* Logs section */}
                      {integration.logs.length > 0 && (
                        <div className="space-y-2">
                          <Label>Logs récents</Label>
                          <div className="max-h-32 overflow-y-auto space-y-1 p-2 bg-muted rounded">
                            {integration.logs.slice(-5).map((log) => (
                              <div
                                key={log.id}
                                className="flex items-center space-x-2 text-xs"
                              >
                                <span className="text-muted-foreground">
                                  {log.timestamp.toLocaleTimeString()}
                                </span>
                                <span
                                  className={`px-1 rounded ${
                                    log.type === "success"
                                      ? "bg-green-100 text-green-800"
                                      : log.type === "error"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {log.type}
                                </span>
                                <span>{log.message}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
                <Button onClick={saveAllSettings}>
                  <Save className="h-4 w-4 mr-2" />
                  {language === "fr" ? "Sauvegarder" : "Save"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

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
                  <Select
                    value={mapProvider}
                    onValueChange={handleMapProviderChange}
                  >
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
                      value={googleApiKey}
                      onChange={(e) => handleGoogleApiKeyChange(e.target.value)}
                      placeholder="AIzaSy..."
                    />
                  </div>
                )}
                <Button onClick={saveAllSettings}>
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
                <Button onClick={saveAllSettings}>
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

                <Button onClick={saveAllSettings}>
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
