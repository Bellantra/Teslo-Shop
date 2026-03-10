import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interfaces';

@WebSocketGateway({ cors: true,serveClient:true })
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server

  constructor(private readonly messageWsService: MessageWsService,
     private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket, ...args: any[]): Promise<void> {
    const token = client.handshake.headers.authentication as string;
    
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token);
      await this.messageWsService.registerClient(client, payload.id);
    }catch (error) {
      client.disconnect();
      return;
    }

   this.wss.emit('clients-updated', this.messageWsService.getConnectedClients());
  }

  handleDisconnect(client: Socket): void {
  this.messageWsService.removeClient(client.id);
  this.wss.emit('clients-updated', this.messageWsService.getConnectedClients());
  }

  @SubscribeMessage('message-from-client')
  OnMessageFromClient(client: Socket, payload: NewMessageDto): void {
   
    //! Emite solo al cliente que envió el mensaje
    // client.emit('message-from-server', {
    //   fullName: 'Soy Yo!',
    //   message: payload.message || 'no message',
    // });

    //! Emite a todos los clientes conectados excepto al que envió el mensaje
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Soy Yo!',
    //   message: payload.message || 'no message',
    // });

    //! Emite a todos los clientes conectados
    this.wss.emit('message-from-server', {
      fullName:this.messageWsService.getUserFullName(client.id),
      message: payload.message || 'no message',
    });
  }
}
