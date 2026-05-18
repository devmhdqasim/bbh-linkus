# BBH Softphone

Browser-based softphone for the BBH CRM, powered by the Yeastar Linkus SDK for Web Core.

## Prerequisites

- **Yeastar P-Series PBX** (Cloud or on-premise) with Linkus SDK enabled
- An extension configured on the PBX (e.g., extension 1000)
- **Linkus SDK login signature** — obtain from PBX admin panel:
  - Go to **Integrations → Linkus SDK**
  - Generate a login signature for the target extension
- Node.js 18+

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

| Variable | Description |
|----------|-------------|
| `VITE_PBX_URL` | Full URL of your Yeastar PBX (e.g., `https://mycompany.yeastarcloud.com`) |
| `VITE_PBX_USERNAME` | Extension number (e.g., `1000`) |
| `VITE_PBX_SECRET` | The **Linkus SDK login signature** from PBX admin |

3. Start the dev server:

```bash
npm run dev
```

## Testing Calls

### Outbound Calls

1. Wait for the status pill in the header to show **Registered** (green dot).
2. Enter a number on the dialpad and press **Call**.
3. The active call panel will appear with mute, hold, keypad, and hangup controls.

### Inbound Calls

1. From another phone, call the extension configured in `.env.local`.
2. An incoming call modal will appear with Accept / Decline buttons.
3. Accept to start the call — the active call panel will activate.

### DTMF (In-Call Keypad)

While on a call, press the grid icon to reveal the in-call keypad. Taps send DTMF tones to the remote party (useful for IVR navigation).

## Production Notes

- **Never bundle the SDK login signature in production client code.** In a real deployment, fetch the signature from your backend (which calls the PBX API) and pass it to the SDK at runtime.
- The signature has a limited validity period; your backend should handle refresh/rotation.
- Microphone permissions are required — the app will show a warning banner if denied.

## Tech Stack

- React 18 + Vite
- Tailwind CSS v3
- `ys-webrtc-sdk-core` (Yeastar Linkus SDK)
- `lucide-react` (icons)
- `react-hot-toast` (notifications)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
