import { handleApiRequest } from '../../../backend/app';
import type { Env } from '../../../backend/types/env';

export const onRequest: PagesFunction<Env> = async (context) => {
  return handleApiRequest(context.request, context.env);
};
