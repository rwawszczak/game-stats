import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Game Status';
  private fullScreen = false;

  goFullScreen() {
    this.fullScreen = !this.fullScreen;
    if (this.fullScreen) {
      document.documentElement.webkitRequestFullScreen();
    }
  }

}
