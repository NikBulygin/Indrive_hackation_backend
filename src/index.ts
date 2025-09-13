import { Elysia } from "elysia";
import { swagger } from '@elysiajs/swagger';
import { createConnection } from './db/connection';
import { GeoTrackService } from './services/geo-track.service';
import { RouteService } from './services/route.service';
import { createGeoTrackApi } from './api/geo-track.api';
import { createRouteApi } from './api/route.api';
import { createWebSocketApi } from './api/websocket.api';

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'indrive_hackaton',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
};

const db = createConnection(config);
const geoTrackService = new GeoTrackService(db);
const routeService = new RouteService();

const app = new Elysia()
  .use(swagger({
    documentation: {
      info: {
        title: 'Geo Track API',
        version: '1.0.0',
        description: 'API for managing and analyzing geo tracks data with OpenStreetMap routing',
      },
      tags: [
        { name: 'GeoTracks', description: 'Geo tracks operations' },
        { name: 'Routes', description: 'Route calculation using OpenStreetMap' },
      ],
    },
  }))
  .use(createGeoTrackApi(geoTrackService))
  .use(createRouteApi(routeService))
  .use(createWebSocketApi(routeService))
  .get("/", () => ({
    message: "Geo Track API with OpenStreetMap Routing & Realtime Tracking",
    documentation: "/swagger",
    websocketClient: "/websocket-client.html",
    endpoints: {
      tracks: "/geo-tracks",
      tracksCount: "/geo-tracks/count",
      tracksStats: "/geo-tracks/stats",
      trackById: "/geo-tracks/:id",
      route: "POST /route - calculate route between two points",
      routes: "POST /routes - calculate multiple routes",
      websocket: "WS /ws - realtime tracking and route updates",
      wsClients: "GET /ws/clients - get active WebSocket clients",
      wsTracking: "GET /ws/tracking - get all tracking data",
    },
    queryParams: {
      includeRoute: "boolean - include route points",
      includeDistance: "boolean - include distance calculation",
    },
    routeProfiles: {
      driving: "car route",
      walking: "pedestrian route", 
      cycling: "bicycle route",
    },
    websocketFeatures: {
      realtimeTracking: "Real-time location updates",
      routeRecalculation: "Automatic route updates when off-course",
      multipleClients: "Support for multiple tracking clients",
      pingPong: "Connection health monitoring",
    },
  }))
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
console.log(`📚 Swagger documentation: http://${app.server?.hostname}:${app.server?.port}/swagger`);
