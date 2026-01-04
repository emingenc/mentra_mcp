# Mentra Glass MCP Server

A Model Context Protocol (MCP) server for controlling MentraOS smart glasses.
Built with **Bun**, **Mentra SDK**, and **MCP SDK**.

## Features

- **MCP Support**: Exposes tools to control glasses (Display, Audio, Input) via JSON-RPC.
- **Multi-User**: Supports multiple users via Bearer token authentication (email).
- **Mentra Integration**: Connects to Mentra Cloud as an AppServer.
- **Docker Ready**: Includes Dockerfile and Compose setup.

## Architecture

```
MCP Client (Claude/Cursor) 
       ⬇️ JSON-RPC (HTTP)
   [MCP Server]
       ⬇️ Mentra SDK
   Mentra Cloud
       ⬇️
   Smart Glasses
```

## Prerequisites

- [Bun](https://bun.sh) (v1.0+)
- Mentra Developer Account & API Key

## Setup

1. **Clone & Install**
   ```bash
   git clone <repo>
   cd mcp-for-next.js
   bun install
   ```

2. **Environment Variables**
   Create a `.env` file (or set env vars):
   ```bash
   PACKAGE_NAME="com.yourname.glass-mcp"
   MENTRAOS_API_KEY="your-mentra-api-key"
   PORT=3000
   MENTRA_INTERNAL_PORT=3099
   # Optional: Map tokens to emails
   MCP_USER_TOKENS='{"my-secret-token": "user@example.com"}'
   # Optional: Admin token
   MCP_ADMIN_TOKEN="admin-secret"
   ```

## Running Locally

```bash
# Start the server
bun run src/index.ts

# Watch mode
bun run dev
```

The server will start on `http://localhost:3000`.
- `/mcp`: MCP JSON-RPC endpoint
- `/health`: Health check

## Running with Docker

```bash
# Build
bun run docker:build

# Run
bun run docker:up
```

## Usage with Claude Desktop / Cursor

Configure your MCP client to point to this server.

**HTTP Config:**
- URL: `http://localhost:3000/mcp`
- Headers: `Authorization: Bearer user@example.com`

**Stdio Config (via wrapper):**
```json
{
  "mcpServers": {
    "mentra-glass": {
      "command": "node",
      "args": ["path/to/scripts/mcp-stdio-wrapper.mjs"],
      "env": {
        "MCP_URL": "http://localhost:3000/mcp",
        "MCP_TOKEN": "user@example.com"
      }
    }
  }
}
```

## Available Tools

- **Display**: `glasses_display_text`, `glasses_clear_display`
- **Audio**: `glasses_speak`
- **Input**: `glasses_get_transcriptions`, `glasses_get_events`
- **System**: `glasses_status`

## Project Structure

- `src/config`: Environment configuration
- `src/services`: Core logic (Mentra SDK, Session Management)
- `src/tools`: MCP Tool definitions
- `src/index.ts`: Entry point

## Deployment

### Option 1: Render + Supabase (Recommended for Free Tier)
Best for indie devs. Uses Supabase for the database (since Render's free tier wipes local files) and Render for hosting.

1.  **Database**: Follow `SUPABASE_SETUP.md` to create your Supabase project and get credentials.
2.  **Hosting**:
    *   Sign up at [render.com](https://render.com).
    *   Create a new **Web Service**.
    *   Connect your GitHub repository.
    *   **Runtime**: Docker.
    *   **Environment Variables**:
        *   `SUPABASE_URL`: Your Supabase URL.
        *   `SUPABASE_SERVICE_KEY`: Your Supabase Service Role Key.
        *   `MENTRAOS_API_KEY`: Your Mentra API Key.
        *   `PACKAGE_NAME`: `com.yourname.glassmcp`.
        *   `PORT`: `3000`.

### Option 2: Fly.io (Best for SQLite)
Allows you to keep using the local SQLite database by attaching a persistent volume.

1.  Install `flyctl`.
2.  Run `fly launch`.
3.  Create a volume: `fly volumes create mcp_data`.
4.  Update `fly.toml` to mount the volume to `/app/mcp.sqlite`.

### Option 3: Self-Hosted (VPS)
Run standard Docker Compose on any server (DigitalOcean, Hetzner, Oracle Cloud).

```bash
docker compose up -d
```

