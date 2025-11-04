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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { FILE_EXTENSIONS } from '@common/constants';

import { UploadInterceptor } from '@common/interceptors/upload.interceptor';

import { FilesValidationPipe } from '@common/pipes';

import {
  AllRoles,
  ApiAuthResponses,
  ApiNoContentResponseWrapper,
  ApiOkResponseWrapper,
} from '@common/decorators';

import { StorageService } from '@modules/storage/storage.service';

import { OwnActivityTicketGuard, OwnTicketGuard } from '../guards';

import { ActivityDto, EvidenceDto } from '../dto';

import { ActivityTicketPipe, EvidenceTicketPipe } from '../pipes';

import { TicketsService } from '../tickets.service';

import { TicketDocument } from '../schemas';

import { TicketActivityEventInterceptor } from '../interceptors';

import { TicketResponse } from '../responses/ticket.response';

@ApiBearerAuth()
@ApiAuthResponses()
@ApiTags('tickets')
@Controller('tickets')
export class TicketsFilesController {
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly storageService: StorageService,
  ) {}

  /**
   * Add evidence to a ticket
   *
   * @remarks
   * This endpoint allows users to add evidence files to a specific ticket.
   * It supports uploading multiple files and associates them with the ticket's evidence.
   *
   * Allows all roles to access this endpoint, with ownership verification via the OwnTicketGuard.
   */
  @Patch(':ticketId/evidence')
  @AllRoles()
  @UseGuards(OwnTicketGuard)
  @ApiBody({ type: EvidenceDto })
  @ApiConsumes('multipart/form-data')
  @UploadInterceptor({
    type: 'multiple',
    fieldName: 'files',
    maxCount: 10,
    maxSizeMB: 50,
    allowedMimeTypes: FILE_EXTENSIONS,
  })
  @ApiOkResponseWrapper(TicketResponse, { isArray: false })
  async addEvidence(
    @Body(EvidenceTicketPipe) evidenceDto: EvidenceDto,
    @Param('ticketId') ticketId: string,
    @UploadedFiles(FilesValidationPipe)
    files?: Array<Express.Multer.File>,
  ): Promise<TicketDocument> {
    const { multimedia = [] } = evidenceDto;

    await Promise.all(
      (files ?? []).map(async (file) => {
        const folder = `${evidenceDto.contractorId}/tickets/${ticketId}/evidence`;

        const fileUrl = await this.storageService.saveFile(
          file,
          folder,
          'local',
        );

        multimedia.push({ nameFile: file.originalname, url: fileUrl });
      }),
    );

    evidenceDto.multimedia = multimedia;

    return await this.ticketsService.addEvidence(ticketId, evidenceDto);
  }

  /**
   * Add activity to a ticket
   *
   * @remarks
   * This endpoint allows users to add activity entries to a specific ticket.
   * It supports uploading multiple files associated with the activity.
   *
   * Allows all roles to access this endpoint, with ownership verification via the OwnTicketGuard.
   */
  @Post(':ticketId/activity')
  @AllRoles()
  @UseGuards(OwnTicketGuard)
  @ApiConsumes('multipart/form-data')
  @ApiOkResponseWrapper(TicketResponse, { isArray: false })
  @UseInterceptors(TicketActivityEventInterceptor)
  @UploadInterceptor({ type: 'multiple', fieldName: 'files' })
  async addActivity(
    @Param('ticketId') ticketId: string,
    @Body(ActivityTicketPipe) activityDto: ActivityDto,
    @UploadedFiles(FilesValidationPipe)
    files?: Array<Express.Multer.File>,
  ): Promise<TicketDocument> {
    if (files && files.length > 0) {
      activityDto.content.urls = [];

      for (const file of files) {
        const folder = `${activityDto.contractorId}/tickets/${ticketId}/activity`;

        const fileUrl = await this.storageService.saveFile(
          file,
          folder,
          'local',
        );

        activityDto.content.urls.push(fileUrl);
      }
    }

    return await this.ticketsService.addActivity(ticketId, activityDto);
  }

  /**
   * Update activity in a ticket
   *
   * @remarks
   * This endpoint allows users to update an existing activity entry in a specific ticket.
   * It supports uploading additional files associated with the activity.
   *
   * Allows all roles to access this endpoint, with ownership verification via the OwnTicketGuard and OwnActivityTicketGuard.
   */
  @Patch(':ticketId/activity/:activityId')
  @ApiConsumes('multipart/form-data')
  @UseGuards(OwnTicketGuard, OwnActivityTicketGuard)
  @ApiOkResponseWrapper(TicketResponse, { isArray: false })
  @UploadInterceptor({ type: 'multiple', fieldName: 'files' })
  async updateActivity(
    @Param('ticketId') ticketId: string,
    @Param('activityId') activityId: string,
    @UploadedFiles(FilesValidationPipe) files: Array<Express.Multer.File>,
    @Body(ActivityTicketPipe) activityDto: ActivityDto,
  ): Promise<TicketDocument> {
    if (files && files.length > 0) {
      activityDto.content.urls = activityDto.content.urls || [];

      for (const file of files) {
        const folder = `${activityDto.contractorId}/tickets/${ticketId}/activity`;

        const fileUrl = await this.storageService.saveFile(
          file,
          folder,
          'local',
        );

        activityDto.content.urls.push(fileUrl);
      }
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

  /**
   * Delete a file from an activity in a ticket
   *
   * @remarks
   * This endpoint allows users to delete a specific file associated with an activity in a ticket.
   *
   * Allows all roles to access this endpoint, with ownership verification via the OwnTicketGuard and OwnActivityTicketGuard.
   */
  @Delete(':ticketId/activity/:activityId/delete-file')
  @AllRoles()
  @ApiNoContentResponseWrapper()
  @HttpCode(HttpStatus.NO_CONTENT)
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

    await this.storageService.deleteFile(fileUrl, 'local');

    return updatedTicket;
  }

  /**
   * Delete an activity from a ticket
   *
   * @remarks
   * This endpoint allows users to delete an entire activity entry from a specific ticket.
   *
   * Allows all roles to access this endpoint, with ownership verification via the OwnTicketGuard and OwnActivityTicketGuard.
   */
  @Delete(':ticketId/activity/:activityId')
  @AllRoles()
  @ApiNoContentResponseWrapper()
  @HttpCode(HttpStatus.NO_CONTENT)
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
        await Promise.all(
          urls.map((url) => this.storageService.deleteFile(url, 'local')),
        );
      }
    }

    return await this.ticketsService.findOneById(ticketId);
  }
}
