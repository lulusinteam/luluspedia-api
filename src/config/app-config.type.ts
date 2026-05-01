export type AppConfig = {
  nodeEnv: string;
  name: string;
  workingDirectory: string;
  frontendDomain?: string;
  frontendDomainAdmin?: string;
  backendDomain: string;
  backendDomainAdmin: string;
  port: number;
  adminPort: number;
  apiPrefix: string;
  fallbackLanguage: string;
  headerLanguage: string;
  maxBodySize: string;
};
