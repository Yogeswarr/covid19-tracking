import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { SharedService } from 'src/app/shared.service';
import { select, json, geoPath, geoMercator, scaleLinear, schemeBlues, schemeGreens } from 'd3'
import { feature } from 'topojson-client'
import * as d3 from 'd3';
import { MAIN_URL } from 'src/Constants';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
	
	public stateData: any
	public stateMap: any
	public stateDataIn: any
	constructor(private _appData: AppComponent, private themesService: SharedService, private http: HttpClient) {}
	darkMode = false;
	confirmedCases = 0
	activeCases = 0
	recovered = 0
	deaths = 0
	colors = scaleLinear<string>()
		.domain([10000, 150000])
		.range(schemeGreens[5])
		
	// colors = scaleLinear()
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
				// console.log(this.stateData[Object.keys(this.stateData)[15]]["districts"])
				this.stateDataIn = this.stateData[Object.keys(this.stateData)[15]]["districts"]
				// console.log(Object.keys(this.stateData)[15])
				// console.log(this.findTotalCases())

				this.findConfirmedCases()
				this.findRecovered()
				this.findTotalDeaths()
				this.findActiveCases()
				
			})

		this.themesService.mode.subscribe(data => this.darkMode = data)
		

		let svg = select('#map')
		
		let g = svg.append('g');
		// g.attr('class', 'map');

		json('../../../assets/maps/karnataka.json')
			.then((data: any) => {
				let districts = feature(data, data.objects.districts)
				this.stateMap = districts
				let projection = geoMercator().fitSize([400, 400], districts);
				let path = geoPath()
					.projection(projection);
				
				let values: Array<number> = []
				
				// console.log(this.stateMap[Object.keys(this.stateMap)[1]][0]["properties"]["district"])
				// console.log(this.stateMap[Object.keys(this.stateMap)[1]]);
				
				// json(MAIN_URL)
				// 	.then((data: any) => {
				// 		dataIN = data["KA"]["districts"]
				// 		console.log(dataIN)

				// 		Object.keys(dataIN).map(i => {
				// 			// console.log(dataIN[i]["total"]["confirmed"])
				// 			values.push(dataIN[i]["total"]["confirmed"])
				// 		})
				// 	})
				g.selectAll('path')
					.data(this.stateMap[Object.keys(this.stateMap)[1]])
					.enter()
					.append("path")
					.attr("class", "district")
					
					.attr("stroke", "red")
					.attr("d", (district: any) => path(district))
					// .attr("fill", (d: any) => )
					.attr("fill", (d: any) => {
						let value;
						// console.log(this.stateData["KA"])
						Object.keys(this.stateData["KA"]["districts"]).find(i => {
							if (i === d["properties"]["district"]) {
								// console.log(i, this.stateData["KA"]["districts"][i]["total"]["confirmed"])
								value = this.stateData["KA"]["districts"][i]["total"]["confirmed"]
							}
						})
						if (value) {
							return this.colors(value)
						}
						return "#ccc"
					})
					.append("title")
					.text((i: any) => {
						return ( i["properties"]["district"] + ':\n' + this.stateData["KA"]["districts"][i["properties"]["district"]]["total"]["confirmed"])
					})

					
			})
	}

}
