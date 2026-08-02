# ShareFy

![Homepage](my-app/public/FrontPage.png)

ShareFy is a real-time peer-to-peer file sharing web app. Create a room, share the 5-digit code with anyone in the world, and transfer files instantly through the browser — no sign-up required.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Motion (Framer Motion) |
| Real-time | Socket.io |
| Components | shadcn/ui + Radix UI |
| Icons | Lucide React |

---

## Project Structure

```
ShareFy/
├── my-app/                     # Next.js frontend
│   ├── app/
│   │   ├── api/route.ts        # Room creation API
│   │   ├── Send/page.tsx       # Send file page
│   │   ├── Receive/page.tsx    # Receive file page
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/
│   │   └── ui/                 # Reusable UI components
│   ├── lib/
│   │   └── use-socket.ts       # Socket.io client hook
│   ├── public/                 # Static assets
│   └── .env.local              # Environment variables
│
└── socket-server/              # Standalone socket server (for deployment)
    ├── index.js
    └── package.json
```

---

## How to Use

1. Open the app and click **Send Files**
2. Click **Create Room** — a 5-digit room code is generated
3. Share the code with the recipient
4. Recipient opens the app, goes to **Receive Files**, and enters the code
5. Upload a file — transfer starts instantly

---

## Getting Started (Local Development)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/ShareFy.git
cd ShareFy
```

### 2. Install dependencies

```bash
# Next.js app
cd my-app
npm install

# Socket server
cd ../socket-server
npm install
```

### 3. Set environment variable

In `my-app/.env.local`:

```env
NEXT_PUBLIC_SOCKET_URL
```

### 4. Run the app

Open two terminals:

```bash
# Terminal 1 — Socket server
cd socket-server
node index.js

# Terminal 2 — Next.js app
cd my-app
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)

---

## NPM Commands

### my-app

| Command | Description |
|---|---|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

### socket-server

| Command | Description |
|---|---|
| `npm start` | Start the socket server |

---

## Deployment

- **Socket server** → [Railway](https://railway.app) (deploy the `socket-server/` folder)
- **Frontend** → [Vercel](https://vercel.com) (deploy the `my-app/` folder)

After deploying the socket server, set the environment variable in Vercel:

```env
NEXT_PUBLIC_SOCKET_URL=https://your-socket-server.up.railway.app
```
