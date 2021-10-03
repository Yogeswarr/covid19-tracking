import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { SharedService } from 'src/app/shared.service';
import { select, json, geoPath, geoMercator} from 'd3'
import { feature } from 'topojson-client'
import * as d3 from 'd3';
import { colorScheme, STATE_CODES } from 'src/Constants';
import { timer } from 'rxjs';
import { Router } from '@angular/router';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
	public stateData: any
	public indiaMap: any
	public stateDataIn: any
	public screenWidth: any;  
  	public screenHeight: any; 
	public dataShown = "confirmed"
	public stateName = "KA"
	public searchInput:string = ""
	// public searchResult: Array<Object> = []  
	public searchResult: any = []  
	public searchData: any
	constructor(private _appData: AppComponent, private themesService: SharedService, private router: Router) {}
	darkMode = false;
	confirmedCases = 0
	activeCases = 0
	recovered = 0
	deaths = 0
	dateTime!: Date
	colors: any
	selected: boolean = false
	render () {
		let svg = select("#india_map")
			.attr("preserveAspectRatio", "xMinYMin meet")
			.attr("viewBox", "0 0 580 680")
			.classed("svg-content", true);
		
		// svg.remove()
		let g = svg.append('g')
		
		json("../../../assets/maps/india1.json")
			.then((data: any) => {
				let states = feature(data, data.objects.states)
				this.indiaMap = states
				let projection = geoMercator().fitSize([500, 700], states)

				let path = geoPath()
					.projection(projection)
				
				g.selectAll("path")
					.data(this.indiaMap[Object.keys(this.indiaMap)[1]])
					.enter()
					.append("path")
					.attr("class", "state")
					.attr("stroke", "white")
					.attr("stroke-width", 1.5)
					.attr("d", (state: any) => path(state))
					.attr("fill", (s: any) => {
						let value
						Object.keys(this.stateData).find(i => {
							if (i === s["id"]) {
								
								if(this.dataShown == "active")
								{
									if(this.stateData[i]["total"]["other"] == undefined) {
										value = this.stateData[i]["total"]["confirmed"] - this.stateData[i]["total"]["recovered"] - this.stateData[i]["total"]["deceased"]
									}
									else{
										value = this.stateData[i]["total"]["confirmed"] - this.stateData[i]["total"]["recovered"] - this.stateData[i]["total"]["deceased"] - this.stateData[i]["total"]["other"]
									}
								}
								else {
									value = this.stateData[i]["total"][this.dataShown]
								}
							}
						})
						if (value) {
							
							return this.colors(value)
						}
							return "#ccc"
					})
					.on("mouseover", (d, i: any) => {
						let stateName = i["properties"]["st_nm"].length > 16 ? i["properties"]["st_nm"].slice(0, 16) + '..' : i["properties"]["st_nm"]
						let val = this.dataShown == "active" ? this.stateData[i["id"]]["total"]["confirmed"] - this.stateData[i["id"]]["total"]["recovered"] - this.stateData[i["id"]]["total"]["deceased"] - (this.stateData[i["id"]]["total"]["other"] == undefined ? 0 : this.stateData[i["id"]]["total"]["other"]) : this.stateData[i["id"]]["total"][this.dataShown]
						d3.selectAll('.state')
							.attr("opacity", 0.3)
							select(d["path"][0])
							.attr("opacity", 1)
						select(".home__stateInfo")
							.transition()
							.style("opacity", 1)
						select(".home__stateName")
							.text(stateName)
						select(".home__statType")
							.text((this.dataShown == 'deceased' ? 'deaths' : this.dataShown).toUpperCase() + ": " + val.toLocaleString('en-IN'))
						
					})
					.on("mouseout", function(d) {
						d3.selectAll('.state')
						.attr("opacity", 1)
						select(".home__stateInfo")
						.transition()
						.style("opacity", 0)
					})
					.on("click", (d, i:any) => {
						this.router.navigate([`/state/${i["id"]}`])
					})
					.append("title")
					.text((i: any) => {
						
						let val = this.dataShown == "active" ? this.stateData[i["id"]]["total"]["confirmed"] - this.stateData[i["id"]]["total"]["recovered"] - this.stateData[i["id"]]["total"]["deceased"] - (this.stateData[i["id"]]["total"]["other"] == undefined ? 0 : this.stateData[i["id"]]["total"]["other"]) : this.stateData[i["id"]]["total"][this.dataShown]
						return ( i["properties"]["st_nm"] + ':\n' + val.toLocaleString('en-IN'))
					})	
			})
	}
	changeData (type: string) {
		this.dataShown = type
		this.colors = colorScheme(this.dataShown, this.stateData)
		let svg = select("#india_map")
		let s = svg.selectAll('g')
		s.transition().remove()
		this.render()
	}
	fetchSeries (event: any) {
		if (event.target.value === '') {
		  return this.searchResult = [];
		}
		json("../../../assets/maps/maps.json")
			.then(data => {
				this.searchData = data

				Object.keys(STATE_CODES).map((i: any) => {
					if (event.target.value.length > 0) {
						if (i.toLowerCase().startsWith(event.target.value.toLowerCase())) {
							// console.log(STATE_CODES[i])
	
							this.searchResult.push({name: i, code: STATE_CODES[i]});
						}
					}
					else {
						this.searchResult = []
						
					}
				})
		})

		let drop = select(".searchDrop")
		if(this.searchInput.length > 0 && this.selected == true) {
			drop.style("opacity", 1)
			drop.style("display", "block")

		}
		else {
			drop.style("opacity", 0)
			drop.style("display", "none")
		}
		return this.searchResult = [];
	}
	routeToState (state: string) {
		this.router.navigate([`/state/${state}`])
	}
	ngOnInit() {
		
		timer(0, 100).subscribe(() => {
			this.dateTime = new Date()
			
		})
		this._appData.getData()
			.subscribe(data => {
				this.stateData = data
				this.confirmedCases = this.stateData["TT"]["total"]["confirmed"]
				this.recovered = this.stateData["TT"]["total"]["recovered"]
				this.deaths = this.stateData["TT"]["total"]["deceased"]
				this.activeCases = this.confirmedCases - this.recovered - this.deaths - this.stateData["TT"]["total"]["other"]
				this.colors = colorScheme(this.dataShown, this.stateData)
				
			})

		this.themesService.mode.subscribe(data => this.darkMode = data)
		this.render()
		// console.log(STATE_CODES)
	}
	
}

