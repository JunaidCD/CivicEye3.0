import { MapComponent } from "@/components/map-component";
import { useQuery } from "@tanstack/react-query";
import { Property } from "@shared/schema";

export default function Map() {
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["/api/properties"],
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Interactive Property Map</h1>
          <p className="text-lg text-muted-foreground">
            Explore reported properties across the city. Click markers for details and status updates.
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        ) : (
          <MapComponent properties={properties} />
        )}
      </div>
    </div>
  );
}
