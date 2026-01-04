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

## Authentication

This server uses a secure token-based authentication system.

1.  **Start the Server** (Locally or Deployed).
2.  **Open the Webview**:
    *   Local: `http://localhost:3000/webview`
    *   Deployed: `https://your-app.onrender.com/webview`
3.  **Login**: Sign in with your Mentra account.
4.  **Get Token**: Copy the **Access Token** displayed on the screen.

## Connecting to Clients

### 1. GitHub Copilot (VS Code)

Add the server to your MCP configuration file (usually `~/.config/github-copilot/mcp.json` or via the VS Code command "MCP: Manage MCP Servers").

```json
{
  "mcpServers": {
    "mentra-glasses": {
  "type": "sse",
  "url": "mcp url here",
  "headers": {
    "Authorization": "Bearer YOUR_ACCESS_TOKEN"
  }
  }
}
```
*Note: Replace the URL and Token with your actual values.*

### 2. Claude Desktop

Edit your configuration file:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "mentra-glass": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sse-client"],
      "env": {
        "MCP_SSE_URL": "http://localhost:3000/mcp",
        "MCP_SSE_HEADERS": "{\"Authorization\": \"Bearer YOUR_ACCESS_TOKEN\"}"
      }
    }
  }
}
```

### 3. Cursor

1.  Go to **Settings** > **Features** > **MCP**.
2.  Click **+ Add New MCP Server**.
3.  **Name**: `mentra-glass`
4.  **Type**: `SSE`
5.  **URL**: `https://your-app.onrender.com/mcp?token=YOUR_ACCESS_TOKEN`
    *(Note: Cursor may not support custom headers yet, so we support passing the token via query parameter as a fallback)*

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
- `/webview`: Auth & Settings

## Running with Docker

```bash
# Build & Run
docker compose up --build -d
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

