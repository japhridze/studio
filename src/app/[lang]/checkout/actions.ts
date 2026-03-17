
'use server';

/**
 * @fileOverview Server actions for handling bank payment integrations.
 * This file uses environment variables to keep sensitive API keys secure.
 */

/**
 * Initiates a payment process with the bank.
 * IMPORTANT: In production, ensure BOG_CLIENT_ID and BOG_SECRET_KEY are set
 * in your environment variables (e.g., via Firebase Console or .env file).
 */
export async function createBankOrder(amount: number, orderId: string, lang: string) {
  try {
    // These keys should ONLY be accessed on the server via process.env
    const clientId = process.env.BOG_CLIENT_ID;
    const secretKey = process.env.BOG_SECRET_KEY;

    // Log for debugging (remove sensitive info in production logs)
    console.log(`[Payment Action] Initiating payment for Order: ${orderId}, Amount: ${amount}`);

    if (!clientId || !secretKey) {
      console.warn("Bank API keys are missing. Using simulated payment flow.");
      // For now, we return a simulated URL until you provide real credentials
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return {
        success: true,
        redirectUrl: `https://checkout.bog.ge/simulated-payment?id=${orderId}&amount=${amount}&lang=${lang}`
      };
    }

    // REAL INTEGRATION STEPS (When keys are present):
    // 1. Fetch access token from BOG
    // const authResponse = await fetch('https://oauth2.bog.ge/auth/realms/bog/protocol/openid-connect/token', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    //   body: new URLSearchParams({
    //     grant_type: 'client_credentials',
    //     client_id: clientId,
    //     client_secret: secretKey
    //   })
    // });
    // const { access_token } = await authResponse.json();

    // 2. Create Order at BOG
    // const orderResponse = await fetch('https://api.bog.ge/checkout/v1/orders', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${access_token}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     amount: { currency: 'GEL', value: amount.toFixed(2) },
    //     external_order_id: orderId,
    //     callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/callback`,
    //     redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/${lang}/account`
    //   })
    // });
    // const { redirect_url } = await orderResponse.json();

    return {
      success: true,
      redirectUrl: `https://checkout.bog.ge/simulated-payment?id=${orderId}&amount=${amount}&lang=${lang}`
    };

  } catch (error) {
    console.error("Payment initiation failed:", error);
    return { success: false, error: "Could not initiate payment" };
  }
}
