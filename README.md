# Geo Track API - InDrive Hackathon Project

A comprehensive API for geo track management, real-time tracking, route calculation, and heatmap generation with multi-modal transportation support.

## 🚀 Features

- **📍 Geo Track Management**: Store, analyze, and retrieve geo tracking data with statistics
- **⚡ Real-time Tracking**: WebSocket-based live location updates with automatic route recalculation
- **🗺️ Route Calculation**: Multi-modal routing with OpenStreetMap integration (walking, cycling, driving, public transport)
- **🔥 Heatmap Generation**: Advanced clustering and visualization of geo data with intensity calculations
- **🚌 Transportation Types**: Support for multiple transportation modes with detailed metadata
- **📊 Analytics**: Comprehensive statistics and data analysis capabilities
- **🔌 WebSocket API**: Real-time communication for live tracking applications
- **📚 Swagger Documentation**: Interactive API documentation with examples

## 🛠️ Setup Instructions

### Prerequisites
- Docker and Docker Compose
- Bun runtime (optional, for local development)
- PostgreSQL with pgvector extension (handled by Docker)

### Step 1: Clone and Configure
```bash
# Clone the repository
git clone <repository-url>
cd indrive_hackaton

# Copy environment configuration
cp .env.template .env

# Edit .env file with your settings (optional)
nano .env
```

### Step 2: Prepare Seed Data
```bash
# Create seed directory
mkdir -p seed/

# Place your CSV file in the seed directory
# File should be named: geo_locations_astana_hackathon
# Format: CSV with columns: id, randomizedId, lat, lng, alt, spd, azm
```

### Step 3: Start the Application
```bash
# Start with Docker (recommended)
sudo docker compose up --build -d

# Or start locally with Bun
bun install
bun run dev
```

### Step 4: Verify Installation
```bash
# Check if API is running
curl http://localhost:3000/

# View Swagger documentation
open http://localhost:3000/swagger
```

## 📋 Environment Configuration

The `.env` file contains the following configuration options:

```env
# Application
APP_PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5433
DB_NAME=geo_tracks
DB_USER=postgres
DB_PASSWORD=password

# External Services
OSRM_BASE_URL=https://router.project-osrm.org/route/v1
```

## 🗄️ Database Setup

### Automatic Migration
```bash
# Run database migration (if not using Docker)
bun run migrate

# Generate new migrations
bun run db:generate

# Apply migrations
bun run db:migrate
```

### Manual Database Access
```bash
# Connect to PostgreSQL
docker exec -it indrive_hackaton-db-1 psql -U postgres -d geo_tracks

# View tables
\dt

# Check geo_locations table
SELECT COUNT(*) FROM geo_locations;
```

## 📡 API Reference

### Base URL
```
http://localhost:3000
```

### Authentication
Currently no authentication required. All endpoints are publicly accessible.

### Response Format
All API responses follow this structure:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

## 🗺️ Geo Tracks API

### Get Track Count
```http
GET /geo-tracks/count
```

**Response:**
```json
{
  "success": true,
  "data": {
    "count": 150
  }
}
```

### Get Track Statistics
```http
GET /geo-tracks/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalTracks": 150,
    "totalLocations": 12500,
    "averageLocationsPerTrack": 83.33,
    "dateRange": {
      "earliest": "2024-01-01T00:00:00Z",
      "latest": "2024-01-31T23:59:59Z"
    }
  }
}
```

### Get All Tracks
```http
GET /geo-tracks?includeRoute=true&includeDistance=true
```

