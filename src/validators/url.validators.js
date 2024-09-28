import { z } from 'zod';

const urlValidator = z.string().url({
    protocol: true,
    hostname: true,
    pathname: true,
    message: 'Invalid URL',
    errorMap: (issue, ctx) => {
      if (issue.code === 'invalid_protocol') {
        return { message: 'Invalid protocol' };
      } else if (issue.code === 'invalid_hostname') {
        return { message: 'Invalid hostname' };
      } else if (issue.code === 'invalid_pathname') {
        return { message: 'Invalid pathname' };
      }
      return { message: 'Invalid URL' };
    },
  });

export default urlValidator;