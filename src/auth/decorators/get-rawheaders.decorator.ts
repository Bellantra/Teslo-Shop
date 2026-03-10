import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";


export const GetRawHeaders = createParamDecorator(
    (data:unknown,ctx: ExecutionContext)=>{
        
        const request = ctx.switchToHttp().getRequest();

        if(!request.rawHeaders) throw new InternalServerErrorException('Raw headers not found in the request');


        return request.rawHeaders;
    }


)