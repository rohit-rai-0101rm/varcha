# Varcha — AWS Deployment Plan

Moving hosting from Vercel/Render to a self-managed AWS EC2 instance. Two phases: get manual deployment working end-to-end first, then automate it with CI/CD so every push to `main` deploys automatically.

**Cost target:** ₹0 for the first 12 months (AWS free-tier EC2, MongoDB Atlas free tier, Cloudinary free tier). Domain (`varcha.in`) already owned via DomainRacer. Only real recurring cost once notifications are built is transactional SMS (~₹100–500/month, usage-based). After month 12, EC2 compute becomes ~₹800–1,700/month.

---

## Phase 1 — Manual deployment

- [x] Create AWS account, verify identity, set console region to Mumbai (`ap-south-1`)
- [x] Launch EC2 instance (t2/t3.micro, Ubuntu 22.04 LTS, free-tier eligible)
- [x] Allocate and attach an Elastic IP to the instance (stays free as long as it's attached to a running instance)
- [x] SSH into the instance for the first time
- [x] Install server software: Node.js, Yarn, PM2, Nginx, Certbot, Git
- [x] Clone the Varcha repo onto the server
- [x] Install dependencies with `yarn install` at the repo root (single install covers the whole workspace: `shared`, `backend`, `frontend`)
- [x] Build in order: `shared` → `backend` → `frontend`
- [x] Create the production `.env` file directly on the server (real Mongo URI, JWT secret, Cloudinary keys, Razorpay keys, etc.) — this file is never committed to git
- [x] Set up a PM2 ecosystem file to run both the Next.js process and the Express process
- [x] Run `pm2 startup` + `pm2 save` so both processes auto-restart if the server reboots
- [x] Configure Nginx as a reverse proxy: `varcha.in` → Next.js (port 3000), `varcha.in/api` → Express (port 4000)
- [x] Update `varcha.in`'s DNS A record (via Cloudflare nameservers) to point at the Elastic IP
- [x] Run Certbot to get a free HTTPS certificate (Let's Encrypt) for `varcha.in`
- [x] End-to-end check: homepage loads over HTTPS, PDP loads, admin login works, a sandbox checkout completes

## Phase 2 — CI/CD (auto-deploy on push to `main`)

- [x] Generate a dedicated SSH key pair just for deployments (separate from personal key)
- [x] Add its public key to the EC2 instance's `~/.ssh/authorized_keys`
- [x] Store the private key + server IP + username as encrypted GitHub Actions Secrets in the repo (Settings → Secrets and variables → Actions) — never committed to code
- [x] Write `.github/workflows/deploy.yml` — triggers on every push to `main`:
  - SSH into the EC2 instance
  - `git pull origin main`
  - `yarn install` + rebuild `shared` → `backend` → `frontend`
  - Restart both PM2 processes (`pm2 restart all` or by name)
- [x] Test it: push a trivial change to `main`, confirm GitHub Actions runs and the live site updates automatically
- [ ] (Later hardening) add a build/typecheck step before deploy so a broken commit can't take the site down; switch to zero-downtime `pm2 reload` instead of `restart`

---

## Why AWS instead of staying on Vercel/Render

Vercel + Render require no server maintenance (patching, SSL renewal, process monitoring) — that's handled for you. AWS EC2 is cheaper at this scale but puts that maintenance burden on the developer. Moving to AWS here is partly cost-driven, partly a deliberate learning exercise. Worth revisiting this tradeoff if ops overhead becomes a problem for a live client site.
