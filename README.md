# classic-maximize-pay

Backend (Node/Express + Mongoose). Stores payments to MongoDB Atlas.

## Local development

1. Copy `.env.example` to `.env` and fill `MONGODB_URI` (do NOT commit `.env`).
2. Install:
3. Run locally:
4. API endpoints:
- `GET /` - hello
- `GET /api/payments` - list payments
- `POST /api/payments` - create payment (JSON body: senderName, amount, currency, reference)

## Deploy to Render (using GitHub repo)

1. Push this repo to GitHub.
2. In Render dashboard -> **New** -> **Web Service** -> connect your GitHub repo (select branch).
3. Fill:
- Name: `classic-maximize-pay`
- Build Command: `npm install`
- Start Command: `npm start`
- Environment: choose "Node"
4. Add Environment Variable on Render:
- Key: `MONGODB_URI`
- Value: your full connection string (replace `<dbUserPassword>` with the DB user's password).
- Save. Render will trigger a deploy. **Do not** put password in code or in repo.
5. After deploy, your service URL will be `https://<your-service>.onrender.com`. Test `/health` and `/api/payments`.

## Notes / Security
- Never commit your DB password to git.
- Use Render Environment Variables or Secret Files for credentials. 1