**Query Parameters:**
- `includeRoute` (boolean): Include route points in response
- `includeDistance` (boolean): Include distance calculations
- `limit` (number): Limit number of results
- `offset` (number): Offset for pagination

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "track_001",
      "locations": [...],
      "route": [...],
      "distance": 1500.5,
      "duration": 300,
      "stats": {
        "pointCount": 25,
        "averageSpeed": 5.0
      }
    }
  ]
}
```

### Get Specific Track
```http
GET /geo-tracks/track_001?includeRoute=true&includeDistance=true
```

## 🚗 Route Calculation API

### Get Available Transportation Types
```http
GET /route-types
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "walking",
      "name": "Walking",
      "description": "Pedestrian route",
      "icon": "🚶",
      "color": "#4CAF50",
      "osrmProfile": "foot",
      "speed": 5,
      "emissions": 0
    },
    {
      "id": "cycling",
      "name": "Cycling", 
      "description": "Bicycle route",
      "icon": "🚴",
      "color": "#2196F3",
      "osrmProfile": "cycling",
      "speed": 15,
      "emissions": 0
    },
    {
      "id": "bus",
      "name": "Public Transport",
      "description": "Public transportation route",
      "icon": "🚌",
      "color": "#FF9800",
      "osrmProfile": "driving",
      "speed": 25,
      "emissions": 0.1
    },
    {
      "id": "driving",
      "name": "Driving",
      "description": "Car route",
      "icon": "🚗",
      "color": "#F44336",
      "osrmProfile": "driving",
      "speed": 50,
      "emissions": 0.2
    }
  ]
}
```

### Calculate Single Route
```http
POST /route
Content-Type: application/json

{
  "startPoint": {
    "lat": 51.09546,
    "lng": 71.42753
  },
  "endPoint": {
    "lat": 51.0982,
    "lng": 71.41295
  },
  "profile": "driving"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "route": [
      { "lat": 51.09546, "lng": 71.42753 },
      { "lat": 51.09550, "lng": 71.42760 },
      { "lat": 51.0982, "lng": 71.41295 }
    ],
    "distance": 1500.5,
    "duration": 300,
    "profile": "driving",
    "instructions": [
      "Head north on Main Street",
      "Turn right onto Second Avenue",
      "Arrive at destination"
    ]
  }
}
```

### Calculate Multiple Routes
```http
POST /routes
Content-Type: application/json

[
  {
    "startPoint": { "lat": 51.09546, "lng": 71.42753 },
    "endPoint": { "lat": 51.0982, "lng": 71.41295 },
    "profile": "driving"
  },
  {
    "startPoint": { "lat": 51.09546, "lng": 71.42753 },
    "endPoint": { "lat": 51.0982, "lng": 71.41295 },
    "profile": "walking"
  }
]
```

## ⚡ Real-time Tracking (WebSocket)

### WebSocket Connection
```javascript
const ws = new WebSocket('ws://localhost:3000/ws');

ws.onopen = () => {
  console.log('Connected to tracking service');
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};
```

### Message Types

#### Start Tracking
```json
{
  "type": "start_tracking",
  "data": {
    "location": {
      "lat": 51.09546,
      "lng": 71.42753,
      "accuracy": 10
    }
  },
  "timestamp": 1640995200000
}
```

#### Location Update
```json
{
  "type": "location_update",
  "data": {
    "lat": 51.09550,
    "lng": 71.42760,
    "accuracy": 8
  },
  "timestamp": 1640995205000
}
```

#### Route Request
```json
{
  "type": "route_request",
  "data": {
    "destination": {
      "lat": 51.0982,
      "lng": 71.41295
    },
    "profile": "driving"
  },
  "timestamp": 1640995200000
}
```

#### Stop Tracking
```json
{
  "type": "stop_tracking",
  "data": {},
  "timestamp": 1640995200000
}
```

### WebSocket Management API

#### Get Active Clients
```http
GET /ws/clients
```

#### Get All Tracking Data
```http
GET /ws/tracking
```

#### WebSocket Test Client
```http
GET /websocket-client.html
```

## 🔥 Heatmap Generation API

### Generate Heatmap
```http
POST /heatmap
Content-Type: application/json

{
  "trackIds": ["track_001", "track_002"],
  "bounds": {
    "north": 51.1,
    "south": 51.09,
    "east": 71.43,
    "west": 71.42
  },
  "config": {
    "gridSize": 0.001,
    "radius": 100,
    "intensityThreshold": 0.1,
    "maxPoints": 100
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "lat": 51.09546,
      "lng": 71.42753,
      "radius": 100,
      "intensity": 0.85,
      "count": 15
    },
    {
      "lat": 51.09550,
      "lng": 71.42760,
      "radius": 100,
      "intensity": 0.72,
      "count": 12
    }
  ]
}
```

### Get Heatmap for Specific Track
```http
GET /heatmap/track/track_001
```

### Get Heatmap Statistics
```http
POST /heatmap/stats
Content-Type: application/json

