import { Logger } from '@nestjs/common';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Server } from 'ws';

@WebSocketGateway({transport: ['websocket'], secure: false})
export class SocketGateway implements OnGatewayInit {


  private logger: Logger = new Logger('SocketEventsGateway');
  private summaryClient: number = 0;

  public afterInit(server: Server) {
    this.logger.log(`WebSocket Initialized total: ${this.summaryClient}`)
  }

  handleConnection(client: WebSocket, ...args:any[]){
    this.summaryClient++;
    this.logger.log(`==Client connected total: ${this.summaryClient}==`)
  }

  handleDisconnected(client: WebSocket){
    this.summaryClient--;
    this.logger.log(`==Client connected total: ${this.summaryClient}==`)
  }


  @SubscribeMessage('message')
  public handleMessage(client: WebSocket, payload: any): string {
    return 'Hello world!';
  }
}