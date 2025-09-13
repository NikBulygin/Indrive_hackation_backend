# InDrive Hackathon Project

## Setup

1. **Clone the repository**
2. **Copy environment file**: `cp .env.template .env`
3. **Place seed data**: Create `seed/` directory and place `geo_locations_astana_hackathon` file manually
4. **Install dependencies**: `bun install`
5. **Start with Docker**: `sudo docker compose up --build -d`

## API Endpoints

- `GET /` - API info
- `GET /swagger` - Swagger documentation
- `GET /geo-tracks/count` - Get count of unique geo tracks
- `GET /geo-tracks/stats` - Get track statistics
- `GET /geo-tracks` - Get all geo tracks (with optional parameters)
- `GET /geo-tracks/:id` - Get specific geo track by ID
- `POST /route` - Calculate route between two points using OpenStreetMap
- `POST /routes` - Calculate multiple routes in batch
- `WS /ws` - WebSocket connection for realtime tracking
- `GET /ws/clients` - Get active WebSocket clients
- `GET /ws/tracking` - Get all tracking data
- `GET /websocket-client.html` - WebSocket test client

### Query Parameters

- `includeRoute=true` - Include route points in response
- `includeDistance=true` - Include distance calculations in response

### Example Usage

```bash
# Get all tracks with route and distance
GET /geo-tracks?includeRoute=true&includeDistance=true

# Get specific track with route only
GET /geo-tracks/track123?includeRoute=true

# Calculate route between two points
POST /route
{
  "startPoint": { "lat": 51.09546, "lng": 71.42753 },
  "endPoint": { "lat": 51.0982, "lng": 71.41295 },
  "profile": "driving"
}

# Calculate multiple routes
POST /routes
[
  {
    "startPoint": { "lat": 51.09546, "lng": 71.42753 },
    "endPoint": { "lat": 51.0982, "lng": 71.41295 },
    "profile": "walking"
  }
]
```

## Scripts

- `bun run dev` - Start development server
- `bun run test` - Run tests
- `bun run test:watch` - Run tests in watch mode
- `bun run migrate` - Migrate CSV data to database
- `bun run db:generate` - Generate database migrations
- `bun run db:migrate` - Apply database migrations

## Database

- PostgreSQL with pgvector extension
- Port: 5433 (external), 5432 (internal)
- Database: indrive_hackaton
- User: postgres
- Password: password

## WebSocket Features

**Realtime Tracking:**
- Real-time location updates from clients
- Automatic route recalculation when off-course
- Support for multiple tracking clients
- Connection health monitoring (ping/pong)
- Configurable update intervals

**WebSocket Client:**
- Access test client at: `http://localhost:3000/websocket-client.html`
- Connect/disconnect functionality
- Start/stop tracking
- Request routes with different profiles
- Real-time log of all events

## Important

**Seed data file must be placed manually in `seed/` directory:**
- File name: `geo_locations_astana_hackathon`
- This file is gitignored and must be provided separately