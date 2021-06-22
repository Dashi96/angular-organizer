import {Component, OnInit} from '@angular/core'
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit{
  home: boolean = false
  about: boolean = false

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        if (e.url === '/about') {
          this.about = true
          this.home = false
        } else if (e.url === '/') {
          this.home = true
          this.about = false
        }
      }
    })
  }
}
