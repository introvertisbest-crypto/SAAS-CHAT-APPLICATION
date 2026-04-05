# ChatSpace - Real-time SaaS Chat Application

A simple but functional chat app with subscription tiers. Built this to learn more about real-time messaging and payment integration.

## What is this?

Basically a chat room where free users can only read messages, and Pro users (after paying via Stripe) can send messages. Real-time updates using WebSocket via Pusher.

## Tech Stack

- **Next.js 14** - Full-stack React framework (using App Router)
- **MongoDB Atlas** - Database for storing users and messages
- **Mongoose** - MongoDB ODM
- **Tailwind CSS** - Styling with custom "space grey" theme
- **JWT** - Authentication (stored in cookies + localStorage backup)
- **Stripe** - Payment processing for Pro subscriptions
- **Pusher** - Real-time WebSocket messaging
- **bcryptjs** - Password hashing

## Why Next.js for everything?

Decided to keep frontend and backend together because:

- Easier deployment (one service on Render)
- API routes are built-in
- Can share types/logic between client and server
- SSR for faster initial load

For a bigger app, I'd probably split them, but for this side project the monolith approach made sense.

## Why Pusher instead of Socket.io?

Originally tried Socket.io but ran into issues on Render's serverless architecture. Socket.io needs a persistent WebSocket connection and every request on Render can hit a different instance, so the socket state gets lost.

Pusher solved this because:

- They host the WebSocket infrastructure
- Works with any serverless platform
- Free tier covers 200k messages/day (plenty for a small app)
- Drop-in replacement, minimal code changes

Downside: external dependency, but for this project it was worth the tradeoff for reliability.

## Deployment

Currently deployed on **Render** (free tier):

- Web Service for the Next.js app
- Automatic deploys from GitHub
- Environment variables configured in Render dashboard

**Live URL:** https://saas-chat-application.onrender.com

###### Stripe Test Card Details:

Stripe Test Card # :4242 4242 4242 4242
Exp:12/34
CVC:123

### Environment Variables Needed

```bash
# Database
MONGO_URI=mongodb+srv://...

# Auth
JWT_SECRET=your_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_PRO=price_...

# Pusher (WebSocket)
PUSHER_APP_ID=...
PUSHER_KEY=...
PUSHER_SECRET=...
PUSHER_CLUSTER=...
NEXT_PUBLIC_PUSHER_KEY=...
NEXT_PUBLIC_PUSHER_CLUSTER=...

# App
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Running Locally

1. Clone the repo:

```bash
git clone https://github.com/yourusername/saas-chat-app.git
cd saas-chat-app
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Copy `.env.example` to `.env` and fill in your values (need MongoDB, Stripe test keys, Pusher account)

4. Run dev server:

```bash
npm run dev
```

App runs at `http://localhost:3000`

## Current Limitations

- **No message history pagination** - loads all messages at once (fine for small chats, will break at scale)
- **No private messaging** - just one global chat room
- **No file uploads** - text only
- **No typing indicators** - could add with Pusher but didn't implement
- **Basic subscription model** - no trials, no multiple tiers, no cancelation flow (user has to manage via Stripe)
- **Cookie issues on some browsers** - had to add localStorage backup because cookies weren't persisting properly after browser restart
- **No rate limiting** - someone could spam the chat API
- **No admin panel** - can't delete messages or ban users

## Future Improvements

If I come back to this project, I'd probably add:

1. **Proper pagination** - Infinite scroll for messages, virtualized list for performance
2. **Multiple chat rooms** - Let users create/join different channels
3. **Private DMs** - One-on-one messaging between users
4. **File uploads** - Images, documents (probably use AWS S3 or Cloudinary)
5. **Better auth** - OAuth with Google/GitHub, email verification
6. **Message reactions** - Like/emoji reactions to messages
7. **Threaded replies** - Reply to specific messages
8. **Better Stripe integration** - Proper cancelation flow, multiple tiers, trials
9. **Rate limiting** - Prevent spam (could use Upstash Redis)
10. **Admin dashboard** - User management, message moderation
11. **Typing indicators** - "User is typing..." using Pusher presence channels
12. **Online status** - Show who's currently online
13. **Mobile app** - React Native or PWA
14. **End-to-end encryption** - For privacy (probably overkill for this use case though)

## Things I Learned

- Serverless WebSocket is tricky - Pusher was a lifesaver
- Stripe webhooks can be annoying to test locally (used Stripe CLI)
- Cookie persistence across browser sessions is weirdly hard
- Render's free tier spins down after inactivity (cold start takes ~30 seconds)
- Always have a backup auth method (localStorage saved us when cookies failed)

## License

MIT - do whatever you want with this code.

---

Built in 2024 as a learning project. Not production-ready but it works!
