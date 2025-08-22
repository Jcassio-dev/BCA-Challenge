import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class UTCTransformationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'body' && value.timestamp) {
      try {
        return {
          ...value,
          timestamp: this.convertToUTC(value.timestamp),
        };
      } catch (error) {
        throw new BadRequestException('Invalid timestamp format');
      }
    }
    return value;
  }

  private convertToUTC(timestamp: string): string {
    const date = new Date(timestamp);

    if (isNaN(date.getTime())) {
      throw new BadRequestException('Invalid timestamp format');
    }

    return new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds(),
        date.getUTCMilliseconds(),
      ),
    ).toISOString();
  }
}
