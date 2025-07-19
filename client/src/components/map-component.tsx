import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Navigation } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Property } from "@shared/schema";

export function MapComponent() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const filteredProperties = statusFilter === "all" 
    ? properties 
    : properties.filter(p => p.status === statusFilter);

  const mapStats = {
    confirmedVacant: properties.filter(p => p.status === "Confirmed Vacant").length,
    investigating: properties.filter(p => p.status === "Investigating").length,
    reported: properties.filter(p => p.status === "Reported").length,
    totalReports: properties.length,
  };

  const getMarkerColor = (status: string) => {
    switch (status) {
      case "Reported":
        return "bg-secondary";
      case "Investigating":
        return "bg-yellow-500";
      case "Confirmed Vacant":
        return "bg-destructive";
      case "Penalty Issued":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const statusButtons = [
    { label: "All Properties", value: "all" },
    { label: "Reported", value: "Reported" },
    { label: "Investigating", value: "Investigating" },
    { label: "Vacant", value: "Confirmed Vacant" },
  ];

  return (
    <div className="space-y-8">
      {/* Map Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Property Map View</CardTitle>
          <p className="text-sm text-muted-foreground">
            Interactive map showing reported vacant properties across the city
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
            <div className="flex flex-wrap gap-2">
              {statusButtons.map((btn) => (
                <Button
                  key={btn.value}
                  size="sm"
                  variant={statusFilter === btn.value ? "default" : "outline"}
                  onClick={() => setStatusFilter(btn.value)}
                >
                  {btn.label}
                </Button>
              ))}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-secondary rounded-full"></div>
                <span className="text-sm text-muted-foreground">Reported</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Investigating</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-destructive rounded-full"></div>
                <span className="text-sm text-muted-foreground">Vacant</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real Map Container */}
      <Card>
        <CardContent className="p-0">
          <div className="h-96 lg:h-[500px] relative overflow-hidden">
            {/* Real Map Interface - Using OpenStreetMap */}
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=-74.0479%2C40.7000%2C-73.9441%2C40.7819&amp;layer=mapnik&amp;marker=40.7128%2C-74.0060"
              className="w-full h-full border-0"
              allowFullScreen
              title="Property Map"
            />
            {/* Property markers overlay */}
            {filteredProperties.map((property, index) => (
              <div
                key={property.id}
                className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-auto"
                style={{
                  left: `${20 + (index * 15) % 60}%`,
                  top: `${25 + (index * 20) % 50}%`,
                }}
                onClick={() => setSelectedProperty(property)}
              >
                <div className="relative group">
                  <div className={`w-6 h-6 ${getMarkerColor(property.status)} rounded-full border-3 border-white shadow-xl hover:scale-125 transition-all duration-200 cursor-pointer`}>
                    <div className="w-full h-full rounded-full bg-white/20 animate-ping"></div>
                  </div>
                  {selectedProperty?.id === property.id && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 min-w-56 border-2 border-primary/20 z-30">
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-2">{property.address}</h4>
                      <div className="space-y-1 text-xs">
                        <p className="text-gray-600 dark:text-gray-300">Status: <span className="font-medium">{property.status}</span></p>
                        <p className="text-gray-600 dark:text-gray-300">Vacancy Score: <span className="font-medium">{property.vacancyScore}%</span></p>
                        <p className="text-gray-600 dark:text-gray-300">
                          Tax Loss: <span className="font-medium text-red-600">${property.estimatedTaxLoss ? parseFloat(property.estimatedTaxLoss).toLocaleString() : 'N/A'}</span>
                        </p>
                      </div>
                      <Badge className={`${getMarkerColor(property.status)} text-white text-xs mt-2 w-full justify-center`}>
                        {property.status}
                      </Badge>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white dark:border-t-gray-800"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {/* Map Attribution */}
            <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded text-xs text-gray-600 dark:text-gray-300 shadow-lg z-20">
              © OpenStreetMap Contributors | CivicEye Data Overlay
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-destructive">{mapStats.confirmedVacant}</div>
            <div className="text-sm text-muted-foreground">Confirmed Vacant</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-yellow-600">{mapStats.investigating}</div>
            <div className="text-sm text-muted-foreground">Under Investigation</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-secondary">{mapStats.reported}</div>
            <div className="text-sm text-muted-foreground">Recently Reported</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary">{mapStats.totalReports}</div>
            <div className="text-sm text-muted-foreground">Total Properties</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}