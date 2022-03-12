import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';

export type DefaultRoute = {
  message: string;
  timestamp: string;
};

@Injectable()
export class AppService {
  default(): DefaultRoute {
    return {
      message: 'API Teleconsulta',
      timestamp: dayjs().toISOString(),
    };
  }
}
