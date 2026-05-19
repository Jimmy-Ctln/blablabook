import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class JsonContentTypeGuard implements CanActivate {
  private readonly stateChangingMethods = ['POST', 'PUT', 'PATCH'];

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      method: string;
      headers: Record<string, string | undefined>;
    }>();

    if (!this.stateChangingMethods.includes(request.method)) {
      return true;
    }

    if (request.headers['content-length'] === '0') {
      return true;
    }

    const contentType = request.headers['content-type'] ?? '';
    if (!contentType.toLowerCase().includes('application/json')) {
      throw new BadRequestException(
        'Content-Type must be application/json on state-changing requests',
      );
    }

    return true;
  }
}
