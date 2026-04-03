import { Injectable } from '@nestjs/common';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class NotificationTemplateService {
  private templatesPath: string;

  constructor() {
    this.templatesPath = path.join(__dirname, '..', 'templates');
  }

  render(templateName: string, context: any): string {
    const filePath = path.join(this.templatesPath, `${templateName}.hbs`);

    if (!fs.existsSync(filePath)) {
      console.warn(`Template ${templateName} not found at ${filePath}`);
      return `[Template Error] ${templateName} not found.`;
    }

    const templateContent = fs.readFileSync(filePath, 'utf8');
    const template = handlebars.compile(templateContent);
    return template(context);
  }
}
