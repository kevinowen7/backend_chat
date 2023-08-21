import { Request } from 'express';
import { RequestContext } from 'nestjs-request-context';

export abstract class BaseRequestService {
  req: Request;

  getRequests() {
    return this.req;
  }

  setRequests() {
    if (RequestContext.currentContext) {
      this.req = RequestContext.currentContext.req;
    }
  }
}
