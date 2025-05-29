import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "./dashboard/Sidebar";
import WidgetGrid from "./dashboard/WidgetGrid";
import PropertyList from "./properties/PropertyList";
import AIMatchingPanel from "./matching/AIMatchingPanel";
import ProspectManagement from "./prospects/ProspectManagement";
import Settings from "./settings/Settings";
import CalendarModule from "./calendar/CalendarModule";
import { Button } from "./ui/button";
import {
  PlusCircle,
  Settings as SettingsIcon,
  BarChart3,
  Mail,
  Calendar,
} from "lucide-react";

interface HomeProps {
  initialTab?: string;
}

const Home = ({ initialTab = "dashboard" }: HomeProps = {}) => {
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
      propertyManagement: "Gestion des Biens",
      searchProperties: "Rechercher des biens...",
      propertyType: "Type de Bien",
      status: "Statut",
      priceRange: "Gamme de Prix",
      features: "Caractéristiques",
      clearFilters: "Effacer les Filtres",
      applyFilters: "Appliquer les Filtres",
      wordpressSync: "Synchronisation WordPress",
      importFromWordpress: "Importer depuis WordPress",
      exportToWordpress: "Exporter vers WordPress",
      viewDetails: "Voir Détails",
      editProperty: "Modifier Bien",
      forSale: "À Vendre",
      forRent: "À Louer",
      sold: "Vendu",
      reserved: "Réservé",
      apartment: "Appartement",
      villa: "Villa",
      house: "Maison",
      studio: "Studio",
      commercial: "Commercial",
      land: "Terrain",
      swimmingPool: "Piscine",
      garden: "Jardin",
      garage: "Garage",
      balcony: "Balcon",
      elevator: "Ascenseur",
      security: "Sécurité",
      airConditioning: "Climatisation",
      heating: "Chauffage",
      furnished: "Meublé",
      seaView: "Vue Mer",
      mountainView: "Vue Montagne",
      cityView: "Vue Ville",
      kitchen: "Cuisine",
      parking: "Parking",
      terrace: "Terrasse",
      squareMeters: "Mètres Carrés",
      beds: "Chambres",
      baths: "Salles de Bain",
      documents: "Documents",
      uploadDocuments: "Télécharger Documents",
      plans: "Plans",
      certificates: "Certificats",
      propertyDocuments: "Documents du Bien",
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
      propertyManagement: "Property Management",
      searchProperties: "Search properties...",
      propertyType: "Property Type",
      status: "Status",
      priceRange: "Price Range",
      features: "Features",
      clearFilters: "Clear Filters",
      applyFilters: "Apply Filters",
      wordpressSync: "WordPress Synchronization",
      importFromWordpress: "Import from WordPress",
      exportToWordpress: "Export to WordPress",
      viewDetails: "View Details",
      editProperty: "Edit Property",
      forSale: "For Sale",
      forRent: "For Rent",
      sold: "Sold",
      reserved: "Reserved",
      apartment: "Apartment",
      villa: "Villa",
      house: "House",
      studio: "Studio",
      commercial: "Commercial",
      land: "Land",
      swimmingPool: "Swimming Pool",
      garden: "Garden",
      garage: "Garage",
      balcony: "Balcony",
      elevator: "Elevator",
      security: "Security",
      airConditioning: "Air Conditioning",
      heating: "Heating",
      furnished: "Furnished",
      seaView: "Sea View",
      mountainView: "Mountain View",
      cityView: "City View",
      kitchen: "Kitchen",
      parking: "Parking",
      terrace: "Terrace",
      squareMeters: "Square Meters",
      beds: "Beds",
      baths: "Baths",
      documents: "Documents",
      uploadDocuments: "Upload Documents",
      plans: "Plans",
      certificates: "Certificates",
      propertyDocuments: "Property Documents",
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
        <Tabs defaultValue={initialTab} className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="dashboard">{t.dashboard}</TabsTrigger>
              <TabsTrigger value="properties">{t.properties}</TabsTrigger>
              <TabsTrigger value="prospects">{t.prospects}</TabsTrigger>
              <TabsTrigger value="matching">{t.matching}</TabsTrigger>
              <TabsTrigger value="marketing">{t.marketing}</TabsTrigger>
              <TabsTrigger value="prospecting">{t.prospecting}</TabsTrigger>
              <TabsTrigger value="settings">{t.settings}</TabsTrigger>
              <TabsTrigger value="calendar">{t.appointments}</TabsTrigger>
            </TabsList>

            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                {t.addWidget}
              </Button>
              <Button variant="outline" size="sm">
                <SettingsIcon className="h-4 w-4 mr-2" />
                {t.customize}
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                {t.appointments}
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
            <ProspectManagement language={language} currency={currency} />
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

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Settings
              language={language}
              currency={currency}
              onLanguageChange={setLanguage}
              onCurrencyChange={setCurrency}
            />
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar">
            <CalendarModule language={language} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Home;
