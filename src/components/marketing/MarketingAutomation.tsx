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
  Mail,
  MessageSquare,
  Phone,
  Send,
  Users,
  Calendar,
  BarChart3,
  Settings,
  Plus,
  Play,
  Pause,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Target,
  Zap,
  Globe,
} from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  type: "email" | "sms" | "whatsapp" | "meta";
  status: "draft" | "active" | "paused" | "completed";
  recipients: number;
  sent: number;
  opened: number;
  clicked: number;
  converted: number;
  createdAt: string;
  scheduledAt?: string;
  message: string;
  subject?: string;
}

interface MarketingAutomationProps {
  language?: string;
  currency?: string;
}

const MarketingAutomation = ({
  language = "fr",
  currency = "TND",
}: MarketingAutomationProps = {}) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  // Initialize campaigns with default data
  useEffect(() => {
    const initializeCampaigns = () => {
      try {
        const savedCampaigns = localStorage.getItem("crm-campaigns");
        if (savedCampaigns && savedCampaigns !== "[]") {
          const campaigns = JSON.parse(savedCampaigns);
          if (campaigns.length > 0) {
            setCampaigns(campaigns);
            return;
          }
        }
        // Always set default campaigns to ensure module is not empty
        const defaultCampaigns: Campaign[] = [
          {
            id: "1",
            name: "Campagne Nouveaux Biens - Janvier",
            type: "email",
            status: "active",
            recipients: 1250,
            sent: 1250,
            opened: 687,
            clicked: 156,
            converted: 23,
            createdAt: new Date(
              Date.now() - 2 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            message:
              "Découvrez nos nouveaux biens immobiliers sélectionnés pour vous...",
            subject: "🏠 Nouveaux biens disponibles - Sélection personnalisée",
          },
          {
            id: "2",
            name: "SMS Rappel Visite",
            type: "sms",
            status: "completed",
            recipients: 45,
            sent: 45,
            opened: 45,
            clicked: 12,
            converted: 8,
            createdAt: new Date(
              Date.now() - 1 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            message:
              "Rappel: Votre visite est prévue demain à 14h. Confirmez votre présence.",
          },
          {
            id: "3",
            name: "WhatsApp Suivi Prospects",
            type: "whatsapp",
            status: "active",
            recipients: 89,
            sent: 67,
            opened: 58,
            clicked: 34,
            converted: 12,
            createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            message:
              "Bonjour! Avez-vous eu l'occasion de consulter les biens que nous vous avons proposés?",
          },
          {
            id: "4",
            name: "Meta Ads - Investisseurs Expatriés",
            type: "meta",
            status: "paused",
            recipients: 2500,
            sent: 1890,
            opened: 945,
            clicked: 234,
            converted: 45,
            createdAt: new Date(
              Date.now() - 5 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            message:
              "Investissez en Tunisie depuis l'étranger. ROI attractif garanti.",
          },
          {
            id: "5",
            name: "Email Newsletter Mensuelle",
            type: "email",
            status: "active",
            recipients: 3200,
            sent: 3200,
            opened: 1856,
            clicked: 412,
            converted: 67,
            createdAt: new Date(
              Date.now() - 7 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            message:
              "Votre newsletter mensuelle avec les meilleures opportunités immobilières...",
            subject:
              "📧 Newsletter Immobilière - Les meilleures opportunités du mois",
          },
          {
            id: "6",
            name: "WhatsApp Promotion Été",
            type: "whatsapp",
            status: "draft",
            recipients: 156,
            sent: 0,
            opened: 0,
            clicked: 0,
            converted: 0,
            createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            message:
              "🏖️ Offres spéciales été! Découvrez nos biens de vacances avec remises exceptionnelles.",
          },
        ];
        setCampaigns(defaultCampaigns);
        localStorage.setItem("crm-campaigns", JSON.stringify(defaultCampaigns));

        // Force re-render to ensure campaigns are displayed
        setTimeout(() => {
          setCampaigns([...defaultCampaigns]);
        }, 100);
      } catch (error) {
        console.error("Error initializing campaigns:", error);
        // Fallback: set empty array if there's an error
        setCampaigns([]);
      }
    };

    initializeCampaigns();

    // Listen for storage changes to update campaigns in real-time
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "crm-campaigns") {
        initializeCampaigns();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Save campaigns to localStorage whenever they change
  useEffect(() => {
    if (campaigns.length > 0) {
      localStorage.setItem("crm-campaigns", JSON.stringify(campaigns));
    }
  }, [campaigns]);

  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null,
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    type: "email" as "email" | "sms" | "whatsapp" | "meta",
    message: "",
    subject: "",
    recipients: "all",
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "paused":
        return "bg-yellow-500";
      case "completed":
        return "bg-blue-500";
      case "draft":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "sms":
        return <Phone className="h-4 w-4" />;
      case "whatsapp":
        return <MessageSquare className="h-4 w-4" />;
      case "meta":
        return <Globe className="h-4 w-4" />;
      default:
        return <Send className="h-4 w-4" />;
    }
  };

  const calculateConversionRate = (converted: number, sent: number) => {
    return sent > 0 ? ((converted / sent) * 100).toFixed(1) : "0.0";
  };

  const calculateOpenRate = (opened: number, sent: number) => {
    return sent > 0 ? ((opened / sent) * 100).toFixed(1) : "0.0";
  };

  const createCampaign = () => {
    if (newCampaign.name && newCampaign.message) {
      const campaign: Campaign = {
        id: Date.now().toString(),
        name: newCampaign.name,
        type: newCampaign.type,
        status: "draft",
        recipients: Math.floor(Math.random() * 500) + 100,
        sent: 0,
        opened: 0,
        clicked: 0,
        converted: 0,
        createdAt: new Date().toISOString(),
        message: newCampaign.message,
        subject: newCampaign.subject,
      };
      const updatedCampaigns = [campaign, ...campaigns];
      setCampaigns(updatedCampaigns);
      localStorage.setItem("crm-campaigns", JSON.stringify(updatedCampaigns));

      setNewCampaign({
        name: "",
        type: "email",
        message: "",
        subject: "",
        recipients: "all",
      });
      setIsCreateDialogOpen(false);

      // Simulate campaign launch with real-time updates
      setTimeout(() => {
        launchCampaign(campaign.id);
      }, 2000);
    }
  };

  const toggleCampaignStatus = (campaignId: string) => {
    const updatedCampaigns = campaigns.map((campaign) => {
      if (campaign.id === campaignId) {
        const newStatus = campaign.status === "active" ? "paused" : "active";
        return { ...campaign, status: newStatus };
      }
      return campaign;
    });
    setCampaigns(updatedCampaigns);
    localStorage.setItem("crm-campaigns", JSON.stringify(updatedCampaigns));
  };

  const deleteCampaign = (campaignId: string) => {
    const updatedCampaigns = campaigns.filter(
      (campaign) => campaign.id !== campaignId,
    );
    setCampaigns(updatedCampaigns);
    localStorage.setItem("crm-campaigns", JSON.stringify(updatedCampaigns));
  };

  // Launch campaign with simulated progress
  const launchCampaign = (campaignId: string) => {
    const campaign = campaigns.find((c) => c.id === campaignId);
    if (!campaign) return;

    // Simulate campaign sending process
    const totalRecipients = campaign.recipients;
    let currentSent = 0;
    let currentOpened = 0;
    let currentClicked = 0;
    let currentConverted = 0;

    const interval = setInterval(() => {
      if (currentSent < totalRecipients) {
        currentSent += Math.floor(Math.random() * 20) + 5;
        if (currentSent > totalRecipients) currentSent = totalRecipients;

        // Simulate realistic engagement rates
        currentOpened = Math.floor(currentSent * (0.45 + Math.random() * 0.25)); // 45-70% open rate
        currentClicked = Math.floor(
          currentOpened * (0.08 + Math.random() * 0.12),
        ); // 8-20% click rate
        currentConverted = Math.floor(
          currentClicked * (0.05 + Math.random() * 0.15),
        ); // 5-20% conversion rate

        const updatedCampaigns = campaigns.map((c) => {
          if (c.id === campaignId) {
            return {
              ...c,
              status: currentSent >= totalRecipients ? "completed" : "active",
              sent: currentSent,
              opened: currentOpened,
              clicked: currentClicked,
              converted: currentConverted,
            };
          }
          return c;
        });

        setCampaigns(updatedCampaigns);
        localStorage.setItem("crm-campaigns", JSON.stringify(updatedCampaigns));

        if (currentSent >= totalRecipients) {
          clearInterval(interval);
        }
      }
    }, 1000);
  };

  const totalStats = campaigns.reduce(
    (acc, campaign) => ({
      recipients: acc.recipients + campaign.recipients,
      sent: acc.sent + campaign.sent,
      opened: acc.opened + campaign.opened,
      clicked: acc.clicked + campaign.clicked,
      converted: acc.converted + campaign.converted,
    }),
    { recipients: 0, sent: 0, opened: 0, clicked: 0, converted: 0 },
  );

  return (
    <div className="w-full bg-background p-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            {language === "fr"
              ? "Automatisation Marketing"
              : "Marketing Automation"}
          </h1>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                {language === "fr" ? "Nouvelle Campagne" : "New Campaign"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {language === "fr" ? "Créer une Campagne" : "Create Campaign"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-name">
                    {language === "fr" ? "Nom de la campagne" : "Campaign Name"}
                  </Label>
                  <Input
                    id="campaign-name"
                    value={newCampaign.name}
                    onChange={(e) =>
                      setNewCampaign({ ...newCampaign, name: e.target.value })
                    }
                    placeholder="Nom de votre campagne"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaign-type">
                    {language === "fr" ? "Type de campagne" : "Campaign Type"}
                  </Label>
                  <Select
                    value={newCampaign.type}
                    onValueChange={(value) =>
                      setNewCampaign({ ...newCampaign, type: value as any })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="meta">Meta/Facebook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newCampaign.type === "email" && (
                  <div className="space-y-2">
                    <Label htmlFor="campaign-subject">
                      {language === "fr" ? "Sujet" : "Subject"}
                    </Label>
                    <Input
                      id="campaign-subject"
                      value={newCampaign.subject}
                      onChange={(e) =>
                        setNewCampaign({
                          ...newCampaign,
                          subject: e.target.value,
                        })
                      }
                      placeholder="Sujet de l'email"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="campaign-message">
                    {language === "fr" ? "Message" : "Message"}
                  </Label>
                  <Textarea
                    id="campaign-message"
                    value={newCampaign.message}
                    onChange={(e) =>
                      setNewCampaign({
                        ...newCampaign,
                        message: e.target.value,
                      })
                    }
                    placeholder="Contenu de votre message"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaign-recipients">
                    {language === "fr" ? "Destinataires" : "Recipients"}
                  </Label>
                  <Select
                    value={newCampaign.recipients}
                    onValueChange={(value) =>
                      setNewCampaign({ ...newCampaign, recipients: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {language === "fr"
                          ? "Tous les prospects"
                          : "All prospects"}
                      </SelectItem>
                      <SelectItem value="hot">
                        {language === "fr"
                          ? "Prospects chauds"
                          : "Hot prospects"}
                      </SelectItem>
                      <SelectItem value="cold">
                        {language === "fr"
                          ? "Prospects froids"
                          : "Cold prospects"}
                      </SelectItem>
                      <SelectItem value="expats">
                        {language === "fr" ? "Expatriés" : "Expats"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  {language === "fr" ? "Annuler" : "Cancel"}
                </Button>
                <Button onClick={createCampaign}>
                  {language === "fr" ? "Créer" : "Create"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === "fr" ? "Total Destinataires" : "Total Recipients"}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalStats.recipients.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === "fr" ? "Messages Envoyés" : "Messages Sent"}
              </CardTitle>
              <Send className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalStats.sent.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === "fr" ? "Taux d'Ouverture" : "Open Rate"}
              </CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {calculateOpenRate(totalStats.opened, totalStats.sent)}%
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === "fr" ? "Clics" : "Clicks"}
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalStats.clicked.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === "fr" ? "Conversions" : "Conversions"}
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalStats.converted.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {calculateConversionRate(totalStats.converted, totalStats.sent)}
                % {language === "fr" ? "taux" : "rate"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Campaigns List */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>
                {language === "fr" ? "Campagnes Actives" : "Active Campaigns"}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(campaign.type)}
                      <Badge
                        className={`${getStatusColor(campaign.status)} text-white`}
                      >
                        {campaign.status}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-medium">{campaign.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {campaign.message}
                      </p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                        <span>{campaign.recipients} destinataires</span>
                        <span>{campaign.sent} envoyés</span>
                        <span>
                          {calculateOpenRate(campaign.opened, campaign.sent)}%
                          ouverture
                        </span>
                        <span>{campaign.converted} conversions</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCampaign(campaign)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleCampaignStatus(campaign.id)}
                    >
                      {campaign.status === "active" ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteCampaign(campaign.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Campaign Detail Dialog */}
        <Dialog
          open={!!selectedCampaign}
          onOpenChange={() => setSelectedCampaign(null)}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                {selectedCampaign && getTypeIcon(selectedCampaign.type)}
                <span>{selectedCampaign?.name}</span>
              </DialogTitle>
            </DialogHeader>
            {selectedCampaign && (
              <div className="space-y-4 py-4">
                <div className="flex items-center space-x-4">
                  <Badge
                    className={`${getStatusColor(selectedCampaign.status)} text-white`}
                  >
                    {selectedCampaign.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {language === "fr" ? "Créée le" : "Created on"}{" "}
                    {new Date(selectedCampaign.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {selectedCampaign.subject && (
                  <div>
                    <h4 className="font-medium mb-2">
                      {language === "fr" ? "Sujet" : "Subject"}
                    </h4>
                    <p className="text-sm">{selectedCampaign.subject}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-2">
                    {language === "fr" ? "Message" : "Message"}
                  </h4>
                  <p className="text-sm bg-gray-50 p-3 rounded">
                    {selectedCampaign.message}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {selectedCampaign.recipients}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {language === "fr" ? "Destinataires" : "Recipients"}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {selectedCampaign.sent}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {language === "fr" ? "Envoyés" : "Sent"}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {calculateOpenRate(
                        selectedCampaign.opened,
                        selectedCampaign.sent,
                      )}
                      %
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {language === "fr" ? "Ouverture" : "Open Rate"}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {calculateConversionRate(
                        selectedCampaign.converted,
                        selectedCampaign.sent,
                      )}
                      %
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {language === "fr" ? "Conversion" : "Conversion"}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCampaign(null)}
                  >
                    {language === "fr" ? "Fermer" : "Close"}
                  </Button>
                  <Button
                    onClick={() => toggleCampaignStatus(selectedCampaign.id)}
                    className={
                      selectedCampaign.status === "active"
                        ? "bg-yellow-600 hover:bg-yellow-700"
                        : "bg-green-600 hover:bg-green-700"
                    }
                  >
                    {selectedCampaign.status === "active" ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        {language === "fr" ? "Mettre en Pause" : "Pause"}
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        {language === "fr" ? "Activer" : "Activate"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MarketingAutomation;
