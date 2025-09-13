export interface GeoLocation {
  id: string;
  lat: number;
  lng: number;
  alt: number;
  spd: number;
  azm: number;
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface GeoRoute {
  points: GeoPoint[];
  distance: number;
  duration: number;
}

export interface GeoTrack {
  id: string;
  route?: GeoRoute;
  totalDistance?: number;
  totalDuration?: number;
  pointCount: number;
}

export interface GeoTrackOptions {
  includeRoute: boolean;
  includeDistance: boolean;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

export interface CsvRow {
  randomized_id: string;
  lat: string;
  lng: string;
  alt: string;
  spd: string;
  azm: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface GeoTrackStats {
  totalTracks: number;
  totalPoints: number;
  averagePointsPerTrack: number;
}

export interface RouteRequest {
  startPoint: GeoPoint;
  endPoint: GeoPoint;
  profile?: 'driving' | 'walking' | 'cycling';
}

export interface RouteResponse {
  route: GeoPoint[];
  distance: number;
  duration: number;
  profile: string;
  instructions?: string[];
}

export interface OSRMRoute {
  geometry: {
    coordinates: number[][];
  };
  distance: number;
  duration: number;
  legs: Array<{
    steps: Array<{
      maneuver: {
        instruction: string;
      };
    }>;
  }>;
}

export interface SocketMessage {
  type: 'location_update' | 'route_request' | 'route_response' | 'error' | 'ping' | 'pong';
  data: any;
  timestamp: number;
  clientId?: string;
}

export interface LocationUpdate {
  lat: number;
  lng: number;
  alt?: number;
  spd?: number;
  azm?: number;
  accuracy?: number;
}

export interface RealtimeTracking {
  clientId: string;
  currentLocation: LocationUpdate;
  destination?: GeoPoint;
  route?: RouteResponse;
  isTracking: boolean;
  lastUpdate: number;
}

export interface TrackingConfig {
  updateInterval: number;
  routeRecalculationThreshold: number;
  maxRouteAge: number;
}
