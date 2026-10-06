import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const PLANS = {
  pack_100: {
    id: 'pack_100',
    title: 'NexoJuris · 100 Créditos de Estudo',
    description: '100 créditos para pesquisas aprofundadas com Grafo, Doutrina e Jurisprudência.',
    price: 29.90,
    credits: 100
  },
  pack_500: {
    id: 'pack_500',
    title: 'NexoJuris · 500 Créditos Profissional',
    description: '500 créditos de pesquisa conectada de alta fidelidade.',
    price: 79.90,
    credits: 500
  },
  pack_unlimited: {
    id: 'pack_unlimited',
    title: 'NexoJuris · Acesso Mensal Ilimitado',
    description: 'Consultas ilimitadas durante 30 dias para preparação intensiva.',
    price: 149.90,
    credits: 9999
  }
};

export async function POST(req: Request) {
  try {
    const { planId, userEmail, userId } = await req.json();

    const plan = PLANS[planId as keyof typeof PLANS];
    if (!plan) {
      return NextResponse.json({ error: 'Plano comercial não encontrado' }, { status: 400 });
    }

    const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nexojuris.com.br';

    if (!token) {
      // Retorna modo simulação de checkout se token ainda não inserido
      return NextResponse.json({
        success: true,
        isDemo: true,
        message: 'Credenciais do Mercado Pago pendentes de configuração na Vercel.',
        plan,
        checkoutUrl: `${appUrl}/?status=pending_credentials`
      });
    }

    const client = new MercadoPagoConfig({ accessToken: token });
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            id: plan.id,
            title: plan.title,
            description: plan.description,
            quantity: 1,
            unit_price: plan.price,
            currency_id: 'BRL'
          }
        ],
        payer: {
          email: userEmail || 'cliente@nexojuris.com.br'
        },
        metadata: {
          userId: userId || 'usr_pilot_01',
          planId: plan.id,
          credits: plan.credits
        },
        back_urls: {
          success: `${appUrl}/?payment=success&credits=${plan.credits}`,
          failure: `${appUrl}/?payment=failure`,
          pending: `${appUrl}/?payment=pending`
        },
        auto_return: 'approved'
      }
    });

    return NextResponse.json({
      success: true,
      initPoint: result.init_point || result.sandbox_init_point,
      preferenceId: result.id
    });
  } catch (error: any) {
    console.error('Erro ao gerar checkout comercial:', error);
    return NextResponse.json(
      { error: 'Erro ao processar transação comercial', details: error.message },
      { status: 500 }
    );
  }
}
