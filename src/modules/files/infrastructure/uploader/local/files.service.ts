import { Injectable } from '@nestjs/common';
import { ApiException } from '../../../../../utils/exceptions/api.exception';
import { ConfigService } from '@nestjs/config';

import { FileRepository } from '../../persistence/file.repository';
import { AllConfigType } from '../../../../../config/config.type';
import { FileType } from '../../../domain/file';

@Injectable()
export class FilesLocalService {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly fileRepository: FileRepository,
  ) {}

  async create(file: Express.Multer.File): Promise<{ file: FileType }> {
    if (!file) {
      throw ApiException.validation({
        file: 'selectFile',
      });
    }

    return {
      file: await this.fileRepository.create({
        path: `/${this.configService.get('app.apiPrefix', {
          infer: true,
        })}/v1/${file.path.replace(/\\/g, '/')}`,
      }),
    };
  }
}
