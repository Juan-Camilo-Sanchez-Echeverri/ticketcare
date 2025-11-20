import { footer } from './sections/footer.section';
import { styles } from './sections/styles.section';

export const ticketFollowupEmail = (
  userEmail: string,
  password: string,
): string => {
  return `
  <!DOCTYPE html>
      <html lang="es">
      <head>
        ${styles}
      </head>
    <body>
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Seguimiento de Ticket de Soporte</h2>
        <p>Estimado/a Cliente,</p>
        <p>Hemos recibido tu solicitud a uno de nuestros correos. Para asegurar que toda la información esté centralizada, llevar coherencia y una trazabilidad completa del seguimiento de tu ticket, te invitamos a utilizar nuestra plataforma en línea.</p>
        <p>Por favor, utiliza las siguientes credenciales para acceder a tu cuenta y continuar con el seguimiento del ticket:</p>
        <ul>
          <li><strong>Usuario (Correo):</strong> ${userEmail}</li>
          <li><strong>Contraseña:</strong> ${password}</li>
        </ul>
        <p>Puedes ingresar a la plataforma a través del siguiente enlace: <a href="https://ticketcare.com/login" target="_blank">https://ticketcare.com/login</a></p>
        <p>Una vez dentro, podrás ver el estado de tu ticket, agregar cualquier información adicional y comunicarte con nuestro equipo de soporte.</p>
        <p>Gracias por tu colaboración.</p>
        <p>Atentamente,</p>
        <p>El Equipo de Soporte</p>
      </div>
      ${footer}
    </body>
  </html>
  `;
};
