export const EARTH_RADIUS_KM = 6371;

import { GeoTrackOptions } from '../types';

export const DEFAULT_GEO_OPTIONS: GeoTrackOptions = {
  includeRoute: false,
  includeDistance: false,
};

export const API_ENDPOINTS = {
  GEO_TRACKS: '/geo-tracks',
  GEO_TRACKS_COUNT: '/geo-tracks/count',
  GEO_TRACKS_STATS: '/geo-tracks/stats',
  GEO_TRACK_BY_ID: '/geo-tracks/:id',
  ROUTE: '/route',
  ROUTES: '/routes',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
  TRACK_NOT_FOUND: 'GeoTrack not found',
  INVALID_PARAMETERS: 'Invalid parameters provided',
  INTERNAL_ERROR: 'Internal server error',
  ROUTE_NOT_FOUND: 'Route not found',
  INVALID_COORDINATES: 'Invalid coordinates provided',
} as const;

export const OSRM_CONFIG = {
  BASE_URL: 'https://router.project-osrm.org/route/v1',
  PROFILES: {
    driving: 'driving',
    walking: 'foot',
    cycling: 'cycling',
  },
} as const;

export const SOCKET_CONFIG = {
  PING_INTERVAL: 30000,
  PONG_TIMEOUT: 5000,
  LOCATION_UPDATE_INTERVAL: 5000,
  ROUTE_RECALCULATION_THRESHOLD: 100,
  MAX_ROUTE_AGE: 300000,
} as const;

export const SOCKET_EVENTS = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  LOCATION_UPDATE: 'location_update',
  ROUTE_REQUEST: 'route_request',
  ROUTE_RESPONSE: 'route_response',
  START_TRACKING: 'start_tracking',
  STOP_TRACKING: 'stop_tracking',
  PING: 'ping',
  PONG: 'pong',
  ERROR: 'error',
} as const;
