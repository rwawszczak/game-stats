import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import ReconnectingWebSocket from 'reconnecting-websocket';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private subject: Subject<MessageEvent>;

  constructor() {
  }


  public connect(url): Subject<MessageEvent> {
    if (!this.subject) {
      console.log('Connecting to: ' + url);
      this.subject = this.create(url);
    }
    return this.subject;
  }

  private create(url): Subject<MessageEvent> {
    const ws = new ReconnectingWebSocket(url);
    const subject = new Subject<MessageEvent>();
    ws.addEventListener('message', function(event) {
      console.log('WebsocketService', JSON.parse(event.data));
      subject.next(event);
    });
    ws.addEventListener('close', function(event) {
      ws.reconnect(1, 'Keep alive.');
    });
    ws.addEventListener('open', function(event) {
      console.log('Connection opened/reopened.');
    });
    ws.addEventListener('error', function(event) {
      console.log('Error', event);
    });

    return subject;
  }
}
