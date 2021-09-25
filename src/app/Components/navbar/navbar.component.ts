import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private themesService: SharedService) { }
  belowNav = false;
  darkMode = true;

  // to send theme mode infor to other component

  
  ngOnInit(): void {
    this.themesService.setMode(this.darkMode)
  }
  openNav () {
    this.belowNav = !this.belowNav
  }
  closeNav() {
    this.belowNav  = false
  }
  enableDark () {
    this.darkMode = !this.darkMode
    this.themesService.setMode(this.darkMode)
  }
}
