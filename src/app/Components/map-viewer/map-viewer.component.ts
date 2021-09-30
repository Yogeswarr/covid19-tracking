import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';
import { scaleLinear, schemeReds, select } from 'd3';
import { json } from 'd3-fetch';
import { geoMercator, geoPath } from 'd3-geo';
import { AppComponent } from 'src/app/app.component';
import { feature } from 'topojson-client';

@Component({
  selector: 'app-map-viewer',
  templateUrl: './map-viewer.component.html',
  styleUrls: ['./map-viewer.component.scss']
})
export class MapViewerComponent implements OnInit {
  
  public stateData: any
  @Input('stateName') stateName!: string;
  @Input('whichStats') whichStats!: string;
  
  constructor(private _appData: AppComponent) { }
  public stateMap: any
  colors = scaleLinear<string>()
		.domain([10000, 150000])
		.range(schemeReds[3])
  ngOnInit(): void {
	this._appData.getData()
		.subscribe(data => {
			this.stateData = data
	})
	let svg = select('#map')
		.attr("preserveAspectRatio", "xMinYMin meet")
		.attr("viewBox", "0 0 700 900")
		.classed("svg-content", true);
		
	let g = svg.append('g');

	json('../../../assets/maps/karnataka.json')
		.then((data: any) => {
			let districts = feature(data, data.objects.districts)
			this.stateMap = districts
			let projection = geoMercator().fitSize([400, 400], districts);
			let path = geoPath()
				.projection(projection);
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
					Object.keys(this.stateData[this.stateName]["districts"]).find(i => {
						if (i === d["properties"]["district"]) {
							// console.log(i, this.stateData["KA"]["districts"][i]["total"]["confirmed"])
							value = this.stateData[this.stateName]["districts"][i]["total"][this.whichStats]
						}
					})
					if (value) {
						return this.colors(value)
					}
					return "#ccc"
				})
				
				.on("mouseover", function (d) {
					d3.selectAll('.district')
					.attr("opacity", 0.3)
					select(this)
					.attr("opacity", 1)
				})
				.on("mouseout", function(d) {
					d3.selectAll('.district')
					.attr("opacity", 1)
				})
				.append("title")
				.text((i: any) => {
					return ( i["properties"]["district"] + ':\n' + this.stateData[this.stateName]["districts"][i["properties"]["district"]]["total"][this.whichStats].toLocaleString('en-IN') )
				})
				
		})
  }

}
