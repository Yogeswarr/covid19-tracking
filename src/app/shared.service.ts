import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private modeSource = new BehaviorSubject<boolean>(true);
  mode = this.modeSource.asObservable()

  constructor() { }

  setMode(data: boolean) {
    this.modeSource.next(data)
    // this.mode = data
  }
}
