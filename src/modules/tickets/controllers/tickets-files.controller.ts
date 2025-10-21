import {
  Controller,
  UseGuards,
  Patch,
  Param,
  UseInterceptors,
  Body,
  UploadedFiles,
  Post,
  Delete,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { FilesValidationPipe } from '@common/pipes';

import { AllRoles } from '@common/decorators';

import { OwnActivityTicketGuard, OwnTicketGuard } from '../guards';
import { ActivityDto, EvidenceDto } from '../dto';
import { ActivityTicketPipe, EvidenceTicketPipe } from '../pipes';
import { TicketsService } from '../tickets.service';
import { TicketDocument } from '../schemas';
import {
  TicketResponseInterceptor,
  TicketActivityEventInterceptor,
} from '../interceptors';

@Controller('tickets')
@UseInterceptors(TicketResponseInterceptor)
export class TicketsFilesController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Patch(':ticketId/evidence')
  @AllRoles()
  @UseGuards(OwnTicketGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async addEvidence(
    @Param('ticketId') ticketId: string,
    @Body(EvidenceTicketPipe)
    evidenceDto: EvidenceDto,
    @UploadedFiles(FilesValidationPipe)
    files?: Array<Express.Multer.File>,
  ): Promise<TicketDocument> {
    const { multimedia = [] } = evidenceDto;

    await Promise.all(
      (files ?? []).map(async (file) => {
        console.log(file);
        // const { path } = generateFileNameAndPath(
        //   file,
        //   evidenceDto.contractorId,
        //   `tickets/${ticketId}/evidence`,
        // );
        // const fileUrl = await this.s3Service.uploadFile(file, path);
        // multimedia.push({
        //   nombreFile: file.originalname,
        //   url: fileUrl,
        // });
      }),
    );

    const updatedEvidenceDto = {
      ...evidenceDto,
      multimedia,
      query: {
        ...evidenceDto.query,
        $push: { 'evidence.multimedia': { $each: multimedia } },
      },
    };

    return await this.ticketsService.update(ticketId, updatedEvidenceDto);
  }

  @Post(':ticketId/activity')
  @AllRoles()
  @UseGuards(OwnTicketGuard)
  @UseInterceptors(FilesInterceptor('files'))
  @UseInterceptors(TicketActivityEventInterceptor)
  async addActivity(
    @Param('ticketId') ticketId: string,
    @Body(ActivityTicketPipe) activityDto: ActivityDto,
    @UploadedFiles(FilesValidationPipe)
    files?: Array<Express.Multer.File>,
  ): Promise<TicketDocument> {
    if (files && files.length > 0) {
      activityDto.content.urls = [];

      // for (const file of files) {
      //   const { path } = generateFileNameAndPath(
      //     file,
      //     activityDto.contractorId,
      //     `tickets/${ticketId}/activity`,
      //   );

      //   const fileUrl = await this.s3Service.uploadFile(file, path);

      //   activityDto.content.urls.push(fileUrl);
      // }
    }

    activityDto = {
      ...activityDto,
      query: {
        status: activityDto.status,
        $push: {
          activity: { content: activityDto.content, user: activityDto.user },
        },
      },
    };

    return await this.ticketsService.update(ticketId, activityDto);
  }

  @Patch(':ticketId/activity/:activityId')
  @UseGuards(OwnTicketGuard, OwnActivityTicketGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async updateActivity(
    @Param('ticketId') ticketId: string,
    @Param('activityId') activityId: string,
    @UploadedFiles(FilesValidationPipe) files: Array<Express.Multer.File>,
    @Body(ActivityTicketPipe) activityDto: ActivityDto,
  ): Promise<TicketDocument> {
    if (files && files.length > 0) {
      activityDto.content.urls = activityDto.content.urls || [];

      // for (const file of files) {
      //   const { path } = generateFileNameAndPath(
      //     file,
      //     activityDto.contractorId,
      //     `tickets/${ticketId}/activity`,
      //   );

      //   const fileUrl = await this.s3Service.uploadFile(file, path);

      //   activityDto.content.urls.push(fileUrl);
      // }
    }

    const updateQuery = {
      $set: { 'activity.$.content': activityDto.content },
      'activity.$.updatedAt': new Date(),
    };

    return await this.ticketsService.updateActivity(
      ticketId,
      activityId,
      updateQuery,
    );
  }

  @Delete(':ticketId/activity/:activityId/delete-file')
  @AllRoles()
  @UseGuards(OwnTicketGuard, OwnActivityTicketGuard)
  async deleteFileFromActivity(
    @Param('ticketId') ticketId: string,
    @Param('activityId') activityId: string,
    @Body('fileUrl') fileUrl: string,
  ): Promise<TicketDocument> {
    const updateQuery = { $pull: { 'activity.$.content.urls': fileUrl } };

    const updatedTicket = await this.ticketsService.updateActivity(
      ticketId,
      activityId,
      updateQuery,
    );

    // await this.s3Service.deleteFile(fileUrl);

    return updatedTicket;
  }

  @Delete(':ticketId/activity/:activityId')
  @AllRoles()
  @UseGuards(OwnTicketGuard, OwnActivityTicketGuard)
  async deleteEvidence(
    @Param('ticketId') ticketId: string,
    @Param('activityId') activityId: string,
  ): Promise<TicketDocument> {
    const activity = await this.ticketsService.deleteActivity(
      ticketId,
      activityId,
    );

    if (activity['_id'].toString() === activityId) {
      const urls = activity?.content?.urls;
      if (Array.isArray(urls)) {
        // await Promise.all(urls.map((url) => this.s3Service.deleteFile(url)));
      }
    }

    return await this.ticketsService.findOneById(ticketId);
  }
}
