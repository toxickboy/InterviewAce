import { NextResponse } from 'next/server';
import { Cashfree } from 'cashfree-pg';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('order_id');
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';

    if (!orderId) {
        return NextResponse.redirect(new URL('/pricing?status=failed', appUrl));
    }
    
    // In a real app, you would have a webhook for SUCCESS/FAILED server-to-server notifications.
    // The redirect is for the user experience. We'll just check the order status here.
    
    Cashfree.XClientId = process.env.CASHFREE_APP_ID!;
    Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY!;
    Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

    try {
        const response = await Cashfree.PGOrderFetchPayments("2023-08-01", orderId);
        
        if (response.data && response.data.length > 0) {
            const payment = response.data[0];
            if (payment.payment_status === 'SUCCESS') {
                 // Here you would typically:
                 // 1. Verify the order amount against the one stored in your database for this order_id.
                 // 2. Mark the order as paid in your database.
                 // 3. Grant the user premium access.
                 // For this example, we'll just redirect to success.
                 // Note: The `setTierToPremium` logic is client-side in this app, 
                 // so the user needs to be logged in and the client will handle it.
                 return NextResponse.redirect(new URL('/?payment=success', appUrl));
            }
        }
        
        // Handle other statuses (FAILED, PENDING, etc.)
        return NextResponse.redirect(new URL('/pricing?payment=failed', appUrl));

    } catch (error) {
        console.error("Cashfree verification failed", error);
        return NextResponse.redirect(new URL('/pricing?payment=error', appUrl));
    }
}
