import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "./dashboard/Sidebar";
import WidgetGrid from "./dashboard/WidgetGrid";
import PropertyList from "./properties/PropertyList";
import AIMatchingPanel from "./matching/AIMatchingPanel";
import { Button } from "./ui/button";
import { PlusCircle, Settings, BarChart3, Mail, Calendar } from "lucide-react";

const Home = () => {
  // Default language and currency state
  const [language, setLanguage] = React.useState("fr"); // 'fr' for French, 'en' for English
  const [currency, setCurrency] = React.useState("TND"); // TND, EUR, USD, GBP

  // Translations for the interface
  const translations = {
    fr: {
      dashboard: "Tableau de Bord",
      properties: "Biens Immobiliers",
      prospects: "Prospects",
      matching: "Matching IA",
      marketing: "Automatisation Marketing",
      prospecting: "Prospection Intelligente",
      settings: "Paramètres",
      addWidget: "Ajouter un Widget",
      customize: "Personnaliser",
      reports: "Rapports",
      emails: "Emails",
      appointments: "Rendez-vous",
    },
    en: {
      dashboard: "Dashboard",
      properties: "Properties",
      prospects: "Prospects",
      matching: "AI Matching",
      marketing: "Marketing Automation",
      prospecting: "Smart Prospecting",
      settings: "Settings",
      addWidget: "Add Widget",
      customize: "Customize",
      reports: "Reports",
      emails: "Emails",
      appointments: "Appointments",
    },
  };

  const t = translations[language];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        language={language}
        setLanguage={setLanguage}
        currency={currency}
        setCurrency={setCurrency}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="dashboard" className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="dashboard">{t.dashboard}</TabsTrigger>
              <TabsTrigger value="properties">{t.properties}</TabsTrigger>
              <TabsTrigger value="prospects">{t.prospects}</TabsTrigger>
              <TabsTrigger value="matching">{t.matching}</TabsTrigger>
              <TabsTrigger value="marketing">{t.marketing}</TabsTrigger>
              <TabsTrigger value="prospecting">{t.prospecting}</TabsTrigger>
            </TabsList>

            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                {t.addWidget}
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                {t.customize}
              </Button>
            </div>
          </div>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Quick Access Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t.reports}
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">
                    +2.5% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t.emails}
                  </CardTitle>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">
                    +10% from last week
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t.appointments}
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-xs text-muted-foreground">For today</p>
                </CardContent>
              </Card>
            </div>

            {/* Widget Grid */}
            <WidgetGrid language={language} currency={currency} />
          </TabsContent>

          {/* Properties Tab */}
          <TabsContent value="properties">
            <PropertyList language={language} currency={currency} />
          </TabsContent>

          {/* Prospects Tab */}
          <TabsContent value="prospects">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>
                  {language === "fr"
                    ? "Gestion des Prospects"
                    : "Prospect Management"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {language === "fr"
                    ? "Module de gestion des prospects avec filtres avancés et historique des interactions."
                    : "Prospect management module with advanced filters and interaction history."}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Matching Tab */}
          <TabsContent value="matching">
            <AIMatchingPanel language={language} currency={currency} />
          </TabsContent>

          {/* Marketing Automation Tab */}
          <TabsContent value="marketing">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>
                  {language === "fr"
                    ? "Automatisation Marketing"
                    : "Marketing Automation"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {language === "fr"
                    ? "Créez et gérez des campagnes marketing multi-canal (email, SMS, WhatsApp, Meta)."
                    : "Create and manage multi-channel marketing campaigns (email, SMS, WhatsApp, Meta)."}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Smart Prospecting Tab */}
          <TabsContent value="prospecting">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>
                  {language === "fr"
                    ? "Prospection Intelligente"
                    : "Smart Prospecting"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {language === "fr"
                    ? "Module de scraping et d'analyse IA pour identifier de nouvelles opportunités immobilières."
                    : "Scraping and AI analysis module to identify new real estate opportunities."}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Home;
