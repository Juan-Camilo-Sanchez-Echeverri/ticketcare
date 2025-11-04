import { Module } from '@nestjs/common';

import { TicketsModule } from '@modules/tickets/tickets.module';
import { UsersModule } from '@modules/users/users.module';

import { EmailService } from './email.service';

@Module({
  imports: [TicketsModule, UsersModule],
  providers: [EmailService],
})
export class EmailModule {}
