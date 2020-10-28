import { EmailTemplate } from '../email-template';

const en: EmailTemplate = {
  subject: `{appName} Password Reset`,
  body:
`You are receiving this because you (or someone else) have requested the reset of the password for your account.
Please click on the following link, or paste this into your browser to complete the process:

{publicAddress}/reset-password/{token}

If you did not request this, please ignore this email and your password will remain unchanged.`
};

const pl: EmailTemplate = {
  subject: `{appName} Reset hasła`,
  body:
`Otrzymałeś tego e-maila, ponieważ ty (albo ktoś inny) wysłał prośbę o wygenerowanie nowego hasła.
Kliknij w poniższy link albo przekopiuj go do przeglądarki, aby dokończyć ten proces:

{publicAddress}/reset-password/{token}

Jeśli to nie ty wysłałeś tę prośbę, zignoruj ten e-mail, a twoje hasło nie zostanie zmienione.`
};


export const resetPasswordTemplates: {[key: string]: EmailTemplate} = { en, pl };
