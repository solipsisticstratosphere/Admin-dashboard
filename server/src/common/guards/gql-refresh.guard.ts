import { Injectable, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";

@Injectable()
export class GqlRefreshGuard extends AuthGuard("jwt-refresh") {
  getRequest(context: ExecutionContext): Request {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