{
  "config": {
    "gridSize": 0.001,
    "radius": 100,
    "intensityThreshold": 0.1,
    "maxPoints": 100
  }
}
```

### Get Clustered Points
```http
POST /heatmap/clusters
Content-Type: application/json

{
  "config": {
    "gridSize": 0.001,
    "radius": 100,
    "intensityThreshold": 0.1,
    "maxPoints": 100
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "center": {
        "lat": 51.09546,
        "lng": 71.42753
      },
      "points": [
        { "lat": 51.09546, "lng": 71.42753 },
        { "lat": 51.09547, "lng": 71.42754 }
      ],
      "radius": 50,
      "intensity": 0.85,
      "count": 15
    }
  ]
}
```

## 🛠️ Development

### Available Scripts

```bash
# Development
bun run dev              # Start development server with hot reload
bun run build            # Build for production

# Database
bun run migrate          # Run database migration from CSV
bun run db:generate      # Generate new Drizzle migrations
bun run db:migrate       # Apply database migrations

# Testing
bun test                 # Run all tests
bun test:watch           # Run tests in watch mode
bun test --coverage      # Run tests with coverage report

# Docker
docker compose up -d     # Start services in background
docker compose down      # Stop all services
docker compose logs -f   # View logs
```

### Project Structure

```
indrive_hackaton/
├── src/
│   ├── api/                 # API route handlers
│   │   ├── geo-track.api.ts
│   │   ├── route.api.ts
│   │   ├── websocket.api.ts
│   │   └── heatmap.api.ts
│   ├── services/            # Business logic
│   │   ├── geo-track.service.ts
│   │   ├── route.service.ts
│   │   ├── realtime-tracking.service.ts
│   │   └── heatmap.service.ts
│   ├── utils/               # Utility functions
│   │   ├── csv-parser.ts
│   │   ├── geo-calculations.ts
│   │   └── heatmap-calculations.ts
│   ├── db/                  # Database configuration
│   │   ├── connection.ts
│   │   └── schema.ts
│   ├── types/               # TypeScript definitions
│   │   └── index.ts
│   ├── constants/           # Application constants
│   │   └── index.ts
│   ├── tests/               # Test files
│   └── index.ts             # Main application entry
├── public/                  # Static files
├── seed/                    # CSV data files
├── docker-compose.yml       # Docker configuration
├── Dockerfile              # Application container
└── README.md               # This file
```

### Database Schema

#### geo_locations Table
```sql
CREATE TABLE geo_locations (
  id SERIAL PRIMARY KEY,
  randomized_id VARCHAR(255) NOT NULL,
  lat DECIMAL(10, 8) NOT NULL,
  lng DECIMAL(11, 8) NOT NULL,
  alt DECIMAL(8, 2),
  spd DECIMAL(8, 2),
  azm DECIMAL(8, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_randomized_id ON geo_locations(randomized_id);
CREATE INDEX idx_coordinates ON geo_locations(lat, lng);
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `APP_PORT` | Application port | `3000` |
| `NODE_ENV` | Environment mode | `development` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5433` |
| `DB_NAME` | Database name | `geo_tracks` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `password` |

### Heatmap Configuration

| Parameter | Description | Default | Range |
|-----------|-------------|---------|-------|
| `gridSize` | Grid cell size in degrees | `0.001` | `0.0001 - 0.01` |
| `radius` | Point radius in meters | `100` | `10 - 1000` |
| `intensityThreshold` | Minimum intensity to include | `0.1` | `0.0 - 1.0` |
| `maxPoints` | Maximum points to return | `100` | `10 - 10000` |

### WebSocket Configuration

| Parameter | Description | Default |
|-----------|-------------|---------|
| `PING_INTERVAL` | Ping interval in ms | `30000` |
| `PONG_TIMEOUT` | Pong timeout in ms | `5000` |
| `LOCATION_UPDATE_INTERVAL` | Update interval in ms | `5000` |
| `ROUTE_RECALCULATION_THRESHOLD` | Distance threshold in meters | `50` |
| `MAX_ROUTE_AGE` | Max route age in ms | `300000` |

## 🚀 Usage Examples

### Basic Track Retrieval
```bash
# Get track count
curl http://localhost:3000/geo-tracks/count

# Get all tracks with routes
curl "http://localhost:3000/geo-tracks?includeRoute=true&includeDistance=true"

# Get specific track
curl http://localhost:3000/geo-tracks/track_001
```

### Route Calculation
```bash
# Get available transportation types
curl http://localhost:3000/route-types

# Calculate driving route
curl -X POST http://localhost:3000/route \
  -H "Content-Type: application/json" \
  -d '{
    "startPoint": {"lat": 51.09546, "lng": 71.42753},
    "endPoint": {"lat": 51.0982, "lng": 71.41295},
    "profile": "driving"
  }'

# Calculate walking route
curl -X POST http://localhost:3000/route \
  -H "Content-Type: application/json" \
  -d '{
    "startPoint": {"lat": 51.09546, "lng": 71.42753},
    "endPoint": {"lat": 51.0982, "lng": 71.41295},
    "profile": "walking"
  }'
