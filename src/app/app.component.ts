import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StateData } from './StateData';
import { Observable } from 'rxjs';
import { MAIN_URL } from 'src/Constants';
import { RouterOutlet } from '@angular/router';
import { animate, query, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('routeAnimation', [
      transition('* => *', [
        query(':enter', [
          style({
            position: "absolute",
            top: 0,
            width: "100%",
            opacity: 0,
            transform: 'scale(0) translateY(-100%)'
          }),
          animate(500, 
            style({
              opacity: 1,
              transform: 'scale(1) translateY(0)'

            })
          )
        ],{optional: true}),
        
      ])
    ])
  ]
})
export class AppComponent {
  title = 'covid-tracking-app';
  
  posts: any
  constructor (private http: HttpClient) {}
  getData(): Observable<StateData[]> {
    return this.posts = this.http.get<StateData[]>(MAIN_URL)
    
  }

  prepareRoute(outlet: RouterOutlet) {
    if (outlet.isActivated) {
      return outlet.activatedRoute.snapshot.url
    }

    return null
  }
}
