import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import connectDB from '@/lib/db';
import User from '@/models/User';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    console.log('🔔 Webhook hit - Signature exists:', !!signature);
    console.log('🔔 Webhook secret exists:', !!webhookSecret);

    if (!signature || !webhookSecret) {
      console.error('❌ Missing signature or webhook secret');
      return NextResponse.json(
        { error: 'Webhook configuration error' },
        { status: 400 }
      );
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log('✅ Webhook verified:', event.type);
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    console.log('🔌 Connecting to DB...');
    await connectDB();
    console.log('✅ DB connected');

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.userId;

        console.log('💳 Checkout completed - Session:', {
          id: session.id,
          customer: session.customer,
          subscription: session.subscription,
          metadata: session.metadata,
          payment_status: session.payment_status,
        });

        if (!userId) {
          console.error('❌ No userId in session metadata');
          break;
        }

        console.log('🔍 Looking up user:', userId);

        const updatedUser = await User.findByIdAndUpdate(
          userId,
          {
            subscriptionTier: 'pro',
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
          },
          { new: true }
        );

        if (!updatedUser) {
          console.error('❌ User not found in DB:', userId);
          console.log('🔍 Attempting to find all users to debug...');
          const allUsers = await User.find().select('email subscriptionTier');
          console.log('📋 All users:', allUsers.map(u => ({ id: u._id.toString(), email: u.email, tier: u.subscriptionTier })));
        } else {
          console.log(`✅ User ${updatedUser.email} upgraded to Pro successfully`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        console.log('🗑️ Subscription deleted:', subscription.id);
        
        const user = await User.findOneAndUpdate(
          { stripeSubscriptionId: subscription.id },
          {
            subscriptionTier: 'free',
            stripeSubscriptionId: null,
          },
          { new: true }
        );

        if (user) {
          console.log(`✅ User ${user.email} downgraded to Free`);
        } else {
          console.log('⚠️ No user found with subscription ID:', subscription.id);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        console.log('📝 Subscription updated:', subscription.id, 'Status:', subscription.status);
        
        if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
          const user = await User.findOneAndUpdate(
            { stripeSubscriptionId: subscription.id },
            {
              subscriptionTier: 'free',
              stripeSubscriptionId: null,
            },
            { new: true }
          );

          if (user) {
            console.log(`✅ User ${user.email} subscription canceled/unpaid - downgraded`);
          }
        }
        break;
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed', details: error.message },
      { status: 500 }
    );
  }
}
