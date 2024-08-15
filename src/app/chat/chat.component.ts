import { Component, OnInit } from '@angular/core';
import { ChatService, ChatMessage, Notification } from '../chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  messages: ChatMessage[] = [];
  notifications: Notification[] = [];
  newMessage: string = '';
  username: string = '';
  userId: string = '';
  roomId: string = '';

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.getMessages().subscribe((message: ChatMessage) => {
      this.messages.push(message);
    });

    this.chatService.getNotifications().subscribe((notify: Notification) => {
      this.notifications.push(notify);
    });

    this.chatService.getAllNotify().subscribe((notify: any) => {
      console.log("notify", notify);
    })
  }

  createUser() {
    this.chatService.createUser(this.username).subscribe(
      (response) => {
        this.userId = response.id;
        this.joinChat();
      },
      (error) => console.error('Error creating user:', error)
    );
  }

  notifyAllUser() {
    this.chatService.sendNotiAllUser(this.username).subscribe(
      (response) => {
        console.log("res", response);
      },
      (error) => console.error('Error creating user:', error)
    );
  }

  joinChat() {
    this.chatService.joinChat(this.userId).subscribe(
      (response) => console.log('Joined chat:', response),
      (error) => console.error('Error joining chat:', error)
    );
  }

  joinRoom() {
    this.chatService.joinRoom(this.roomId).subscribe(
      (response) => console.log('Joined room:', response),
      (error) => console.error('Error joining room:', error)
    );
  }

  leaveRoom() {
    this.chatService.leaveRoom().subscribe(
      (response) => console.log('Left room:', response),
      (error) => console.error('Error leaving room:', error)
    );
  }

  sendMessage() {
    if (this.newMessage.trim() !== '') {
      this.chatService.sendMessage(this.newMessage);
      this.newMessage = '';
    }
  }

  sendNotify() {
    this.chatService.sendNoti('Alo').subscribe((value) => {
      console.log("value", value);
    })
  }
}
