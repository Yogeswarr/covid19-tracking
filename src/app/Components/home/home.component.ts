import { Component, OnInit} from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { SharedService } from 'src/app/shared.service';
import { select, json, geoPath, geoMercator, scaleLinear, schemeBlues, schemeGreens, schemeReds, schemeGreys } from 'd3'
import { feature } from 'topojson-client'
import * as d3 from 'd3';
import { MAIN_URL, findConfirmedCases, findRecoveredCases, findTotalDeaths, findActiveCases } from 'src/Constants';
import { timer } from 'rxjs';

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
	
	constructor(private _appData: AppComponent, private themesService: SharedService) {}
	darkMode = false;
	confirmedCases = 0
	activeCases = 0
	recovered = 0
	deaths = 0
	dateTime!: Date
	colors = scaleLinear<string>()
		.domain([1, 3000000])
		.range(schemeReds[3])
	colors1 = scaleLinear<string>()
		.domain([1, 30000])
		.range(schemeGreens[3])
	
	render () {
		let svg = select("#india_map")
			.attr("preserveAspectRatio", "xMinYMin meet")
			.attr("viewBox", "0 0 580 780")
			.classed("svg-content", true);
		
		// svg.remove()
		let g = svg.append('g');
		
		json("../../../assets/maps/india1.json")
			.then((data: any) => {
				let states = feature(data, data.objects.states)
				this.indiaMap = states
				// console.log(this.indiaMap[Object.keys(this.indiaMap)[1]])
				let projection = geoMercator().fitSize([500, 700], states)

				let path = geoPath()
					.projection(projection)
				
				g.selectAll("path")
					.data(this.indiaMap[Object.keys(this.indiaMap)[1]])
					.enter()
					.append("path")
					.attr("class", "state")
					.attr("stroke", "red")
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
					.append("title")
					.text((i: any) => {
						
						let val = this.dataShown == "active" ? this.stateData[i["id"]]["total"]["confirmed"] - this.stateData[i["id"]]["total"]["recovered"] - this.stateData[i["id"]]["total"]["deceased"] - (this.stateData[i["id"]]["total"]["other"] == undefined ? 0 : this.stateData[i["id"]]["total"]["other"]) : this.stateData[i["id"]]["total"][this.dataShown]
						return ( i["properties"]["st_nm"] + ':\n' + val.toLocaleString('en-IN'))
					})						
			})
	}
	changeData (type: string) {
		this.dataShown = type
		let s = d3.selectAll('g')
		s.remove()
		this.render()
	}	
	
	ngOnInit() {
		
		timer(0, 1000).subscribe(() => {
			this.dateTime = new Date()
		})
		this._appData.getData()
			.subscribe(data => {
				this.stateData = data
				this.confirmedCases = findConfirmedCases(this.stateData)
				this.recovered = findRecoveredCases(this.stateData)
				this.deaths = findTotalDeaths(this.stateData)
				this.activeCases = findActiveCases(this.stateData)
				
			})

		this.themesService.mode.subscribe(data => this.darkMode = data)
		this.render()
	}
	
}

