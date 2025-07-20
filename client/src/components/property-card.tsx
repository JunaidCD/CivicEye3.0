import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building, MapPin, TrendingUp, DollarSign } from "lucide-react";
import { Property } from "@shared/schema";

function formatINR(amount: number | string) {
  const num = typeof amount === 'string' ? parseFloat(amount.replace(/[^\d.]/g, '')) : amount;
  if (isNaN(num)) return amount;
  return `₹${num.toLocaleString('en-IN')}`;
}

interface PropertyCardProps {
  property: Property;
  onViewDetails?: (property: Property) => void;
}

export function PropertyCard({ property, onViewDetails }: PropertyCardProps) {
  const getPropertyImage = (propertyId: number, propertyType: string) => {
    const images = {
      1: "https://plus.unsplash.com/premium_photo-1724766574079-a652075b281b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGVtcHR5JTIwYnVpbGRpbmd8ZW58MHx8MHx8fDA%3D", // residential house
      2: "https://media.istockphoto.com/id/616244526/photo/interior-of-empty-warehouse.webp?a=1&b=1&s=612x612&w=0&k=20&c=r134g5wTdINAUxpmwP5e3JdVjw9O47BF_7-1maF8ahQ=", // commercial building
      3: "https://media.istockphoto.com/id/493107912/photo/dubai-construction.webp?a=1&b=1&s=612x612&w=0&k=20&c=u7yIrxjEzozjt-ULCVvjIWX7c-eR5d1ghQubLBxccYk=", // apartment building
      4: "https://images.unsplash.com/photo-1644668613343-e01841d0afcf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZW1wdHklMjBzaG9wfGVufDB8fDB8fHww", // industrial warehouse
      5: "https://images.unsplash.com/photo-1508450859948-4e04fabaa4ea?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29uc3RydWN0aW9uJTIwYnVpbGRpbmd8ZW58MHx8MHx8fDA%3D", // residential house 2
      6: "https://media.istockphoto.com/id/173844022/photo/real-estate.webp?a=1&b=1&s=612x612&w=0&k=20&c=7N3MHJGGrxmnSMtdwuquUWYEuOfqYOtnfSCZLafHLd8=", // mixed use building
      7: "https://images.unsplash.com/photo-1562879887-d735a9da348b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmFjYW50JTIwaG9tZXxlbnwwfHwwfHx8MA%3D%3D", // multi-family
      8: "https://images.unsplash.com/photo-1647102252548-21beb646944b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmFjYW50JTIwc2hvcHxlbnwwfHwwfHx8MA%3D%3D", // industrial 2
    };
    return images[propertyId as keyof typeof images] || images[1];
  };
  const getStatusColor = (status: string) => {
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

  const formatTimeAgo = (date: Date | null) => {
    if (!date) return "Never";
    const now = new Date();
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const diff = now.getTime() - dateObj.getTime();
    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
    return `${months} month${months !== 1 ? 's' : ''} ago`;
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="h-48 relative overflow-hidden">
        <img 
          src={getPropertyImage(property.id, property.propertyType)}
          alt={property.address}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=800&auto=format&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-4 right-4">
          <Badge className={`${getStatusColor(property.status)} text-white`}>
            {property.status}
          </Badge>
        </div>
        <div className="absolute bottom-4 left-4">
          <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm">
            <TrendingUp className="w-4 h-4 inline mr-1" />
            Vacancy Score: <span className="font-bold">{property.vacancyScore}%</span>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="flex items-start space-x-2 mb-2">
          <MapPin className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
          <h3 className="text-lg font-semibold">{property.address}</h3>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Reports:</span>
            <span className="font-medium">{property.reportCount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Last Utility Reading:</span>
            <span className="font-medium">{formatTimeAgo(property.lastUtilityReading)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Estimated Tax Loss:</span>
            <span className="font-medium text-destructive flex items-center">
              <DollarSign className="w-3 h-3 mr-1" />
              {property.estimatedTaxLoss ? formatINR(property.estimatedTaxLoss) : 'N/A'}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <div className="flex space-x-2 w-full">
          <Button 
            variant="outline" 
            className="flex-1" 
            size="sm"
            onClick={() => onViewDetails?.(property)}
          >
            View Details
          </Button>
          <Button 
            className="flex-1" 
            size="sm"
            variant={property.status === "Confirmed Vacant" ? "destructive" : "default"}
          >
            {property.status === "Confirmed Vacant" ? "Issue Notice" : "Investigate"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
