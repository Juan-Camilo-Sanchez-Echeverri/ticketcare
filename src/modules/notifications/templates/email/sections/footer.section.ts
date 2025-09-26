import { envs } from '@configs';

export const footer = `
    <footer>
      <p>
      Saludos,<br />El Equipo de <span class="ticket">Ticket</span><span class="care">Care</span>
      </p>
      <img src=\`${envs.urlServer}/uploads/footer.avif\` alt="Ticket Care Footer" />
    </footer>
  `;
