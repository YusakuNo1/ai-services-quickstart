# Zoom AI Services Quickstart

A Node.js/Express + React playground for the [Zoom AI Services APIs](https://developers.zoom.us/docs/ai-services/). Test **Scribe** (speech-to-text) and **Translation** through a web UI backed by a tRPC server that handles JWT authentication and all API communication.
! [screenshot](https://github.com/user-attachments/assets/6c99d0b4-f5bb-4cd0-8cca-f7a6bfleb50e)
## Products

| Product | Modes | Description |
|---|---|---|
| **Scribe** | Fast (Sync) | Upload or record audio/video, get a transcript immediately |
| **Scribe** | Batch | Process thousands of S3 files; auto-splits jobs >1,000 files |
| **Translation** | Fast (Sync) | Translate up to 4,000 characters across up to 12 target languages |
| **Translation** | Batch | Translate `.txt` files stored in S3 |

## Architecture

```
playground/          Vite + React + tRPC client (port 5173)
    └── /trpc  ──▶  Express + tRPC server (port 4000)
                        ├── Zoom AI Services API
                        └── AWS S3 (for batch jobs)
```

The playground proxies `/trpc` to the Express server. All Zoom API calls happen server-side; the browser never touches Zoom credentials.

## Prerequisites

- [Zoom Build Platform](https://developers.zoom.us/docs/ai-services/build-platform/) credentials
- Node.js 24+
- For batch jobs: an AWS account with an S3 bucket and IAM credentials

## Setup

```bash
git clone https://github.com/zoom/scribe-quickstart.git
cd scribe-quickstart
npm install
cp .env.example .env
```

Edit `.env`:

| Variable | Required | Description |
|---|---|---|
| `ZOOM_API_KEY` | **Yes** | Zoom Build Platform API key |
| `ZOOM_API_SECRET` | **Yes** | Zoom Build Platform API secret |
| `PORT` | No | Server port (default: `4000`) |

For **batch jobs** (Scribe or Translation), also set:

| Variable | Description |
|---|---|
| `AWS_ACCESS_KEY_ID` | IAM access key |
| `AWS_SECRET_ACCESS_KEY` | IAM secret key |
| `AWS_SESSION_TOKEN` | Session token (if using temporary credentials) |
| `AWS_REGION` | Region of your S3 bucket (default: `us-east-1`) |
| `WEBHOOK_URL` | Public HTTPS URL for job status notifications |
| `WEBHOOK_SECRET` | HMAC secret to verify webhook payloads |

Use `scripts/generate-sts-creds.sh` to generate temporary STS credentials:
```bash
./scripts/generate-sts-creds.sh <AWS_ACCESS_KEY_ID> <AWS_SECRET_ACCESS_KEY>
```

## Running

```bash
# Terminal 1 — API server
npm start

# Terminal 2 — Playground UI
cd playground && npm install && npm run dev
```

Open `http://localhost:5173`.

## Webhooks

`POST /webhooks/scribe` receives Zoom batch job notifications. Requires a publicly reachable HTTPS URL — use [cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/do-more-with-tunnels/trycloudflare/) for local development:

```bash
cloudflared tunnel --url http://localhost:4000
```

Set the printed URL as `WEBHOOK_URL` in `.env`.

## Adding a product

The playground uses a product registry (`playground/src/products.ts`). To add a new product:

1. Create `playground/src/products/<name>/tabs/MyTab.tsx`
2. Add a tRPC router in `src/routers/<name>.ts` and register it in `src/routers/index.ts`
3. Import and push one entry to `PRODUCTS` in `products.ts`

## Resources

- [Zoom AI Scribe documentation](https://developers.zoom.us/docs/ai-services/scribe)
- [API Reference](https://developers.zoom.us/docs/api/ai-services/)
- [Developer Support](https://devsupport.zoom.us) · [Developer Forum](https://devforum.zoom.us)
