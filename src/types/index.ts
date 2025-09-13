export interface GeoLocation {
  id: string;
  lat: number;
  lng: number;
  alt: number;
  spd: number;
  azm: number;
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
