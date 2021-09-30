import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared.service';
import { ActivatedRoute } from "@angular/router"
@Component({
  selector: 'app-state-page',
  templateUrl: './state-page.component.html',
  styleUrls: ['./state-page.component.scss']
})
export class StatePageComponent implements OnInit {

  darkMode = false;
  stateName: string = ""
  constructor(private themesService: SharedService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.themesService.mode.subscribe(data => this.darkMode = data)
    this.route.params.subscribe(params => this.stateName = params.id)
  }

}
