import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface ChatMessage {
  userId: string;
  username: string;
  message: string;
  roomId: string;
}

export interface Notification {
  userId: string;
  username: string;
  notify: string;
  roomId: string;
}

// Đọc và hiểu thêm các khái niệm Injection này để đi phỏng vấn (vì các ngôn ngữ khác cũng có k)
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket: Socket;
  private currentRoom = new BehaviorSubject<string | null>(null);

  // Polling là gì ?
  constructor(private http: HttpClient) {
    this.socket = io('http://localhost:3000', {
      transports: ['websocket', 'polling'],
    });
  }

  createUser(username: string): Observable<any> {
    return this.http.post('http://localhost:3000/users', { username });
  }

  sendNoti(message: string): Observable<any> {
     return new Observable((observer) => {
      this.socket.emit('sendNoti', message, (response: any) => {
        observer.next(response);
        observer.complete();
      });
    });
  }

  sendNotiAllUser(message: string): Observable<any> {
     return new Observable((observer) => {
      this.socket.emit('sendNotiAllUser', message, (response: any) => {
        observer.next(response);
        observer.complete();
      });
    });
  }

  joinChat(userId: string): Observable<any> {
    return new Observable((observer) => {
      this.socket.emit('join', userId, (response: any) => {
        observer.next(response);
        observer.complete();
      });
    });
  }

  joinRoom(roomId: string): Observable<any> {
    return new Observable((observer) => {
      this.socket.emit('joinRoom', roomId, (response: any) => {
        if (response.status === 'success') {
          this.currentRoom.next(roomId);
        }
        observer.next(response);
        observer.complete();
      });
    });
  }

  leaveRoom(): Observable<any> {
    const roomId = this.currentRoom.value; // Đây là một cách lấy value của behaviour subject!
    if (roomId) {
      return new Observable((observer) => {
        this.socket.emit('leaveRoom', roomId, (response: any) => {
          if (response.status === 'success') {
            this.currentRoom.next(null);
          }
          observer.next(response);
          observer.complete();
        });
      });
    }
    return new Observable((observer) => {
      observer.next({ status: 'error', message: 'Not in a room' });
      observer.complete();
    });
  }
  // Gửi tin nhắn
  sendMessage(message: string): void {
    const roomId = this.currentRoom.value;
    if (roomId) {
      this.socket.emit('chatMessage', { roomId, message });
    }
  }
  // Nhận và hiển thị tin nhắn
  getMessages(): Observable<ChatMessage> {
    return new Observable((observer) => {
      this.socket.on('chatMessage', (message: ChatMessage) => {
        observer.next(message);
      });
    });
  }

    // Nhận và hiển thị tin nhắn
    getNotifications(): Observable<Notification> {
      return new Observable((observer) => {
        this.socket.on('notifications', (notify: Notification) => {
          observer.next(notify);
        });
      });
    }


    getAllNotify(): Observable<any> {
      return new Observable((observer) => {
        this.socket.on('notiAllUser', (notify: any) => {
          observer.next(notify);
        });
      });
    }
}
