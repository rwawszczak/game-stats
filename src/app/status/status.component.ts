import {Component, OnInit} from '@angular/core';
import {GameDataService} from '../game-data.service';
import {Game} from '../game';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {
  games: Map<string, Game> = new Map();
  ongoing: Game;
  previous: Game;
  inProgress: boolean;
  gameNames: Object = {
    rocket_league: 'Rocket League',
    fifa_pl: 'Fifa 18',
    miseczka_e: 'Dead or Alive 5: Last Round',
    obliteracers: 'Obliteracers'
  };

  constructor(private gameDataService: GameDataService) {
    gameDataService.games.subscribe(game => {
      switch (game.eventType) {
        case 'GAME_ADDED':
          // this.games[game.gameId] = game;
          this.games.set(game.gameId, game);
          console.log('event: ', 'GAME_ADDED ' + this.games.size);
          break;
        case 'GAME_STARTED':
          this.ongoing = game;
          // delete this.games[game.gameId];
          this.games.delete(game.gameId)
          this.inProgress = true;
          console.log('event: ', 'GAME_STARTED');
          break;
        case 'GAME_FINISHED':
          this.previous = game;
          if (this.ongoing.gameId === game.gameId) {
            this.ongoing = null;
            this.inProgress = false;
          }
          console.log('event: ', 'GAME_FINISHED');
          break;
        default:
          console.log('default: ', game);
      }
    });
  }

  getGames()  {
    return Array.from(this.games.values());
  }

  ngOnInit() {

  }
}
