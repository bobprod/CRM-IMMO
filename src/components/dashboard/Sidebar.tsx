import React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Building2,
  Users,
  Sparkles,
  Megaphone,
  Search,
  Settings,
  ChevronDown,
  LogOut,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps = {}) => {
  const [activeItem, setActiveItem] = React.useState("dashboard");
  const [language, setLanguage] = React.useState("fr"); // 'fr' for French, 'en' for English
  const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>({
    marketing: false,
    prospecting: false,
  });

  const toggleCollapsible = (key: string) => {
    setCollapsed((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "fr" ? "en" : "fr"));
  };

  const menuItems = [
    {
      id: "dashboard",
      label: language === "fr" ? "Tableau de Bord" : "Dashboard",
      icon: <Home className="h-5 w-5" />,
      path: "/",
    },
    {
      id: "properties",
      label: language === "fr" ? "Biens Immobiliers" : "Properties",
      icon: <Building2 className="h-5 w-5" />,
      path: "/properties",
    },
    {
      id: "prospects",
      label: language === "fr" ? "Prospects" : "Leads",
      icon: <Users className="h-5 w-5" />,
      path: "/prospects",
    },
    {
      id: "matching",
      label: language === "fr" ? "Matching IA" : "AI Matching",
      icon: <Sparkles className="h-5 w-5" />,
      path: "/matching",
    },
    {
      id: "marketing",
      label: language === "fr" ? "Marketing" : "Marketing",
      icon: <Megaphone className="h-5 w-5" />,
      isCollapsible: true,
      children: [
        {
          id: "campaigns",
          label: language === "fr" ? "Campagnes" : "Campaigns",
          path: "/marketing/campaigns",
        },
        {
          id: "automation",
          label: language === "fr" ? "Automatisation" : "Automation",
          path: "/marketing/automation",
        },
        {
          id: "analytics",
          label: language === "fr" ? "Analyses" : "Analytics",
          path: "/marketing/analytics",
        },
      ],
    },
    {
      id: "prospecting",
      label: language === "fr" ? "Prospection" : "Prospecting",
      icon: <Search className="h-5 w-5" />,
      isCollapsible: true,
      children: [
        {
          id: "scraping",
          label: language === "fr" ? "Scraping" : "Scraping",
          path: "/prospecting/scraping",
        },
        {
          id: "opportunities",
          label: language === "fr" ? "Opportunités" : "Opportunities",
          path: "/prospecting/opportunities",
        },
      ],
    },
    {
      id: "settings",
      label: language === "fr" ? "Paramètres" : "Settings",
      icon: <Settings className="h-5 w-5" />,
      path: "/settings",
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-full w-[280px] bg-card border-r border-border p-4",
        className,
      )}
    >
      {/* Logo and company name */}
      <div className="flex items-center mb-8 px-2">
        <div className="bg-primary h-8 w-8 rounded-md flex items-center justify-center text-primary-foreground font-bold text-lg">
          RI
        </div>
        <span className="ml-3 font-semibold text-lg">
          {language === "fr" ? "CRM Immobilier" : "Real Estate CRM"}
        </span>
      </div>

      {/* User profile section */}
      <div className="flex items-center px-2 py-4 mb-6 bg-muted/50 rounded-lg">
        <Avatar>
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div className="ml-3">
          <p className="font-medium text-sm">John Doe</p>
          <p className="text-xs text-muted-foreground">Agent Immobilier</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              {item.isCollapsible ? (
                <Collapsible
                  open={collapsed[item.id]}
                  onOpenChange={() => toggleCollapsible(item.id)}
                >
                  <CollapsibleTrigger asChild>
                    <button
                      className={cn(
                        "flex items-center justify-between w-full px-3 py-2 rounded-md text-sm",
                        activeItem === item.id
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-muted",
                      )}
                      onClick={() => setActiveItem(item.id)}
                    >
                      <div className="flex items-center">
                        {item.icon}
                        <span className="ml-3">{item.label}</span>
                      </div>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          collapsed[item.id] && "transform rotate-180",
                        )}
                      />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <ul className="pl-9 mt-1 space-y-1">
                      {item.children?.map((child) => (
                        <li key={child.id}>
                          <Link
                            to={child.path}
                            className={cn(
                              "block px-3 py-2 rounded-md text-sm",
                              activeItem === child.id
                                ? "bg-accent text-accent-foreground"
                                : "hover:bg-muted",
                            )}
                            onClick={() => setActiveItem(child.id)}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-sm",
                    activeItem === item.id
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-muted",
                  )}
                  onClick={() => setActiveItem(item.id)}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-4 space-y-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={toggleLanguage}
        >
          <Globe className="h-4 w-4 mr-2" />
          {language === "fr" ? "English" : "Français"}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-destructive hover:text-destructive"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {language === "fr" ? "Déconnexion" : "Logout"}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
