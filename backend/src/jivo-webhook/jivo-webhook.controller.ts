import { Body, Controller, Headers, Post, Req } from '@nestjs/common';
import type { Request } from 'express';

import { JivoWebhookService } from './jivo-webhook.service';

@Controller('jivo')
export class JivoWebhookController {
  constructor(private readonly jivoWebhookService: JivoWebhookService) {}

  @Post('webhook')
  async handleWebhook(
    @Req() req: Request,
    @Body() body: unknown,
    @Headers() headers: Record<string, string | string[]>,
  ) {
    const secret = this.extractSecret(req, headers, body);
    await this.jivoWebhookService.handleWebhook(secret, body, headers);
    return { status: 'accepted' };
  }

  private extractSecret(
    req: Request,
    headers: Record<string, string | string[]>,
    body: unknown,
  ): string | undefined {
    const headerSecret = this.getHeader(headers, [
      'x-jivo-signature',
      'x-jivo-secret',
      'x-jivo-token',
    ]);

    if (headerSecret) {
      return headerSecret;
    }

    const querySecret = this.getQueryParam(req, ['secret', 'token']);
    if (querySecret) {
      return querySecret;
    }

    if (body && typeof body === 'object') {
      const token = (body as Record<string, unknown>).token;
      const secret = (body as Record<string, unknown>).secret;
      if (typeof token === 'string') {
        return token;
      }
      if (typeof secret === 'string') {
        return secret;
      }
    }

    return undefined;
  }

  private getHeader(
    headers: Record<string, string | string[]>,
    keys: string[],
  ): string | undefined {
    for (const key of keys) {
      const value = headers[key] ?? headers[key.toLowerCase()];
      if (!value) {
        continue;
      }
      if (Array.isArray(value)) {
        return value[0];
      }
      return value;
    }

    return undefined;
  }

  private getQueryParam(req: Request, keys: string[]): string | undefined {
    for (const key of keys) {
      const value = req.query[key];
      if (!value) {
        continue;
      }
      if (Array.isArray(value)) {
        return value[0];
      }
      if (typeof value === 'string') {
        return value;
      }
    }

    return undefined;
  }
}
