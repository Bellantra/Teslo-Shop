import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Socket } from 'socket.io';

import { User } from '../auth/entities/user.entity';

//Todo aca no admite dos sesiones del mismo usuario. Se puede permitir 
// Todo pero hay que agregar booleanos para desktop y mobile.
interface ConnectedClients {
    [id: string]: {
        socket: Socket;
        user: User;
    //    isMobile: boolean;
    //    isDesktop: boolean;
    }
}

@Injectable()
export class MessageWsService {

    private connectedClients: ConnectedClients = {}

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async registerClient(client: Socket, userId: string) {

        const user = await this.userRepository.findOneBy({ id: userId });
        if(!user) throw new Error('User not found');
        if(!user.isActive) throw new Error('User is not active');
        
        this.checkUserConnection(user)

        this.connectedClients[client.id] = {
            socket: client,
            user,
        };
    }

    removeClient(clientId: string) {
        delete this.connectedClients[clientId];
    }    

    getConnectedClients(): string[] {       
        return Object.keys(this.connectedClients);
    }

    getUserFullName(socketId: string) {
        return this.connectedClients[socketId].user.fullName;
    }

    checkUserConnection(user:User) {
        
        for(const clientId of Object.keys(this.connectedClients)){

            const connectedClient = this.connectedClients[clientId]

            if(connectedClient.user.id === user.id){
                connectedClient.socket.disconnect()
                break
            }
        }
    }

}