import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { X, Zap, Calendar, Users, MapPin } from "lucide-react";

// Custom colored marker icons
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
const yellowIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const mumbaiProperties = [
  {
    id: 1,
    address: "123 Marine Drive, Colaba, Mumbai",
    lat: 19.0760,
    lng: 72.8777,
    propertyType: "Residential",
    status: "Confirmed Vacant",
    vacancyScore: 95,
    reportCount: 12,
    lastUtilityReading: "2024-01-15",
    estimatedTaxLoss: "45000",
    aiDetectionScore: 92,
    lastElectricityUsage: "2024-01-10",
    citizenReports: 8,
    propertyValue: "₹2.5 Crore",
    ownerContact: "+91 98765 43210"
  },
  {
    id: 2,
    address: "456 Bandra West, Mumbai",
    lat: 19.0544,
    lng: 72.8402,
    propertyType: "Commercial",
    status: "Investigating",
    vacancyScore: 78,
    reportCount: 5,
    lastUtilityReading: "2024-02-01",
    estimatedTaxLoss: "32000",
    aiDetectionScore: 85,
    lastElectricityUsage: "2024-01-28",
    citizenReports: 3,
    propertyValue: "₹1.8 Crore",
    ownerContact: "+91 98765 43211"
  },
  {
    id: 3,
    address: "789 Andheri East, Mumbai",
    lat: 19.1197,
    lng: 72.8696,
    propertyType: "Residential",
    status: "Reported",
    vacancyScore: 65,
    reportCount: 3,
    lastUtilityReading: "2024-02-05",
    estimatedTaxLoss: "28000",
    aiDetectionScore: 72,
    lastElectricityUsage: "2024-02-01",
    citizenReports: 2,
    propertyValue: "₹1.5 Crore",
    ownerContact: "+91 98765 43212"
  },
  {
    id: 4,
    address: "321 Vashi, Navi Mumbai",
    lat: 19.0710,
    lng: 72.9986,
    propertyType: "Commercial",
    status: "Confirmed Vacant",
    vacancyScore: 88,
    reportCount: 15,
    lastUtilityReading: "2024-01-20",
    estimatedTaxLoss: "55000",
    aiDetectionScore: 89,
    lastElectricityUsage: "2024-01-15",
    citizenReports: 12,
    propertyValue: "₹3.2 Crore",
    ownerContact: "+91 98765 43213"
  },
  {
    id: 5,
    address: "567 Thane West, Thane",
    lat: 19.2183,
    lng: 72.9781,
    propertyType: "Residential",
    status: "Investigating",
    vacancyScore: 82,
    reportCount: 6,
    lastUtilityReading: "2024-02-10",
    estimatedTaxLoss: "42000",
    aiDetectionScore: 87,
    lastElectricityUsage: "2024-02-05",
    citizenReports: 4,
    propertyValue: "₹2.8 Crore",
    ownerContact: "+91 98765 43214"
  },
  {
    id: 6,
    address: "890 Worli, Mumbai",
    lat: 19.0176,
    lng: 72.8169,
    propertyType: "Residential",
    status: "Reported",
    vacancyScore: 71,
    reportCount: 4,
    lastUtilityReading: "2024-02-15",
    estimatedTaxLoss: "25000",
    aiDetectionScore: 76,
    lastElectricityUsage: "2024-02-10",
    citizenReports: 3,
    propertyValue: "₹1.9 Crore",
    ownerContact: "+91 98765 43215"
  }
];

function getMarkerIcon(status: string) {
  if (status === "Confirmed Vacant") return redIcon;
  if (status === "Reported") return greenIcon;
  if (status === "Investigating") return yellowIcon;
  return greenIcon;
}

function PropertyPopup({ property }: { property: any }) {
  const statusColor =
    property.status === "Confirmed Vacant"
      ? "#ef4444"
      : property.status === "Reported"
      ? "#22c55e"
      : "#eab308";
  return (
    <div
      style={{
        minWidth: 260,
        borderRadius: 16,
        boxShadow: "0 4px 24px 0 rgba(0,0,0,0.18)",
        padding: 20,
        background: "#23272f",
        color: "#fff",
        fontFamily: "inherit",
        lineHeight: 1.7,
        position: "relative",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontWeight: 700, fontSize: 18 }}>{property.address}</span>
        <span
          style={{
            marginLeft: 10,
            padding: "3px 14px",
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 600,
            color: "#fff",
            background: statusColor,
            display: "inline-block",
          }}
        >
          {property.status}
        </span>
      </div>
      <div style={{ fontSize: 15 }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
          <Zap size={16} color="#facc15" style={{ marginRight: 8 }} />
          <span>
            AI Detection Score: <span style={{ color: "#22c55e", fontWeight: 600 }}>{property.aiDetectionScore}%</span>
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
          <Calendar size={16} color="#60a5fa" style={{ marginRight: 8 }} />
          <span>
            Last Electricity: <span style={{ fontWeight: 600 }}>{property.lastElectricityUsage}</span>
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
          <Users size={16} color="#a78bfa" style={{ marginRight: 8 }} />
          <span>
            Citizen Reports: <span style={{ fontWeight: 600 }}>{property.citizenReports}</span>
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
          <MapPin size={16} color="#f87171" style={{ marginRight: 8 }} />
          <span>
            Property Value: <span style={{ fontWeight: 600 }}>{property.propertyValue}</span>
          </span>
        </div>
        <div
          style={{
            marginTop: 10,
            borderTop: "1px solid #374151",
            paddingTop: 10,
            fontSize: 15,
          }}
        >
          <span>
            Vacancy Score: <span style={{ color: "#ef4444", fontWeight: 600 }}>{property.vacancyScore}%</span>
          </span>
          <br />
          <span>
            Tax Loss: <span style={{ color: "#ef4444", fontWeight: 600 }}>₹{parseFloat(property.estimatedTaxLoss).toLocaleString()}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export function MapComponent() {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const properties = mumbaiProperties;

  const filteredProperties = statusFilter === "all" 
    ? properties 
    : properties.filter(p => p.status === statusFilter);

  const mapStats = {
    confirmedVacant: properties.filter(p => p.status === "Confirmed Vacant").length,
    investigating: properties.filter(p => p.status === "Investigating").length,
    reported: properties.filter(p => p.status === "Reported").length,
    totalReports: properties.length,
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
          <CardTitle>Mumbai Property Map View</CardTitle>
          <p className="text-sm text-muted-foreground">
            Interactive map showing reported vacant properties across Mumbai, Navi Mumbai, and Thane. Zoom in to see property markers with detailed information.
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
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Reported</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Investigating</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Vacant</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real Map Container - React Leaflet */}
      <Card>
        <CardContent className="p-0">
          <div className="h-96 lg:h-[500px] relative overflow-hidden">
            <MapContainer
              center={[19.11, 72.91]}
              zoom={14}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredProperties.map((property) => (
                <Marker
                  key={property.id}
                  position={[property.lat, property.lng]}
                  icon={getMarkerIcon(property.status)}
                >
                  <Popup>
                    <PropertyPopup property={property} />
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
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