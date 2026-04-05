import Pusher from 'pusher';

export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER || 'mt1',
  useTLS: true,
});

export const pusherClientConfig = {
  key: process.env.NEXT_PUBLIC_PUSHER_KEY || process.env.PUSHER_KEY,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || process.env.PUSHER_CLUSTER || 'mt1',
};
