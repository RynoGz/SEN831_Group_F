import { WorkflowError } from './service.js';
export function failure(error) {
  return Response.json({
    error: error instanceof WorkflowError ? error.message : 'The service is temporarily unavailable.'
  }, {
    status: error instanceof WorkflowError ? error.status : 503
  });
}
export function sameOrigin(request) {
  let origin;
  try {
    origin = new URL(request.headers.get('origin'));
  } catch {
    throw new WorkflowError('The request origin is not permitted.', 403);
  }
  const url = new URL(request.url);
  // Next's internal request URL can use localhost; Host retains the public authority.
  const host = request.headers.get('host') ?? url.host;
  if (origin.host !== host || origin.protocol !== url.protocol) throw new WorkflowError('The request origin is not permitted.', 403);
}
