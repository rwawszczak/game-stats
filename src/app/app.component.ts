import {Component, OnInit} from '@angular/core';
import * as screenfull from 'screenfull';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  title = 'Game Status';
  isFullscreen = false;

  ngOnInit() {
    if (screenfull.enabled) {
      screenfull.on('change', () => {
        this.isFullscreen = screenfull.isFullscreen;
      });
    }
  }

  goFullScreen() {
    if (screenfull.enabled) {
      screenfull.toggle();
    }
  }
}
