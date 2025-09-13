import { describe, it, expect, beforeEach, afterEach, mock } from 'bun:test';
import { WebSocket } from 'ws';
import { RealtimeTrackingService } from '../services/realtime-tracking.service';
import { RouteService } from '../services/route.service';
import { LocationUpdate, GeoPoint } from '../types';

const mockRouteService = {
  getRoute: mock(() => Promise.resolve({
    route: [
      { lat: 51.09546, lng: 71.42753 },
      { lat: 51.0982, lng: 71.41295 },
    ],
    distance: 1500,
    duration: 300,
    profile: 'driving',
    instructions: ['Head north'],
  })),
};

describe('RealtimeTrackingService', () => {
  let service: RealtimeTrackingService;
  let mockSocket: any;

  beforeEach(() => {
    service = new RealtimeTrackingService(mockRouteService as any);
    mockSocket = {
      send: mock(),
      readyState: 1,
      on: mock(),
    };
  });

  afterEach(() => {
    mockRouteService.getRoute.mockClear();
    mockSocket.send.mockClear();
    mockSocket.on.mockClear();
  });

  describe('Client Management', () => {
    it('should add client successfully', () => {
      const clientId = 'test-client';
      service.addClient(clientId, mockSocket as any);
      
      expect(service.getActiveClients()).toContain(clientId);
    });

    it('should remove client successfully', () => {
      const clientId = 'test-client';
      service.addClient(clientId, mockSocket as any);
      service.removeClient(clientId);
      
      expect(service.getActiveClients()).not.toContain(clientId);
    });
  });

  describe('Location Updates', () => {
    it('should handle location update', () => {
      const clientId = 'test-client';
      const location: LocationUpdate = {
        lat: 51.09546,
        lng: 71.42753,
        accuracy: 10,
      };

      service.addClient(clientId, mockSocket as any);
      service['handleLocationUpdate'](clientId, location);

      const trackingData = service.getTrackingData(clientId);
      expect(trackingData?.currentLocation).toEqual(location);
    });

    it('should start tracking with initial location', () => {
      const clientId = 'test-client';
      const location: LocationUpdate = {
        lat: 51.09546,
        lng: 71.42753,
      };

      service.addClient(clientId, mockSocket as any);
      service['startTracking'](clientId, { location });

      const trackingData = service.getTrackingData(clientId);
      expect(trackingData?.isTracking).toBe(true);
      expect(trackingData?.currentLocation).toEqual(location);
    });

    it('should stop tracking', () => {
      const clientId = 'test-client';
      const location: LocationUpdate = {
        lat: 51.09546,
        lng: 71.42753,
      };

      service.addClient(clientId, mockSocket as any);
      service['startTracking'](clientId, { location });
      service['stopTracking'](clientId);

      const trackingData = service.getTrackingData(clientId);
      expect(trackingData?.isTracking).toBe(false);
    });
  });

  describe('Route Management', () => {
    it('should handle route request', async () => {
      const clientId = 'test-client';
      const location: LocationUpdate = {
        lat: 51.09546,
        lng: 71.42753,
      };
      const destination: GeoPoint = {
        lat: 51.0982,
        lng: 71.41295,
      };

      service.addClient(clientId, mockSocket as any);
      service['startTracking'](clientId, { location });

      await service['handleRouteRequest'](clientId, {
        destination,
        profile: 'driving',
      });

      expect(mockRouteService.getRoute).toHaveBeenCalledWith({
        startPoint: location,
        endPoint: destination,
        profile: 'driving',
      });
    });

    it('should calculate distance from route', () => {
      const location: LocationUpdate = {
        lat: 51.09546,
        lng: 71.42753,
      };
      const route = {
        route: [
          { lat: 51.09546, lng: 71.42753 },
          { lat: 51.0982, lng: 71.41295 },
        ],
        distance: 1500,
        duration: 300,
        profile: 'driving',
      };

      const distance = service['calculateDistanceFromRoute'](location, route);
      expect(distance).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Message Handling', () => {
    it('should handle valid message', () => {
      const clientId = 'test-client';
      const message = {
        type: 'location_update',
        data: { lat: 51.09546, lng: 71.42753 },
        timestamp: Date.now(),
      };

      service.addClient(clientId, mockSocket as any);
      service['handleMessage'](clientId, message);

      expect(mockSocket.send).toHaveBeenCalled();
    });

    it('should handle invalid message type', () => {
      const clientId = 'test-client';
      const message = {
        type: 'invalid_type',
        data: {},
        timestamp: Date.now(),
      };

      service.addClient(clientId, mockSocket as any);
      service['handleMessage'](clientId, message);

      expect(mockSocket.send).toHaveBeenCalled();
    });
  });
});
