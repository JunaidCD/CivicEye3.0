import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Filter } from "lucide-react";
import { PropertyCard } from "@/components/property-card";
import { useQuery } from "@tanstack/react-query";
import { Property } from "@shared/schema";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Users, DollarSign, Building } from "lucide-react";
import { X, BadgeCheck } from "lucide-react";

function formatINR(amount: number | string) {
  const num = typeof amount === 'string' ? parseFloat(amount.replace(/[^\d.]/g, '')) : amount;
  if (isNaN(num)) return amount;
  return `₹${num.toLocaleString('en-IN')}`;
}

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["/api/properties"],
  });

  // Mumbai addresses for dummy/mock data
  const mumbaiAddresses = [
    "201 Marine Drive, Colaba, Mumbai",
    "14 Linking Road, Bandra West, Mumbai",
    "88 Sion Trombay Road, Chembur, Mumbai",
    "501 Hiranandani Gardens, Powai, Mumbai",
    "77 Palm Beach Road, Navi Mumbai",
    "A-12, LBS Marg, Mulund West, Mumbai",
    "3rd Floor, Oberoi Mall, Goregaon East, Mumbai",
    "Plot 22, Sector 30A, Vashi, Navi Mumbai",
    "B-101, Rustomjee Urbania, Thane West, Mumbai",
    "Shop 5, Lokhandwala Market, Andheri West, Mumbai"
  ];

  // Helper to get a random Mumbai address
  function getRandomMumbaiAddress(idx: number) {
    return mumbaiAddresses[idx % mumbaiAddresses.length];
  }

  // Map properties to override address and estimatedTaxLoss
  const mappedProperties = (properties as Property[]).map((property: Property, idx: number) => ({
    ...property,
    address: getRandomMumbaiAddress(idx),
    estimatedTaxLoss: property.estimatedTaxLoss
      ? (Math.round(parseFloat(property.estimatedTaxLoss) * 85)).toString() // Example conversion rate
      : property.estimatedTaxLoss,
  }));

  const filteredProperties = mappedProperties.filter((property: Property) => {
    const matchesSearch = property.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || property.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: mappedProperties.length,
    "Reported": mappedProperties.filter((p: Property) => p.status === "Reported").length,
    "Investigating": mappedProperties.filter((p: Property) => p.status === "Investigating").length,
    "Confirmed Vacant": mappedProperties.filter((p: Property) => p.status === "Confirmed Vacant").length,
    "Penalty Issued": mappedProperties.filter((p: Property) => p.status === "Penalty Issued").length,
  };

  // Dialog state
  const [openDialogId, setOpenDialogId] = useState<number | null>(null);
  const openDialog = (id: number) => setOpenDialogId(id);
  const closeDialog = () => setOpenDialogId(null);

  // Dialog content component
  function PropertyDialog({ property }: { property: Property }) {
    const statusColor =
      property.status === "Confirmed Vacant"
        ? "#ef4444"
        : property.status === "Reported"
        ? "#22c55e"
        : property.status === "Investigating"
        ? "#eab308"
        : property.status === "Penalty Issued"
        ? "#a21caf"
        : "#3b82f6";
    return (
      <div
        style={{
          minWidth: 340,
          maxWidth: 420,
          borderRadius: 18,
          boxShadow: "0 8px 32px 0 rgba(0,0,0,0.25)",
          padding: 28,
          background: "#23272f",
          color: "#fff",
          fontFamily: "inherit",
          lineHeight: 1.7,
          position: "relative",
        }}
      >
        <button
          onClick={closeDialog}
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            background: "transparent",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            fontSize: 20,
            zIndex: 2,
          }}
        >
          ×
        </button>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 20 }}>{property.address}</span>
          <span
            style={{
              marginLeft: 12,
              padding: "4px 16px",
              borderRadius: 14,
              fontSize: 14,
              fontWeight: 600,
              color: "#fff",
              background: statusColor,
              display: "inline-block",
            }}
          >
            {property.status}
          </span>
        </div>
        <div style={{ fontSize: 15, marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 7 }}>
            <TrendingUp size={16} color="#38bdf8" style={{ marginRight: 8 }} />
            <span>
              Vacancy Score: <span style={{ fontWeight: 600 }}>{property.vacancyScore}%</span>
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 7 }}>
            <Users size={16} color="#a3a3a3" style={{ marginRight: 8 }} />
            <span>
              Reports: <span style={{ fontWeight: 600 }}>{property.reportCount}</span>
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 7 }}>
            <BadgeCheck size={16} color="#facc15" style={{ marginRight: 8 }} />
            <span>
              Last Utility Reading: <span style={{ fontWeight: 600 }}>{property.lastUtilityReading ? property.lastUtilityReading.toString() : 'Never'}</span>
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 7 }}>
            <DollarSign size={16} color="#ef4444" style={{ marginRight: 8 }} />
            <span>
              Estimated Tax Loss: <span style={{ fontWeight: 600, color: '#ef4444' }}>{property.estimatedTaxLoss ? formatINR(property.estimatedTaxLoss) : 'N/A'}</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Property Dashboard</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Monitor vacant properties, track verification status, and manage enforcement actions in real-time.
          </p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <div className="relative">
                  <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <Input
                    placeholder="Search properties..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status ({statusCounts.all})</SelectItem>
                    <SelectItem value="Reported">Reported ({statusCounts["Reported"]})</SelectItem>
                    <SelectItem value="Investigating">Investigating ({statusCounts["Investigating"]})</SelectItem>
                    <SelectItem value="Confirmed Vacant">Confirmed Vacant ({statusCounts["Confirmed Vacant"]})</SelectItem>
                    <SelectItem value="Penalty Issued">Penalty Issued ({statusCounts["Penalty Issued"]})</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Link href="/reports">
                <Button className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>New Report</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mappedProperties.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Confirmed Vacant</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{statusCounts["Confirmed Vacant"]}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Under Investigation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{statusCounts["Investigating"]}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Recently Reported</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">{statusCounts["Reported"]}</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Property at {getRandomMumbaiAddress(0)} confirmed vacant</p>
                  <p className="text-xs text-muted-foreground">Reported by Junaid • 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New report submitted for {getRandomMumbaiAddress(1)}</p>
                  <p className="text-xs text-muted-foreground">Reported by Junaid • 5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Investigation started for {getRandomMumbaiAddress(2)}</p>
                  <p className="text-xs text-muted-foreground">Updated by City Inspector • 1 day ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/reports" className="block">
                <Button className="w-full" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Submit New Report
                </Button>
              </Link>
              <Link href="/map" className="block">
                <Button variant="outline" className="w-full" size="sm">
                  View Map
                </Button>
              </Link>
              <Link href="/leaderboard" className="block">
                <Button variant="outline" className="w-full" size="sm">
                  Check Leaderboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Blockchain Transparency Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Blockchain Transparency & Transactions</CardTitle>
            <p className="text-sm text-muted-foreground">
              All enforcement actions are recorded on the blockchain for complete transparency and accountability.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-2">127</div>
                <div className="text-sm text-muted-foreground">Total Transactions</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-2">{formatINR(4520000)}</div>
                <div className="text-sm text-muted-foreground">Tax Penalties Collected</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-2">98.5%</div>
                <div className="text-sm text-muted-foreground">Transaction Success Rate</div>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Tax Notice - {getRandomMumbaiAddress(3)}</p>
                    <p className="text-xs text-muted-foreground">0x4a7b...9e2f • {formatINR(2500)} penalty</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Confirmed</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-sm font-medium">Penalty Payment - {getRandomMumbaiAddress(4)}</p>
                    <p className="text-xs text-muted-foreground">0x8c1d...3f4a • {formatINR(1800)} penalty</p>
                  </div>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pending</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Properties Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <Card className="text-center p-12">
            <CardContent>
              <Filter className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Properties Found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filter criteria."
                  : "No properties have been reported yet."}
              </p>
              <Link href="/reports">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Report a Property
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProperties.map((property: Property) => (
              <PropertyCard 
                key={property.id} 
                property={property} 
                onViewDetails={(prop) => openDialog(prop.id)}
              />
            ))}
          </div>
        )}
      {/* Dialog Overlay */}
      {openDialogId && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.45)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <PropertyDialog property={filteredProperties.find(p => p.id === openDialogId)!} />
        </div>
      )}
      </div>
    </div>
  );
}
