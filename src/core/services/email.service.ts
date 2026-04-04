import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export class EmailService {
  private from = "Solidariza <onboarding@resend.dev>"; // Default Resend test email or domain

  async sendWelcomeEmail(to: string, name: string) {
    try {
      await resend.emails.send({
        from: this.from,
        to: [to],
        subject: "Bem-vindo ao Solidariza!",
        html: `
          <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
            <div style="background-color: #7A0006; padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Solidariza</h1>
            </div>
            <div style="padding: 40px;">
              <h2 style="color: #7A0006;">Olá, ${name}!</h2>
              <p style="font-size: 16px; line-height: 1.6;">Estamos muito felizes em ter você conosco na maior rede de solidariedade de Manaus.</p>
              <p style="font-size: 16px; line-height: 1.6;">Agora você pode criar pedidos de ajuda ou encontrar causas para apoiar diretamente no nosso feed.</p>
              <div style="text-align: center; margin-top: 40px;">
                <a href="${process.env.NEXTAUTH_URL}/login" style="background-color: #e63946; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Acessar minha conta</a>
              </div>
            </div>
            <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999;">
              © 2026 Solidariza. Manaus, AM.
            </div>
          </div>
        `,
      });
    } catch (error) {
      console.error("Erro ao enviar email de boas-vindas:", error);
    }
  }

  async sendHelpOfferNotification(to: string, receiverName: string, donorName: string, requestTitle: string) {
    try {
      await resend.emails.send({
        from: this.from,
        to: [to],
        subject: "Nova oferta de ajuda recebida!",
        html: `
          <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; padding: 40px;">
            <h2 style="color: #7A0006;">Boas notícias, ${receiverName}!</h2>
            <p><strong>${donorName}</strong> enviou uma oferta de ajuda para seu pedido: <strong>"${requestTitle}"</strong>.</p>
            <p>Acesse o painel do Solidariza para ver os detalhes e aceitar a oferta.</p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXTAUTH_URL}/solicitacoes" style="background-color: #7A0006; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Ver Oferta</a>
            </div>
          </div>
        `,
      });
    } catch (error) {
       console.error("Erro ao enviar email de oferta:", error);
    }
  }

  async sendDonationConfirmedNotification(to: string, donorName: string, requestTitle: string) {
    try {
      await resend.emails.send({
        from: this.from,
        to: [to],
        subject: "Sua ajuda chegou ao destino!",
        html: `
          <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; padding: 40px;">
            <h2 style="color: #22c55e;">Missão cumprida, ${donorName}!</h2>
            <p>O receptor confirmou o recebimento da sua doação referente ao pedido: <strong>"${requestTitle}"</strong>.</p>
            <p>Obrigado por fazer a diferença no mundo de alguém hoje.</p>
            <p>Você acaba de ganhar uma nova conquista no seu painel de impacto!</p>
          </div>
        `,
      });
    } catch (error) {
       console.error("Erro ao enviar email de confirmação:", error);
    }
  }
}
