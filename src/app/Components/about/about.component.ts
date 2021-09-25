import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor(private themesService: SharedService) { }

  darkMode = true
  ngOnInit(): void {
    this.themesService.mode.subscribe(data => this.darkMode = data)
  }

}
