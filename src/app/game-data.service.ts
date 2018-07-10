import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {WebsocketService} from './websocket.service';
import {Game} from './game';
import {map} from 'rxjs/operators';


const URL = 'ws://soccero-locker.playroom.leanforge.pl/games';


@Injectable({
  providedIn: 'root'
})

export class GameDataService {
  public games: Subject<Game>;

  constructor(private wsService: WebsocketService) {
    this.games = <Subject<Game>>wsService.connect(URL)
      .pipe(
        map((response: MessageEvent): Game => {
          console.log('GameDataService', JSON.parse(response.data));
          const data = JSON.parse(response.data);
          return data;
        })
      );
  }

}
