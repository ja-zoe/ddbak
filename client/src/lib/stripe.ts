import 'server-only'

import Stripe from 'stripe'

const stripeKey = process.env.STRIPE_SECRET_KEY
if (!stripeKey) throw new Error("STRIPE_KEY environment variable is undefined")

export const stripe = new Stripe(stripeKey)