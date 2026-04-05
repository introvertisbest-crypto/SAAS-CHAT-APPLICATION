import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getCurrentUser } from '@/lib/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (user.subscriptionTier === 'pro') {
      return NextResponse.json(
        { error: 'You already have a Pro subscription' },
        { status: 400 }
      );
    }

    const priceId = process.env.STRIPE_PRICE_ID_PRO;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (!priceId) {
      console.error('STRIPE_PRICE_ID_PRO not configured');
      return NextResponse.json(
        { error: 'Stripe configuration error' },
        { status: 500 }
      );
    }

    console.log('💳 Creating checkout for user:', user._id.toString(), user.email);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/chat?success=true`,
      cancel_url: `${appUrl}/chat?canceled=true`,
      customer_email: user.email,
      metadata: {
        userId: user._id.toString(),
      },
      subscription_data: {
        metadata: {
          userId: user._id.toString(),
        },
      },
    });

    console.log('✅ Checkout session created:', session.id);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
