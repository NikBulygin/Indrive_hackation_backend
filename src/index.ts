import { Elysia } from "elysia";
import { createConnection } from './db/connection';
import { GeoLocationService } from './services/geo-location.service';
import { createGeoLocationApi } from './api/geo-location.api';

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'indrive_hackaton',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
};

const db = createConnection(config);
const geoLocationService = new GeoLocationService(db);

const app = new Elysia()
  .use(createGeoLocationApi(geoLocationService))
  .get("/", () => "Geo Location API")
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
