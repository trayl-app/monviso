import {
  DocumentBuilder,
  OpenAPIObject,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
import { GLOBAL_PREFIX } from '../../../constants';

export class SwaggerConfig {
  static get documentConfig(): Omit<OpenAPIObject, 'paths'> {
    return new DocumentBuilder()
      .setTitle('Monviso')
      .setDescription(
        'The following documentation describes Monviso, the user and profile management service of the Trayl application.',
      )
      .setVersion(process.env.npm_package_version)
      .setLicense('MIT', 'https://opensource.org/licenses/MIT')
      .addBearerAuth()
      .build();
  }

  static get documentOptions(): SwaggerDocumentOptions {
    return {
      deepScanRoutes: true,
    };
  }

  static get customOptions(): SwaggerCustomOptions {
    return {
      customSiteTitle: 'Monviso API Documentation',
    };
  }

  static get path(): string {
    return GLOBAL_PREFIX;
  }
}
