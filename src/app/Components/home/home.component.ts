import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { SharedService } from 'src/app/shared.service';


@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
	public stateData: any
	constructor(private _appData: AppComponent, private themesService: SharedService) {}
	darkMode = false;
	confirmedCases = 0
	activeCases = 0
	recovered = 0
	deaths = 0

	findConfirmedCases () {
		let sum = 0
		for (let i = 0; i < 37; i++) {
			sum = sum + this.stateData[Object.keys(this.stateData)[i]]["total"]["confirmed"]
		}
		this.confirmedCases = sum/2
	}
	findTotalDeaths () {
		let sum = 0
		for (let i = 0; i < 37; i++) {
			sum = sum + this.stateData[Object.keys(this.stateData)[i]]["total"]["deceased"]
		}
		this.deaths = sum/2
	}
	findRecovered () {
		let sum = 0
		for (let i = 0; i < 37; i++) {
			sum = sum + this.stateData[Object.keys(this.stateData)[i]]["total"]["recovered"]
		}
		this.recovered = sum/2
	}
	findActiveCases () {
		let sum = 0
		for (let i = 0; i < 37; i++) {
			if (this.stateData[Object.keys(this.stateData)[i]]["total"]["other"] == undefined) {
				sum = sum
			}
			else {
				sum += this.stateData[Object.keys(this.stateData)[i]]["total"]["other"]
			}
		}
		this.activeCases = this.confirmedCases - this.deaths - this.recovered - sum/2
	}
	ngOnInit() {
		this._appData.getData()
			.subscribe(data => {
				this.stateData = data
				// console.log(this.stateData[Object.keys(this.stateData)[0]]["total"]["other"])
				// console.log(Object.keys(this.stateData).length)
				// console.log(this.findTotalCases())

				this.findConfirmedCases()
				this.findRecovered()
				this.findTotalDeaths()
				this.findActiveCases()
				
			})

		this.themesService.mode.subscribe(data => this.darkMode = data)

	}

}
