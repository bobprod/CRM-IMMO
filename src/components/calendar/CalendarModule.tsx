import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Plus,
  Clock,
  MapPin,
  User,
  FileText,
  Phone,
  Mail,
} from "lucide-react";

interface Appointment {
  id: string;
  title: string;
  type: "viewing" | "signing" | "meeting" | "call";
  date: string;
  time: string;
  duration: number;
  location: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  propertyTitle?: string;
  notes: string;
  status: "scheduled" | "confirmed" | "completed" | "cancelled";
}

interface CalendarModuleProps {
  language?: string;
  externalAppointments?: Appointment[];
}

const CalendarModule = ({
  language = "fr",
  externalAppointments = [],
}: CalendarModuleProps = {}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      title: "Visite Villa La Marsa",
      type: "viewing",
      date: "2024-01-25",
      time: "10:00",
      duration: 60,
      location: "Villa Moderne, La Marsa",
      clientName: "Sophie Martin",
      clientEmail: "sophie.martin@example.com",
      clientPhone: "+216 55 123 456",
      propertyTitle: "Villa Moderne avec Vue Mer",
      notes: "Client intéressé par la vue mer",
      status: "confirmed",
    },
    {
      id: "2",
      title: "Signature Contrat",
      type: "signing",
      date: "2024-01-25",
      time: "14:30",
      duration: 90,
      location: "Bureau Notaire, Centre-ville",
      clientName: "Ahmed Ben Ali",
      clientEmail: "ahmed.benali@example.com",
      clientPhone: "+216 99 876 543",
      propertyTitle: "Appartement Lac 2",
      notes: "Finalisation achat appartement",
      status: "scheduled",
    },
  ]);

  // Load appointments from localStorage and external sources
  useEffect(() => {
    const loadAppointments = () => {
      const storedAppointments = JSON.parse(
        localStorage.getItem("crm-appointments") || "[]",
      );
      const allAppointments = [
        ...appointments,
        ...storedAppointments,
        ...externalAppointments,
      ];

      // Remove duplicates based on id
      const uniqueAppointments = allAppointments.filter(
        (appointment, index, self) =>
          index === self.findIndex((a) => a.id === appointment.id),
      );

      setAppointments(uniqueAppointments);
    };

    loadAppointments();
  }, [externalAppointments]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>({
    title: "",
    type: "viewing",
    date: "",
    time: "",
    duration: 60,
    location: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    propertyTitle: "",
    notes: "",
    status: "scheduled",
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "viewing":
        return "bg-blue-500";
      case "signing":
        return "bg-green-500";
      case "meeting":
        return "bg-purple-500";
      case "call":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500";
      case "scheduled":
        return "bg-blue-500";
      case "completed":
        return "bg-gray-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      fr: {
        viewing: "Visite",
        signing: "Signature",
        meeting: "Réunion",
        call: "Appel",
      },
      en: {
        viewing: "Viewing",
        signing: "Signing",
        meeting: "Meeting",
        call: "Call",
      },
    };
    return labels[language as keyof typeof labels][
      type as keyof typeof labels.fr
    ];
  };

  const handleAddAppointment = () => {
    const appointment: Appointment = {
      ...newAppointment,
      id: Date.now().toString(),
    } as Appointment;

    const updatedAppointments = [...appointments, appointment];
    setAppointments(updatedAppointments);

    // Store in localStorage
    const storedAppointments = JSON.parse(
      localStorage.getItem("crm-appointments") || "[]",
    );
    storedAppointments.push(appointment);
    localStorage.setItem(
      "crm-appointments",
      JSON.stringify(storedAppointments),
    );

    setNewAppointment({
      title: "",
      type: "viewing",
      date: "",
      time: "",
      duration: 60,
      location: "",
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      propertyTitle: "",
      notes: "",
      status: "scheduled",
    });
    setIsAddDialogOpen(false);
  };

  const today = new Date().toISOString().split("T")[0];
  const todayAppointments = appointments.filter((apt) => apt.date === today);

  const upcomingAppointments = appointments
    .filter((apt) => new Date(apt.date) >= new Date() && apt.date !== today)
    .sort(
      (a, b) =>
        new Date(a.date + " " + a.time).getTime() -
        new Date(b.date + " " + b.time).getTime(),
    );

  return (
    <div className="w-full bg-background p-6">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Calendar className="h-8 w-8" />
            <h1 className="text-3xl font-bold">
              {language === "fr"
                ? "Calendrier & Rendez-vous"
                : "Calendar & Appointments"}
            </h1>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {language === "fr" ? "Nouveau RDV" : "New Appointment"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {language === "fr"
                    ? "Nouveau Rendez-vous"
                    : "New Appointment"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    {language === "fr" ? "Titre" : "Title"}
                  </Label>
                  <Input
                    id="title"
                    value={newAppointment.title}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        title: e.target.value,
                      })
                    }
                    placeholder="Visite Villa..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">
                    {language === "fr" ? "Type" : "Type"}
                  </Label>
                  <Select
                    value={newAppointment.type}
                    onValueChange={(value) =>
                      setNewAppointment({
                        ...newAppointment,
                        type: value as any,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewing">
                        {language === "fr" ? "Visite" : "Viewing"}
                      </SelectItem>
                      <SelectItem value="signing">
                        {language === "fr" ? "Signature" : "Signing"}
                      </SelectItem>
                      <SelectItem value="meeting">
                        {language === "fr" ? "Réunion" : "Meeting"}
                      </SelectItem>
                      <SelectItem value="call">
                        {language === "fr" ? "Appel" : "Call"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">
                    {language === "fr" ? "Date" : "Date"}
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        date: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">
                    {language === "fr" ? "Heure" : "Time"}
                  </Label>
                  <div className="relative">
                    <Input
                      id="time"
                      type="time"
                      value={newAppointment.time}
                      onChange={(e) =>
                        setNewAppointment({
                          ...newAppointment,
                          time: e.target.value,
                        })
                      }
                      step="900"
                      min="06:00"
                      max="22:00"
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      {language === "fr"
                        ? "Disponible de 06:00 à 22:00 (par tranches de 15min)"
                        : "Available from 06:00 to 22:00 (15min intervals)"}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">
                    {language === "fr"
                      ? "Durée (minutes)"
                      : "Duration (minutes)"}
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newAppointment.duration}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        duration: Number(e.target.value),
                      })
                    }
                    placeholder="60"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">
                    {language === "fr" ? "Lieu" : "Location"}
                  </Label>
                  <Input
                    id="location"
                    value={newAppointment.location}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        location: e.target.value,
                      })
                    }
                    placeholder="Adresse du rendez-vous"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientName">
                    {language === "fr" ? "Nom du client" : "Client Name"}
                  </Label>
                  <Input
                    id="clientName"
                    value={newAppointment.clientName}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        clientName: e.target.value,
                      })
                    }
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientEmail">
                    {language === "fr" ? "Email du client" : "Client Email"}
                  </Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={newAppointment.clientEmail}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        clientEmail: e.target.value,
                      })
                    }
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientPhone">
                    {language === "fr" ? "Téléphone du client" : "Client Phone"}
                  </Label>
                  <Input
                    id="clientPhone"
                    value={newAppointment.clientPhone}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        clientPhone: e.target.value,
                      })
                    }
                    placeholder="+216 XX XXX XXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propertyTitle">
                    {language === "fr" ? "Bien immobilier" : "Property"}
                  </Label>
                  <Input
                    id="propertyTitle"
                    value={newAppointment.propertyTitle}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        propertyTitle: e.target.value,
                      })
                    }
                    placeholder="Villa Moderne..."
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="notes">
                    {language === "fr" ? "Notes" : "Notes"}
                  </Label>
                  <Textarea
                    id="notes"
                    value={newAppointment.notes}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        notes: e.target.value,
                      })
                    }
                    placeholder="Notes additionnelles..."
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  {language === "fr" ? "Annuler" : "Cancel"}
                </Button>
                <Button onClick={handleAddAppointment}>
                  {language === "fr" ? "Créer" : "Create"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === "fr"
                ? "Rendez-vous d'aujourd'hui"
                : "Today's Appointments"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayAppointments.length > 0 ? (
              <div className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center space-x-4 p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{appointment.time}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{appointment.title}</h3>
                        <Badge
                          className={`${getTypeColor(appointment.type)} text-white`}
                        >
                          {getTypeLabel(appointment.type)}
                        </Badge>
                        <Badge
                          className={`${getStatusColor(appointment.status)} text-white`}
                        >
                          {appointment.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{appointment.clientName}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{appointment.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                {language === "fr"
                  ? "Aucun rendez-vous aujourd'hui"
                  : "No appointments today"}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === "fr"
                ? "Prochains rendez-vous"
                : "Upcoming Appointments"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${appointment.clientName}`}
                          alt={appointment.clientName}
                        />
                        <AvatarFallback>
                          {appointment.clientName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">{appointment.title}</h3>
                          <Badge
                            className={`${getTypeColor(appointment.type)} text-white`}
                          >
                            {getTypeLabel(appointment.type)}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{appointment.date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{appointment.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{appointment.location}</span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm">
                            <span className="font-medium">
                              {language === "fr" ? "Client:" : "Client:"}
                            </span>{" "}
                            {appointment.clientName}
                          </p>
                          {appointment.propertyTitle && (
                            <p className="text-sm">
                              <span className="font-medium">
                                {language === "fr" ? "Bien:" : "Property:"}
                              </span>{" "}
                              {appointment.propertyTitle}
                            </p>
                          )}
                        </div>
                        {appointment.notes && (
                          <div className="mt-2 p-2 bg-muted rounded text-sm">
                            <div className="flex items-center space-x-1 mb-1">
                              <FileText className="h-3 w-3" />
                              <span className="font-medium">
                                {language === "fr" ? "Notes:" : "Notes:"}
                              </span>
                            </div>
                            <p>{appointment.notes}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Badge
                          className={`${getStatusColor(appointment.status)} text-white`}
                        >
                          {appointment.status}
                        </Badge>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarModule;
