import {Component} from '@angular/core';
import {GameDataService} from '../game-data.service';
import {Game} from '../game';
import {interval, Observable} from 'rxjs/index';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent {
  games: Map<string, Game> = new Map();
  ongoing: Game;
  countdown: string;
  previous: Game;
  inProgress: boolean;
  gameNames: Object = {
    rocket_league: 'Rocket League',
    fifa_pl: 'Fifa 18',
    miseczka_e: 'Dead or Alive 5: Last Round',
    obliteracers: 'Obliteracers'
  };
  private counter$: Observable<number>;

  constructor(private gameDataService: GameDataService) {
    gameDataService.games.subscribe(game => {
      console.log('StatusComponent', game);
      switch (game.eventType) {
        case 'GAME_ADDED':
          this.games.set(game.gameId, game);
          console.log('event: ', 'GAME_ADDED ' + this.games.size);
          break;
        case 'GAME_STARTED':
          this.ongoing = game;
          this.games.delete(game.gameId);
          this.inProgress = true;
          this.startTimer();
          console.log('event: ', 'GAME_STARTED');
          break;
        case 'GAME_FINISHED':
          this.previous = game;
          if (this.ongoing && (this.ongoing.gameId === game.gameId)) {
            this.ongoing = null;
            this.inProgress = false;
          }
          console.log('event: ', 'GAME_FINISHED');
          break;
        default:
          console.log('default: ', game);
      }
    },
      e => console.log('Error', e),
      () => console.log('Connection closed.'));
  }

  startTimer() {
    this.counter$ = interval(1000).pipe(
      map(() => {
        return this.ongoing ? Math.floor((new Date(this.ongoing.timeoutDate).getTime() - new Date().getTime()) / 1000) : 0;
      })
    );
    this.counter$.subscribe((x) => {
      x = x < 0 ? 0 : x;
      this.countdown = ('0' + Math.floor(x / 60)).slice(-2) + ':' + ('0' + x % 60).slice(-2);
    });
  }

  getGames()  {
    return Array.from(this.games.values());
  }

  getETA(game)  {
    return this.ongoing ? new Date(this.ongoing.startDate).getTime() + (this.games.size * 17 * 60000) : new Date();
  }
}
