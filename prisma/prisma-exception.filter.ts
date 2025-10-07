import { ExceptionFilter, Catch, ArgumentsHost, ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

// Catches known Prisma database errors globally
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // Handle unique constraint violations (duplicates)
    if (exception.code === 'P2002') {
      response.status(409).json({
        statusCode: 409,
        message: 'Unique constraint failed: this music item already exists',
      });
    } else {
      // Handle all other Prisma-related errors as generic server errors
      response.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
      });
    }
  }
}
