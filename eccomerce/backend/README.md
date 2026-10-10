# Backend setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env`.
3. Set `JWT_SECRET` in `.env` to a private random value of at least 32 characters (generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`). `MONGO_URI` should point to a running MongoDB instance.
4. Set `OPENAI_API_KEY` to your OpenAI API key in this backend `.env` file. Never put it in the frontend or commit `.env`.
5. For checkout, add your Chapa secret key to `CHAPA_SECRET_KEY`. Set `FRONTEND_URL` to the frontend origin that Chapa should return customers to. A publicly reachable `CHAPA_CALLBACK_URL` for `POST /api/orders/chapa/callback` is optional; the return page verifies the payment directly with Chapa. Keep the Chapa key only in this backend `.env`.
6. Seed MongoDB with the shop's existing 90-item catalog by running `npm run seed:catalog` in this directory. The seeder only inserts missing catalog items and does not overwrite or delete existing products.
7. Start the API with `npm run dev`.
8. Start the frontend from `../frontend` with `npm run dev`.

The homepage chatbot uses live MongoDB products as its inventory context and is rate-limited to 12 messages per client per minute. Registration stores the email and phone number in MongoDB and saves only a bcrypt password hash. Logging in checks that hash and returns a signed token. Chapa orders use MongoDB product prices and require a successful Chapa transaction verification before the frontend reports payment success. Keep `.env` private; it is excluded from git.
