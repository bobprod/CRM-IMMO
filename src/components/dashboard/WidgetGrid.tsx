import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  X,
  MoveIcon,
  BarChart3,
  Users,
  Home,
  Calendar,
  TrendingUp,
  Settings,
} from "lucide-react";

interface WidgetProps {
  id: string;
  title: string;
  description?: string;
  content: React.ReactNode;
  width?: "small" | "medium" | "large";
}

interface WidgetGridProps {
  widgets?: WidgetProps[];
}

const WidgetGrid = ({ widgets = defaultWidgets }: WidgetGridProps) => {
  const [activeWidgets, setActiveWidgets] = useState<WidgetProps[]>(widgets);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const removeWidget = (id: string) => {
    setActiveWidgets(activeWidgets.filter((widget) => widget.id !== id));
  };

  const addWidget = (widget: WidgetProps) => {
    setActiveWidgets([...activeWidgets, widget]);
    setDialogOpen(false);
  };

  const getWidgetClass = (width?: "small" | "medium" | "large") => {
    switch (width) {
      case "small":
        return "col-span-1";
      case "large":
        return "col-span-3";
      case "medium":
      default:
        return "col-span-2";
    }
  };

  return (
    <div className="bg-background p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsCustomizing(!isCustomizing)}
          >
            {isCustomizing ? "Done" : "Customize"}
          </Button>
          {isCustomizing && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Widget
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Widget</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  {availableWidgets.map((widget) => (
                    <Card
                      key={widget.id}
                      className="cursor-pointer hover:border-primary transition-colors"
                      onClick={() => addWidget(widget)}
                    >
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm">
                          {widget.title}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {activeWidgets.map((widget) => (
          <Card
            key={widget.id}
            className={`${getWidgetClass(widget.width)} ${isCustomizing ? "border-dashed border-2" : ""}`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-sm font-medium">
                  {widget.title}
                </CardTitle>
                {widget.description && (
                  <CardDescription>{widget.description}</CardDescription>
                )}
              </div>
              {isCustomizing && (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoveIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive"
                    onClick={() => removeWidget(widget.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>{widget.content}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Default widgets with sample content
const defaultWidgets: WidgetProps[] = [
  {
    id: "active-leads",
    title: "Active Leads",
    description: "Current active leads in your pipeline",
    content: (
      <div className="flex items-center">
        <div className="flex flex-col">
          <div className="text-2xl font-bold">124</div>
          <div className="text-xs text-muted-foreground">
            +14% from last month
          </div>
        </div>
        <div className="ml-auto bg-primary/10 p-2 rounded-full">
          <Users className="h-6 w-6 text-primary" />
        </div>
      </div>
    ),
    width: "small",
  },
  {
    id: "available-properties",
    title: "Available Properties",
    description: "Properties currently on the market",
    content: (
      <div className="flex items-center">
        <div className="flex flex-col">
          <div className="text-2xl font-bold">87</div>
          <div className="text-xs text-muted-foreground">+5 new this week</div>
        </div>
        <div className="ml-auto bg-primary/10 p-2 rounded-full">
          <Home className="h-6 w-6 text-primary" />
        </div>
      </div>
    ),
    width: "small",
  },
  {
    id: "todays-appointments",
    title: "Today's Appointments",
    description: "Scheduled visits and meetings",
    content: (
      <div className="flex items-center">
        <div className="flex flex-col">
          <div className="text-2xl font-bold">8</div>
          <div className="text-xs text-muted-foreground">
            3 property viewings
          </div>
        </div>
        <div className="ml-auto bg-primary/10 p-2 rounded-full">
          <Calendar className="h-6 w-6 text-primary" />
        </div>
      </div>
    ),
    width: "small",
  },
  {
    id: "conversion-rate",
    title: "Conversion Rate",
    description: "Lead to client conversion",
    content: (
      <div className="flex items-center">
        <div className="flex flex-col">
          <div className="text-2xl font-bold">18.2%</div>
          <div className="text-xs text-muted-foreground">
            +2.1% from last quarter
          </div>
        </div>
        <div className="ml-auto bg-primary/10 p-2 rounded-full">
          <TrendingUp className="h-6 w-6 text-primary" />
        </div>
      </div>
    ),
    width: "small",
  },
  {
    id: "sales-overview",
    title: "Sales Overview",
    description: "Monthly performance metrics",
    content: (
      <div className="h-[200px] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <BarChart3 className="h-16 w-16 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Sales chart visualization
          </p>
        </div>
      </div>
    ),
    width: "medium",
  },
  {
    id: "recent-matches",
    title: "Recent AI Matches",
    description: "Properties matched to prospects",
    content: (
      <div className="space-y-4">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
          <div>
            <p className="text-sm font-medium">Villa Serenity</p>
            <p className="text-xs text-muted-foreground">
              Matched with 3 prospects (92% match)
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
          <div>
            <p className="text-sm font-medium">Modern Apartment</p>
            <p className="text-xs text-muted-foreground">
              Matched with 2 prospects (87% match)
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
          <div>
            <p className="text-sm font-medium">Downtown Office</p>
            <p className="text-xs text-muted-foreground">
              Matched with 1 prospect (74% match)
            </p>
          </div>
        </div>
      </div>
    ),
    width: "medium",
  },
];

// Additional widgets that can be added
const availableWidgets: WidgetProps[] = [
  {
    id: "market-trends",
    title: "Market Trends",
    description: "Real estate market analysis",
    content: (
      <div className="h-[150px] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <TrendingUp className="h-12 w-12 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Market trend visualization
          </p>
        </div>
      </div>
    ),
    width: "medium",
  },
  {
    id: "top-agents",
    title: "Top Performing Agents",
    description: "Agent performance ranking",
    content: (
      <div className="space-y-4">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
            <span className="text-xs font-bold">1</span>
          </div>
          <div>
            <p className="text-sm font-medium">Sophie Martin</p>
            <p className="text-xs text-muted-foreground">12 properties sold</p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
            <span className="text-xs font-bold">2</span>
          </div>
          <div>
            <p className="text-sm font-medium">Thomas Dubois</p>
            <p className="text-xs text-muted-foreground">9 properties sold</p>
          </div>
        </div>
      </div>
    ),
    width: "small",
  },
  {
    id: "system-status",
    title: "System Status",
    description: "CRM system performance",
    content: (
      <div className="flex items-center">
        <div className="flex flex-col">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm">All systems operational</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Last updated: 5 minutes ago
          </div>
        </div>
        <div className="ml-auto bg-primary/10 p-2 rounded-full">
          <Settings className="h-6 w-6 text-primary" />
        </div>
      </div>
    ),
    width: "small",
  },
];

export default WidgetGrid;
