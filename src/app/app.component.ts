import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StateData } from './StateData';
import { Observable } from 'rxjs';
import { MAIN_URL } from 'src/Constants';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'covid-tracking-app';
  
  posts: any
  constructor (private http: HttpClient) {}
  getData(): Observable<StateData[]> {
    return this.posts = this.http.get<StateData[]>(MAIN_URL)
    
  }
}
