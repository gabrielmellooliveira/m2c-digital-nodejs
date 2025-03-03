import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { getApiKeyConfigs } from 'src/configs/api-key.config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKeyRequest = request.headers['x-api-key'];

    const { apiKey } = getApiKeyConfigs();

    if (!apiKeyRequest || apiKeyRequest !== apiKey) {
      throw new UnauthorizedException('Invalid API Key');
    }

    return true;
  }
}
