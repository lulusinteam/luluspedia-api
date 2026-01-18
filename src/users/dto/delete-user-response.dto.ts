import { ApiProperty } from '@nestjs/swagger';
import databaseConfig from '../../database/config/database.config';
import { DatabaseConfig } from '../../database/config/database-config.type';

const idType = (databaseConfig() as DatabaseConfig).isDocumentDatabase
  ? String
  : Number;

export class DeleteUserResponseDto {
  @ApiProperty({
    type: idType,
    example: (databaseConfig() as DatabaseConfig).isDocumentDatabase
      ? '65f1a1ab2f1c9b0012d5abcd'
      : 1,
  })
  id: string | number;
}
