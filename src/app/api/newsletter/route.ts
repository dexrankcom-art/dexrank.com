import { db } from '@/db';
import { newsletterSubscribers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const subscribeSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = subscribeSchema.parse(body);
    const normalizedEmail = email.toLowerCase();

    // Check if email already exists
    const existing = await db
      .select({ email: newsletterSubscribers.email })
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, normalizedEmail))
      .limit(1);

    if (existing.length > 0) {
      return Response.json({
        success: true,
        message: 'Already subscribed',
      });
    }

    // Insert new subscriber
    await db.insert(newsletterSubscribers).values({
      email: normalizedEmail,
    });

    return Response.json({
      success: true,
      message: 'Thanks for subscribing!',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error('Newsletter signup error:', error);
    return Response.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
