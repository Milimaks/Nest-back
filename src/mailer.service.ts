import { Resend } from 'resend';

export class MailerService {
  private readonly mailer: Resend;
  constructor() {
    this.mailer = new Resend(process.env.RESEND_API_KEY);
  }
  async sendCreatedAccountEmail({
    recipient,
    firstname,
  }: {
    recipient: string;
    firstname: string;
  }) {
    try {
      const { data, error } = await this.mailer.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: [recipient],
        subject: 'Hello War',
        html: `<strong>Coucou ${firstname} bg</strong>`,
      });

      if (error) {
        return console.error({ error });
      }
    } catch (error) {
      return console.error({ error });
    }
  }
}
