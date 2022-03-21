import {
  PipeTransform,
  Injectable,
  //ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException([
        {
          property: 'params id',
          constraints: {
            isNotNumber: 'id should be a number',
          },
        },
      ]);
    }
    return val;
  }
}
