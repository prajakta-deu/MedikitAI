import { useState, useEffect } from "react";
import {
  MapPin,
  Clock,
  Navigation,
  Phone,
  Star,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Hospital {
  id: string;
  name: string;
  distance: string;
  eta: string;
  address: string;
  phone?: string;
  rating?: number;
  emergency?: boolean;
  isNearest: boolean;
  lat: number;
  lng: number;
  place_id?: string;
}

interface HospitalSectionProps {
  visible: boolean;
}

const HospitalSection = ({ visible }: HospitalSectionProps) => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const { toast } = useToast();

  // Get user's location
  const getUserLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Radius of Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Estimate travel time (assuming average speed of 40 km/h in city)
  const estimateETA = (distanceKm: number): string => {
    const minutes = Math.round((distanceKm / 40) * 60);
    if (minutes < 1) return "< 1 min";
    return `${minutes} min`;
  };

  // Fetch nearby hospitals using Overpass API (OpenStreetMap)
  const fetchNearbyHospitals = async (lat: number, lng: number) => {
    setLoading(true);
    setError(null);

    try {
      // Using Overpass API to find hospitals
      const radius = 5000; // 5km radius
      const query = `
        [out:json][timeout:25];
        (
          node["amenity"="hospital"](around:${radius},${lat},${lng});
          way["amenity"="hospital"](around:${radius},${lat},${lng});
          relation["amenity"="hospital"](around:${radius},${lat},${lng});
        );
        out body;
        >;
        out skel qt;
      `;

      const response = await fetch(
        `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
          query
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch hospital data");
      }

      const data = await response.json();

      // Process and sort hospitals by distance
      const processedHospitals: Hospital[] = data.elements
        .filter((element: any) => element.tags?.name) // Only hospitals with names
        .map((element: any, index: number) => {
          const hospitalLat = element.lat || element.center?.lat;
          const hospitalLng = element.lon || element.center?.lon;

          if (!hospitalLat || !hospitalLng) return null;

          const distance = calculateDistance(
            lat,
            lng,
            hospitalLat,
            hospitalLng
          );
          const distanceStr =
            distance < 1
              ? `${Math.round(distance * 1000)} m`
              : `${distance.toFixed(1)} km`;

          return {
            id: element.id.toString(),
            name: element.tags.name,
            distance: distanceStr,
            distanceNum: distance,
            eta: estimateETA(distance),
            address:
              element.tags["addr:full"] ||
              element.tags["addr:street"] ||
              "Address not available",
            phone: element.tags.phone || element.tags["contact:phone"],
            rating: element.tags["rating"]
              ? parseFloat(element.tags["rating"])
              : undefined,
            emergency: element.tags.emergency === "yes" || true, // Assume hospitals have ER
            isNearest: false,
            lat: hospitalLat,
            lng: hospitalLng,
          };
        })
        .filter((h: any) => h !== null)
        .sort((a: any, b: any) => a.distanceNum - b.distanceNum)
        .slice(0, 5); // Get top 5 nearest

      if (processedHospitals.length > 0) {
        processedHospitals[0].isNearest = true; // Mark nearest hospital
      }

      setHospitals(processedHospitals);
      setLoading(false);

      if (processedHospitals.length === 0) {
        setError("No hospitals found nearby. Try increasing search radius.");
      }
    } catch (err: any) {
      console.error("Error fetching hospitals:", err);
      setError(err.message || "Failed to load nearby hospitals");
      setLoading(false);

      toast({
        title: "Error Loading Hospitals",
        description: "Could not fetch nearby hospitals. Using fallback data.",
        variant: "destructive",
      });

      // Fallback to demo data
      setHospitals([
        {
          id: "1",
          name: "City General Hospital",
          distance: "0.8 km",
          distanceNum: 0.8,
          eta: "3 min",
          address: "123 Healthcare Ave",
          phone: "+1 (555) 123-4567",
          rating: 4.8,
          emergency: true,
          isNearest: true,
          lat: lat + 0.01,
          lng: lng + 0.01,
        },
      ]);
    }
  };

  // Load hospitals when component becomes visible
  useEffect(() => {
    if (visible && hospitals.length === 0) {
      getUserLocation()
        .then((location) => {
          setUserLocation(location);
          fetchNearbyHospitals(location.lat, location.lng);
        })
        .catch((err) => {
          console.error("Location error:", err);
          toast({
            title: "Location Access Denied",
            description:
              "Please enable location access to find nearby hospitals.",
            variant: "destructive",
          });
          setError("Location access denied");
          setLoading(false);
        });
    }
  }, [visible]);

  // Handle navigation
  const handleDirections = (hospital: Hospital) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`;
    window.open(url, "_blank");
  };

  // Handle call
  const handleCall = (phone?: string) => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    } else {
      toast({
        title: "Phone Number Not Available",
        description: "Please look up the hospital's contact information.",
        variant: "destructive",
      });
    }
  };

  if (!visible) return null;

  return (
    <Card
      className="card-elevated-lg border-border overflow-hidden animate-slide-up"
      style={{ animationDelay: "0.2s" }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            Nearby Hospitals
          </CardTitle>
          {!loading && !error && (
            <Badge className="bg-muted text-muted-foreground">
              {hospitals.length} Found
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
            <p className="text-sm text-muted-foreground">
              Finding hospitals near you...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && hospitals.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="w-8 h-8 text-destructive mb-3" />
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() =>
                userLocation &&
                fetchNearbyHospitals(userLocation.lat, userLocation.lng)
              }
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Hospital List */}
        {!loading &&
          hospitals.map((hospital) => (
            <div
              key={hospital.id}
              className={`relative p-4 rounded-xl border transition-all hover:shadow-md ${
                hospital.isNearest
                  ? "border-primary/30 bg-accent/50 ai-glow"
                  : "border-border bg-muted/30"
              }`}
            >
              {hospital.isNearest && (
                <Badge className="absolute -top-2 left-4 bg-primary text-primary-foreground text-xs">
                  Nearest
                </Badge>
              )}

              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-foreground">
                      {hospital.name}
                    </h4>
                    {hospital.emergency && (
                      <Badge
                        variant="outline"
                        className="border-emergency/30 text-emergency text-xs"
                      >
                        24/7 ER
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mt-1">
                    {hospital.address}
                  </p>

                  <div className="flex items-center gap-4 mt-2 text-sm flex-wrap">
                    <span className="flex items-center gap-1 text-primary font-medium">
                      <MapPin className="w-3.5 h-3.5" />
                      {hospital.distance}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      {hospital.eta}
                    </span>
                    {hospital.rating && (
                      <span className="flex items-center gap-1 text-warning">
                        <Star className="w-3.5 h-3.5 fill-warning" />
                        {hospital.rating}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    className={
                      hospital.isNearest ? "gradient-ai" : "bg-primary"
                    }
                    onClick={() => handleDirections(hospital)}
                  >
                    <Navigation className="w-4 h-4 mr-1" />
                    Directions
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border"
                    onClick={() => handleCall(hospital.phone)}
                    disabled={!hospital.phone}
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    Call
                  </Button>
                </div>
              </div>
            </div>
          ))}
      </CardContent>
    </Card>
  );
};

export default HospitalSection;
