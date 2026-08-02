export interface LocationResult {
  name: string;
  lat: number;
  lng: number;
  displayName: string;
}

// Bounding box for Andhra Pradesh and Telangana
const AP_TS_BOUNDS = "76.5,12.5,84.8,19.9";

export async function searchLocation(query: string): Promise<LocationResult[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    // We use Nominatim OpenStreetMap API, bounding the search to AP and TS regions
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&countrycodes=in&viewbox=${AP_TS_BOUNDS}&bounded=1`;
    
    const response = await fetch(url, {
      headers: {
        // Required by Nominatim policy
        "User-Agent": "HanumanTravels-PremiumApp/1.0",
        "Accept-Language": "en"
      }
    });

    if (!response.ok) return [];

    const data = await response.json();
    return data.map((item: any) => {
      // Simplify the display name
      const parts = item.display_name.split(", ");
      const name = parts[0];
      const details = parts.slice(1, 3).join(", ");
      return {
        name,
        displayName: `${name}, ${details}`,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon)
      };
    });
  } catch (error) {
    console.error("Geocoding failed", error);
    return [];
  }
}

// Fallback: Haversine distance with 1.25x road factor
function calculateFallbackDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightDistance = R * c;
  
  // Apply a road winding factor of 1.27
  return Math.round(straightDistance * 1.27);
}

export async function calculateJourneyMetrics(
  pickupLat: number, pickupLng: number, destLat: number, destLng: number
): Promise<{ distanceKm: number; durationStr: string }> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${pickupLng},${pickupLat};${destLng},${destLat}?overview=false`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const distanceKm = Math.round(data.routes[0].distance / 1000);
        const durationSec = data.routes[0].duration;
        
        const hrs = Math.floor(durationSec / 3600);
        const mins = Math.floor((durationSec % 3600) / 60);
        const durationStr = hrs > 0 ? `${hrs} hrs ${mins} mins` : `${mins} mins`;
        
        return { distanceKm, durationStr };
      }
    }
  } catch (error) {
    console.error("OSRM Routing failed. Using fallback.", error);
  }

  // Fallback calculation
  const distanceKm = calculateFallbackDistanceKm(pickupLat, pickupLng, destLat, destLng);
  // Assume average driving speed of 55 km/h in India
  const totalMins = Math.round((distanceKm / 55) * 60);
  const hrs = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  const durationStr = hrs > 0 ? `${hrs} hrs ${mins} mins` : `${mins} mins`;

  return { distanceKm, durationStr };
}