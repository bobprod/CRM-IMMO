import React from "react";
import { Link, useNavigate } from "react-router-dom";
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
  User,
  Shield,
  UserCheck,
  Building,
  Crown,
} from "lucide-react";
import { useAuth } from "../auth/AuthProvider";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

interface SidebarProps {
  className?: string;
  language?: string;
  setLanguage?: (lang: string) => void;
  currency?: string;
  setCurrency?: (curr: string) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const Sidebar = ({
  className,
  language = "fr",
  setLanguage,
  currency = "TND",
  setCurrency,
  activeTab = "dashboard",
  onTabChange,
}: SidebarProps = {}) => {
  const [activeItem, setActiveItem] = React.useState(activeTab);
  const [userProfile, setUserProfile] = React.useState<any>(null);
  const navigate = useNavigate();
  const { user, signOut, supabase } = useAuth();

  // Update active item when activeTab prop changes
  React.useEffect(() => {
    setActiveItem(activeTab);
  }, [activeTab]);

  // Get user profile with agency info
  React.useEffect(() => {
    const getUserProfile = async () => {
      if (!user) {
        setUserProfile(null);
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from("users")
          .select(
            `
            *,
            agencies (
              id,
              name,
              subscription_plan
            )
          `,
          )
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching user profile:", error);
          // Create user profile if it doesn't exist
          const { data: newProfile, error: insertError } = await supabase
            .from("users")
            .insert({
              id: user.id,
              email: user.email,
              full_name:
                user.user_metadata?.full_name || user.email?.split("@")[0],
            })
            .select()
            .single();

          if (!insertError) {
            setUserProfile(newProfile);
          }
        } else {
          setUserProfile(profile);
        }
      } catch (error) {
        console.error("Error in getUserProfile:", error);
      }
    };

    getUserProfile();
  }, [user, supabase]);

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
    if (setLanguage) {
      setLanguage(language === "fr" ? "en" : "fr");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      // Clear any local storage data
      localStorage.removeItem("crm-prospects");
      localStorage.removeItem("crm-opportunities");
      localStorage.removeItem("crm-ai-providers");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "super_admin":
        return <Crown className="h-3 w-3 text-yellow-500" />;
      case "admin":
        return <Crown className="h-3 w-3" />;
      case "manager":
        return <Shield className="h-3 w-3" />;
      default:
        return <UserCheck className="h-3 w-3" />;
    }
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      fr: {
        super_admin: "Super Admin",
        admin: "Administrateur",
        manager: "Manager",
        agent: "Agent",
      },
      en: {
        super_admin: "Super Admin",
        admin: "Administrator",
        manager: "Manager",
        agent: "Agent",
      },
    };
    return labels[language]?.[role] || role;
  };

  const hasPermission = (permission: string) => {
    if (!userProfile) return false;
    if (userProfile.role === "super_admin" || userProfile.role === "admin")
      return true;
    if (
      userProfile.role === "manager" &&
      ["properties", "prospects", "marketing"].includes(permission)
    )
      return true;
    return permission === "basic";
  };

  const menuItems = [
    {
      id: "dashboard",
      label: language === "fr" ? "Tableau de Bord" : "Dashboard",
      icon: <Home className="h-5 w-5" />,
      path: "/dashboard",
      permission: "basic",
    },
    {
      id: "properties",
      label: language === "fr" ? "Biens Immobiliers" : "Properties",
      icon: <Building2 className="h-5 w-5" />,
      path: "/properties",
      permission: "properties",
    },
    {
      id: "prospects",
      label: language === "fr" ? "Prospects" : "Leads",
      icon: <Users className="h-5 w-5" />,
      path: "/prospects",
      permission: "prospects",
    },
    {
      id: "matching",
      label: language === "fr" ? "Matching IA" : "AI Matching",
      icon: <Sparkles className="h-5 w-5" />,
      path: "/matching",
      permission: "matching",
    },
    {
      id: "marketing",
      label: language === "fr" ? "Marketing" : "Marketing",
      icon: <Megaphone className="h-5 w-5" />,
      isCollapsible: true,
      permission: "marketing",
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
      permission: "prospecting",
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
      permission: "basic",
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    hasPermission(item.permission),
  );

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
      <div className="px-2 py-4 mb-6 bg-muted/50 rounded-lg space-y-3">
        <div className="flex items-center">
          <Avatar>
            <AvatarImage
              src={
                userProfile?.avatar_url ||
                user?.user_metadata?.avatar_url ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || "user"}`
              }
            />
            <AvatarFallback>
              {user?.email ? user.email.substring(0, 2).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="ml-3 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-sm truncate">
                {userProfile?.full_name ||
                  user?.user_metadata?.full_name ||
                  user?.email?.split("@")[0] ||
                  "Utilisateur"}
              </p>
              {userProfile?.role && (
                <Badge variant="secondary" className="text-xs px-1 py-0 h-5">
                  <div className="flex items-center gap-1">
                    {getRoleIcon(userProfile.role)}
                    {getRoleLabel(userProfile.role)}
                  </div>
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </div>

        {/* Agency info */}
        {userProfile?.agencies && (
          <div className="flex items-center gap-2 px-2 py-1 bg-background/50 rounded text-xs">
            <Building className="h-3 w-3 text-muted-foreground" />
            <span className="truncate">{userProfile.agencies.name}</span>
            {userProfile.agencies.subscription_plan && (
              <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                {userProfile.agencies.subscription_plan.toUpperCase()}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {filteredMenuItems.map((item) => (
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
                      onClick={() => {
                        setActiveItem(item.id);
                        if (onTabChange) onTabChange(item.id);
                      }}
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
                            onClick={() => {
                              setActiveItem(child.id);
                              if (onTabChange) onTabChange(child.id);
                            }}
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
                  onClick={() => {
                    setActiveItem(item.id);
                    if (onTabChange) onTabChange(item.id);
                  }}
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
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
          disabled={!user}
        >
          <LogOut className="h-4 w-4 mr-2" />
          {language === "fr" ? "Déconnexion" : "Logout"}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
