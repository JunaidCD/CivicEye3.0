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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Mumbai Property Map</h1>
          <p className="text-lg text-muted-foreground">
            Explore reported vacant properties across Mumbai. Zoom in to see detailed property information including AI detection scores, electricity usage, and citizen reports.
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        ) : (
          <MapComponent />
        )}
      </div>
    </div>
  );
}
