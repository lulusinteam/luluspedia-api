import fileConfig from '../modules/files/config/file.config';
import {
  FileConfig,
  FileDriver,
} from '../modules/files/config/file-config.type';
import appConfig from '../config/app.config';
import { AppConfig } from '../config/app-config.type';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const getFileUrl = (path: string | null | undefined): any => {
  if (!path) return null;
  if (path.indexOf('http') === 0) return path;

  const config = fileConfig() as FileConfig;

  if (config.driver === FileDriver.LOCAL) {
    const backend = (appConfig() as AppConfig).backendDomain;
    return backend + (path.startsWith('/') ? '' : '/') + path;
  } else if (config.driver === FileDriver.S3_PRESIGNED) {
    const s3 = new S3Client({
      region: config.awsS3Region ?? '',
      credentials: {
        accessKeyId: config.accessKeyId ?? '',
        secretAccessKey: config.secretAccessKey ?? '',
      },
    });

    const command = new GetObjectCommand({
      Bucket: config.awsDefaultS3Bucket ?? '',
      Key: path,
    });

    return getSignedUrl(s3, command, { expiresIn: 3600 });
  } else if (config.driver === FileDriver.S3) {
    return `https://${config.awsDefaultS3Bucket}.s3.${config.awsS3Region}.amazonaws.com/${path}`;
  }

  return path;
};
