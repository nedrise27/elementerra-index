import { BadRequestException } from '@nestjs/common';
import * as _ from 'lodash';

export function getLimitOffsetFromPagination(
  page?: number,
  size?: number,
  maxSize = 100,
): { limit: number; offset: number } {
  if (!_.isNil(page) && page < 1) {
    throw new BadRequestException('Parameter "page" must be more than 0');
  }

  const p = page || 1;
  const limit = _.min([size, maxSize]);
  const offset = (p - 1) * limit;

  return { limit, offset };
}
