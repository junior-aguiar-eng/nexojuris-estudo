import { NextResponse } from 'next/server';
import { query } from '@/server/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Mercado Pago envia notificações com action 'payment.created' ou 'payment.updated'
    if (body.type === 'payment' || body.action?.includes('payment')) {
      const paymentId = body.data?.id;

      // Em produção real, você valida o pagamento via API do Mercado Pago
      // e recupera o metadata com userId e credits comprados
      const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
      if (token && paymentId) {
        const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const paymentData = await mpRes.json();

        if (paymentData.status === 'approved') {
          const userId = paymentData.metadata?.user_id || 'usr_pilot_01';
          const credits = Number(paymentData.metadata?.credits || 100);

          // Credita no livro-razão (credit_ledger)
          await query(
            `INSERT INTO credit_ledger (user_id, amount, balance_after, reason, reference_id)
             VALUES ($1, $2, (SELECT COALESCE(balance_after, 0) + $2 FROM credit_ledger WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1), $3, $4)`,
            [userId, credits, `Compra comercial de plano/créditos (${paymentData.id})`, String(paymentId)]
          );
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Erro no webhook do Mercado Pago:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
