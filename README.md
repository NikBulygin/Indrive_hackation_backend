# InDrive Hackathon Project

## Setup

1. **Clone the repository**
2. **Copy environment file**: `cp .env.template .env`
3. **Place seed data**: Create `seed/` directory and place `geo_locations_astana_hackathon` file manually
4. **Install dependencies**: `bun install`
5. **Start with Docker**: `sudo docker compose up --build -d`

## API Endpoints

- `GET /` - API info
- `GET /geo-locations` - Get all geo locations
- `GET /geo-locations/count` - Get count of records

## Scripts

- `bun run dev` - Start development server
- `bun run migrate` - Migrate CSV data to database
- `bun run db:generate` - Generate database migrations
- `bun run db:migrate` - Apply database migrations

## Database

- PostgreSQL with pgvector extension
- Port: 5433 (external), 5432 (internal)
- Database: indrive_hackaton
- User: postgres
- Password: password

## Important

**Seed data file must be placed manually in `seed/` directory:**
- File name: `geo_locations_astana_hackathon`
- This file is gitignored and must be provided separately