import { Injectable } from '@nestjs/common';
import { ApiException } from '../../../../../utils/exceptions/api.exception';
import { FileRepository } from '../../persistence/file.repository';
import { FileType } from '../../../domain/file';

@Injectable()
export class FilesS3Service {
  constructor(private readonly fileRepository: FileRepository) {}

  async create(file: Express.MulterS3.File): Promise<{ file: FileType }> {
    if (!file) {
      throw ApiException.validation({
        file: 'selectFile',
      });
    }

    return {
      file: await this.fileRepository.create({
        path: file.key,
      }),
    };
  }
}
