import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { log } from 'console';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()                   // implement- berilishi shart bo'lgan qolib
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger: Logger = new Logger(); //req va resni terminalda chiqarib beradi

  public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const recordTime = Date.now();
    const requestType = context.getType<GqlContextType>();
    

    if (requestType === 'http') {
        //Develop if needed!
    } else if (requestType === 'graphql') {
        // (1) print request
        const gqlcontext = GqlExecutionContext.create(context);
                   //terminalda chiqaradi
        this.logger.log(`${this.stringify(gqlcontext.getContext().req.body)}`, 'REQUEST');

        // (2) Errors handing via GraphQl

        // (3) No Errors, giving Response below 
        return next.handle().pipe(
            tap((context) =>  {
              const responseTime = Date.now() - recordTime;
              this.logger.log(`${this.stringify(context)} - ${responseTime}ms \n\n`, 'RESPONSE')
            })
        );
        
    }
    

    
      
  }

  private stringify(context: ExecutionContext): string {
    return JSON.stringify(context).slice(0, 75)
  }
}