```

### Heatmap Generation
```bash
# Generate heatmap for all data
curl -X POST http://localhost:3000/heatmap \
  -H "Content-Type: application/json" \
  -d '{
    "config": {
      "gridSize": 0.001,
      "radius": 100,
      "intensityThreshold": 0.1,
      "maxPoints": 100
    }
  }'

# Generate heatmap for specific track
curl http://localhost:3000/heatmap/track/track_001
```

### WebSocket Testing
```bash
# Open WebSocket test client in browser
open http://localhost:3000/websocket-client.html

# Or use wscat for command line testing
npm install -g wscat
wscat -c ws://localhost:3000/ws
```

## 🧪 Testing

### Run All Tests
```bash
bun test
```

### Run Specific Test Suites
```bash
# Test geo calculations
bun test src/tests/geo-calculations.test.ts

# Test route services
bun test src/tests/route.service.test.ts

# Test WebSocket functionality
bun test src/tests/websocket.test.ts

# Test heatmap generation
bun test src/tests/heatmap.test.ts
```

### Test Coverage
```bash
bun test --coverage
```

## 📊 Performance Considerations

### Database Optimization
- Indexes on `randomized_id` and coordinates
- Pagination for large result sets
- Connection pooling for high concurrency

### API Rate Limiting
- No built-in rate limiting (consider adding for production)
- WebSocket connections limited by server resources
- OSRM API calls should be cached for repeated routes

### Memory Usage
- Heatmap generation can be memory-intensive for large datasets
- Consider streaming for very large CSV files
- WebSocket connections consume memory per client

## 🔒 Security Considerations

### Production Deployment
- Add authentication/authorization
- Use HTTPS/WSS for secure connections
- Validate all input parameters
- Implement rate limiting
- Use environment-specific database credentials
- Enable CORS for specific domains only

### Data Privacy
- No personal data is stored (only coordinates and technical data)
- Consider data anonymization for production use
- Implement data retention policies

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Failed
```bash
# Check if database is running
docker compose ps

# View database logs
docker compose logs db

# Restart database
docker compose restart db
```

#### WebSocket Connection Issues
```bash
# Check if WebSocket endpoint is accessible
curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" -H "Sec-WebSocket-Key: test" -H "Sec-WebSocket-Version: 13" http://localhost:3000/ws
```

#### Route Calculation Errors
```bash
# Check OSRM service availability
curl "https://router.project-osrm.org/route/v1/driving/71.42753,51.09546;71.41295,51.0982?overview=false"
```

#### Memory Issues
```bash
# Monitor memory usage
docker stats

# Increase Docker memory limits in docker-compose.yml
```

### Logs and Debugging
```bash
# View application logs
docker compose logs -f app

# View all service logs
docker compose logs -f

# Access application container
docker exec -it indrive_hackaton-app-1 sh
```

## 📈 Monitoring and Analytics

### Health Checks
```bash
# API health
curl http://localhost:3000/

# Database health
curl http://localhost:3000/geo-tracks/count

# WebSocket clients
curl http://localhost:3000/ws/clients
```

### Metrics to Monitor
- API response times
- Database query performance
- WebSocket connection count
- Memory usage
- CPU utilization
- Error rates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

### Code Style
- Use TypeScript strict mode
- Follow existing naming conventions
- Add JSDoc comments for public APIs
- Write tests for all new features
- Keep functions small and focused

## 📄 License

This project is part of the InDrive Hackathon and is provided as-is for educational and demonstration purposes.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the API documentation at `/swagger`
3. Check the test files for usage examples
4. Create an issue in the repository