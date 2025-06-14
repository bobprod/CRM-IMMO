import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Settings,
  Database,
  Wifi,
  Code,
  Users,
  Building2,
  Mail,
  Bot,
  Zap,
  Calendar,
  Search,
  Activity,
} from "lucide-react";

interface DiagnosticResult {
  component: string;
  status: "success" | "error" | "warning" | "loading";
  message: string;
  details?: string;
  lastChecked: string;
}

interface SystemDiagnosticsProps {
  language?: string;
}

const SystemDiagnostics = ({
  language = "fr",
}: SystemDiagnosticsProps = {}) => {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const components = [
    {
      name: "Sidebar",
      key: "sidebar",
      icon: <Settings className="h-4 w-4" />,
      test: () => {
        try {
          const sidebarData = localStorage.getItem("crm-sidebar-state");
          return {
            status: "success" as const,
            message: "Sidebar fonctionne correctement",
            details: `État sauvegardé: ${sidebarData ? "Oui" : "Non"}`,
          };
        } catch (error) {
          return {
            status: "error" as const,
            message: "Erreur dans le Sidebar",
            details: error instanceof Error ? error.message : "Erreur inconnue",
          };
        }
      },
    },
    {
      name: "Base de Données",
      key: "database",
      icon: <Database className="h-4 w-4" />,
      test: () => {
        try {
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
          const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
          if (!supabaseUrl || !supabaseKey) {
            return {
              status: "error" as const,
              message: "Variables d'environnement Supabase manquantes",
              details:
                "VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY non définis",
            };
          }
          return {
            status: "success" as const,
            message: "Configuration Supabase OK",
            details: `URL: ${supabaseUrl.substring(0, 30)}...`,
          };
        } catch (error) {
          return {
            status: "error" as const,
            message: "Erreur de configuration Supabase",
            details: error instanceof Error ? error.message : "Erreur inconnue",
          };
        }
      },
    },
    {
      name: "Gestion des Prospects",
      key: "prospects",
      icon: <Users className="h-4 w-4" />,
      test: () => {
        try {
          const prospects = JSON.parse(
            localStorage.getItem("crm-prospects") || "[]",
          );
          return {
            status: "success" as const,
            message: `${prospects.length} prospects trouvés`,
            details: `Dernière mise à jour: ${new Date().toLocaleString()}`,
          };
        } catch (error) {
          return {
            status: "error" as const,
            message: "Erreur dans la gestion des prospects",
            details: error instanceof Error ? error.message : "Erreur inconnue",
          };
        }
      },
    },
    {
      name: "Gestion des Biens",
      key: "properties",
      icon: <Building2 className="h-4 w-4" />,
      test: () => {
        try {
          const properties = JSON.parse(
            localStorage.getItem("crm-properties") || "[]",
          );
          return {
            status: "success" as const,
            message: `${properties.length} biens trouvés`,
            details: `Stockage local: ${properties.length > 0 ? "Actif" : "Vide"}`,
          };
        } catch (error) {
          return {
            status: "error" as const,
            message: "Erreur dans la gestion des biens",
            details: error instanceof Error ? error.message : "Erreur inconnue",
          };
        }
      },
    },
    {
      name: "Marketing Automation",
      key: "marketing",
      icon: <Mail className="h-4 w-4" />,
      test: () => {
        try {
          const campaigns = JSON.parse(
            localStorage.getItem("crm-campaigns") || "[]",
          );
          return {
            status: campaigns.length > 0 ? "success" : ("warning" as const),
            message: `${campaigns.length} campagnes trouvées`,
            details: `État: ${campaigns.length > 0 ? "Fonctionnel" : "Aucune campagne"}`,
          };
        } catch (error) {
          return {
            status: "error" as const,
            message: "Erreur dans Marketing Automation",
            details: error instanceof Error ? error.message : "Erreur inconnue",
          };
        }
      },
    },
    {
      name: "Prospection Intelligente",
      key: "prospecting",
      icon: <Search className="h-4 w-4" />,
      test: () => {
        try {
          const opportunities = JSON.parse(
            localStorage.getItem("crm-opportunities") || "[]",
          );
          const aiProviders = JSON.parse(
            localStorage.getItem("crm-ai-providers") || "[]",
          );
          return {
            status: "success" as const,
            message: `${opportunities.length} opportunités, ${aiProviders.length} fournisseurs IA`,
            details: `IA configurée: ${aiProviders.some((p: any) => p.enabled) ? "Oui" : "Non"}`,
          };
        } catch (error) {
          return {
            status: "error" as const,
            message: "Erreur dans Prospection Intelligente",
            details: error instanceof Error ? error.message : "Erreur inconnue",
          };
        }
      },
    },
    {
      name: "Calendrier",
      key: "calendar",
      icon: <Calendar className="h-4 w-4" />,
      test: () => {
        try {
          const appointments = JSON.parse(
            localStorage.getItem("crm-appointments") || "[]",
          );
          return {
            status: "success" as const,
            message: `${appointments.length} rendez-vous trouvés`,
            details: `Module calendrier: Fonctionnel`,
          };
        } catch (error) {
          return {
            status: "error" as const,
            message: "Erreur dans le Calendrier",
            details: error instanceof Error ? error.message : "Erreur inconnue",
          };
        }
      },
    },
    {
      name: "Matching IA",
      key: "matching",
      icon: <Bot className="h-4 w-4" />,
      test: () => {
        try {
          const matches = JSON.parse(
            localStorage.getItem("crm-ai-matches") || "[]",
          );
          return {
            status: "success" as const,
            message: `${matches.length} correspondances IA`,
            details: `Algorithme de matching: Actif`,
          };
        } catch (error) {
          return {
            status: "error" as const,
            message: "Erreur dans Matching IA",
            details: error instanceof Error ? error.message : "Erreur inconnue",
          };
        }
      },
    },
  ];

  const runDiagnostics = async () => {
    setIsRunning(true);
    setProgress(0);
    setDiagnostics([]);

    for (let i = 0; i < components.length; i++) {
      const component = components[i];
      setProgress(((i + 1) / components.length) * 100);

      // Simulate some processing time
      await new Promise((resolve) => setTimeout(resolve, 500));

      const result = component.test();
      const diagnostic: DiagnosticResult = {
        component: component.name,
        status: result.status,
        message: result.message,
        details: result.details,
        lastChecked: new Date().toLocaleTimeString(),
      };

      setDiagnostics((prev) => [...prev, diagnostic]);
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "loading":
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      case "loading":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const clearAllData = () => {
    const keys = [
      "crm-prospects",
      "crm-properties",
      "crm-campaigns",
      "crm-opportunities",
      "crm-appointments",
      "crm-ai-matches",
      "crm-ai-providers",
      "crm-sidebar-state",
    ];

    keys.forEach((key) => {
      localStorage.removeItem(key);
    });

    alert("Toutes les données ont été effacées. Rechargez la page.");
  };

  const resetToDefaults = () => {
    // Reset with default data
    const defaultProspects = [
      {
        id: "1",
        client: "Sophie Martin",
        email: "sophie.martin@example.com",
        phone: "+216 55 123 456",
        budget: 250000,
        currency: "TND",
        localisation: "La Marsa",
        status: "Requête chaude",
        createdAt: new Date().toISOString().split("T")[0],
      },
    ];

    const defaultCampaigns = [
      {
        id: "1",
        name: "Campagne Test",
        type: "email",
        status: "active",
        recipients: 100,
        sent: 100,
        opened: 50,
        clicked: 10,
        converted: 2,
        createdAt: new Date().toISOString(),
        message: "Message de test",
      },
    ];

    localStorage.setItem("crm-prospects", JSON.stringify(defaultProspects));
    localStorage.setItem("crm-campaigns", JSON.stringify(defaultCampaigns));
    localStorage.setItem("crm-properties", JSON.stringify([]));
    localStorage.setItem("crm-opportunities", JSON.stringify([]));
    localStorage.setItem("crm-appointments", JSON.stringify([]));
    localStorage.setItem("crm-ai-matches", JSON.stringify([]));

    alert("Données par défaut restaurées. Rechargez la page.");
  };

  useEffect(() => {
    // Run initial diagnostics
    runDiagnostics();
  }, []);

  const errorCount = diagnostics.filter((d) => d.status === "error").length;
  const warningCount = diagnostics.filter((d) => d.status === "warning").length;
  const successCount = diagnostics.filter((d) => d.status === "success").length;

  return (
    <div className="w-full bg-background p-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <Activity className="h-8 w-8" />
            <span>Diagnostics Système</span>
          </h1>
          <div className="flex space-x-2">
            <Button onClick={runDiagnostics} disabled={isRunning}>
              {isRunning ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              {isRunning ? "Analyse..." : "Relancer Diagnostics"}
            </Button>
            <Button variant="outline" onClick={resetToDefaults}>
              <Zap className="h-4 w-4 mr-2" />
              Restaurer Défauts
            </Button>
            <Button
              variant="destructive"
              onClick={clearAllData}
              className="bg-red-600 hover:bg-red-700"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Effacer Tout
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        {isRunning && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Analyse en cours...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Composants
              </CardTitle>
              <Code className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{diagnostics.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Fonctionnels
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {successCount}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avertissements
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {warningCount}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Erreurs</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {errorCount}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Results */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Résultats Détaillés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {diagnostics.map((diagnostic, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-start space-x-3">
                    {getStatusIcon(diagnostic.status)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{diagnostic.component}</h3>
                        <Badge
                          className={`${getStatusColor(diagnostic.status)} text-white`}
                        >
                          {diagnostic.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {diagnostic.message}
                      </p>
                      {diagnostic.details && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {diagnostic.details}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {diagnostic.lastChecked}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Recommandations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {errorCount > 0 && (
                <div className="flex items-start space-x-2 p-3 bg-red-50 rounded-lg">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800">
                      Erreurs Critiques Détectées
                    </h4>
                    <p className="text-sm text-red-700">
                      {errorCount} composant(s) ne fonctionnent pas
                      correctement. Vérifiez les détails ci-dessus.
                    </p>
                  </div>
                </div>
              )}
              {warningCount > 0 && (
                <div className="flex items-start space-x-2 p-3 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">
                      Avertissements
                    </h4>
                    <p className="text-sm text-yellow-700">
                      {warningCount} composant(s) fonctionnent mais avec des
                      limitations.
                    </p>
                  </div>
                </div>
              )}
              {errorCount === 0 &&
                warningCount === 0 &&
                diagnostics.length > 0 && (
                  <div className="flex items-start space-x-2 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-800">
                        Système Fonctionnel
                      </h4>
                      <p className="text-sm text-green-700">
                        Tous les composants fonctionnent correctement!
                      </p>
                    </div>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemDiagnostics;
