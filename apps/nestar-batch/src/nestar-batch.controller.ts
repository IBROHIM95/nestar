import { Controller, Get, Logger } from '@nestjs/common';
import { BatchService } from './nestar-batch.service';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { BATCH_ROLLBACK, BATCH_TOP_AGENTS, BATCH_TOP_PROPERTIES } from '../lib/config';

@Controller()
export class BatchController {
  private logger: Logger = new Logger('BatchController');
  constructor(private readonly batchService: BatchService) {}


  @Timeout(1000)
  handleTimeout() {
    this.logger.debug('Batch server ready')
  }

  @Cron('00 00 01 * * *', {name: BATCH_ROLLBACK})
  public async batchRolback() {
    try{
    this.logger['context'] = BATCH_ROLLBACK;
    this.logger.debug('excuted')
    await this.batchService.batchRolback()
    }catch(err){
      this.logger.error(err)
    }
    
  }
  @Cron('20 00 01 * * *', {name: BATCH_TOP_PROPERTIES})
  public async batchTopProperties() {
    try{
    this.logger['context'] = BATCH_TOP_PROPERTIES;
    this.logger.debug('excuted')
    await this.batchService.batchTopProperties()
    }catch(err){
      this.logger.error(err)
    }
    
  }
  @Cron('40 00 01 * * *', {name: BATCH_TOP_AGENTS})
  public async batchTopAgents() {
    try{
    this.logger['context'] = BATCH_TOP_AGENTS;
    this.logger.debug('excuted')
    await this.batchService.batchTopAgents()
    }catch(err){
      this.logger.error(err)
    }
    
  }

  // @Interval(1000)
  // handlerInterval() {
  //   this.logger.debug('INTERVAL TEST')
  // }
 
  @Get()
  getHello(): Promise<string> {
    return this.batchService.getHello();
  }
}
