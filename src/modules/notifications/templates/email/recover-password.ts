import { footer } from './sections/footer.section';
import { header } from './sections/header.section';
import { styles } from './sections/styles.section';

const URL = 'https://google.com/activate-account';

interface Data {
  email: string;
  token: string;
}

export const recoverPassword = (data: Data) => {
  const { email, token } = data;
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      ${styles}
    </head>
    <body>
      ${header}
      <div class="container">
        <p>Recibimos una solicitud para recuperar tu contraseña. Para continuar con el proceso, por favor haz clic en el siguiente enlace:</p>
        <span class="ticket">Ticket</span><span class="care">Care</span>.</p>
        <p>Haz clic en el siguiente enlace para recuperar tu contraseña:</p>
        <a class="btn" href="${URL}?email=${email}&token=${token}">Recuperar contraseña!</a>
        <p><b>Nota: </b>ten en cuenta que el enlace tiene un tiempo de expiración de 1 hora.</p>
        <p>Si no realizaste esta solicitud, tienes alguna pregunta o inquietud, no dudes en contactar a nuestro equipo de soporte al cliente.</p>
      </div>
      ${footer}
    </body>
    </html>`;
};
