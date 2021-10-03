import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared.service';
import { ActivatedRoute } from "@angular/router"
import * as d3 from "d3"
import { AppComponent } from 'src/app/app.component';
import { geoMercator, geoPath, scaleLinear, schemeReds, select } from 'd3';
import { json, text } from 'd3-fetch';
import { feature } from 'topojson-client';
import { colorScheme } from 'src/Constants';

@Component({
  selector: 'app-state-page',
  templateUrl: './state-page.component.html',
  styleUrls: ['./state-page.component.scss']
})
export class StatePageComponent implements OnInit {

  darkMode = false;
  stateName: string = ""
  stateData: any
  confirmedCases = 0
	activeCases = 0
	recovered = 0
	deaths = 0
  colors: any
  stateMap: any;
  whichStats: string = "confirmed";
  showName: string = ""
  noInfo: string = ""
  barData: any
  color: string = "#dc3545"
  constructor(private themesService: SharedService, private route: ActivatedRoute, private _appData: AppComponent) { }
  changeData (type: string) {
		this.whichStats = type
		this.colors = colorScheme(this.whichStats, this.stateData[this.stateName]["districts"])
		let svg = select("#state_map")
		let s = svg.selectAll('g')
		s.transition().remove()
    switch (this.whichStats) {
      case "confirmed":
        this.color = "#dc3545"
        break;
      case  "deceased":
        this.color = "#8b939b"
        break;
      case "active":
        this.color = "#007bff"
        break;
      case "recovered":
        this.color = "#28a745"
        break
      default:
          
    }
		this.render()
	}
  render () {
    let svg = select('#state_map')
		.attr("preserveAspectRatio", "xMinYMin meet")
		.attr("viewBox", "0 0 550 400")
		.classed("svg-content", true);
		
    let g = svg.append('g')
      
      
    
    let fileName 
    json("../../../assets/maps/maps.json")
      .then((data: any) => {
        fileName = data[this.stateName]["file"]
        this.showName = data[this.stateName]["stateName"]

      json("../../../assets/maps/" + fileName)
        .then((data: any) => {
          let districts = feature(data, data.objects.districts)
          this.stateMap = districts
          let projection = geoMercator().fitSize([350, 350], districts);
          let path = geoPath()
            .projection(projection);
          let text1 = ""
          g.selectAll('path')
            .data(this.stateMap[Object.keys(this.stateMap)[1]])
            .enter()
            .append("path")
            .attr("class", "district")            
            .attr("stroke", "white")
            .attr("d", (district: any) => path(district))
            .attr("fill", (d: any) => {
              let value;
              Object.keys(this.stateData[this.stateName]["districts"]).find(i => {
                
                if (i === d["properties"]["district"]) {
                  if(this.whichStats == "active")
								  {
                      if(this.stateData[this.stateName]["districts"][i]["total"]["other"] == undefined) {
                        value = this.stateData[this.stateName]["districts"][i]["total"]["confirmed"] - this.stateData[this.stateName]["districts"][i]["total"]["recovered"] - this.stateData[this.stateName]["districts"][i]["total"]["deceased"]
                      }
                      else{
                        value = this.stateData[this.stateName]["districts"][i]["total"]["confirmed"] - this.stateData[this.stateName]["districts"][i]["total"]["recovered"] - this.stateData[this.stateName]["districts"][i]["total"]["deceased"] - this.stateData[this.stateName]["districts"][i]["total"]["other"]
                      }
                    }
                  else {
                    value = this.stateData[this.stateName]["districts"][i]["total"][this.whichStats]
                  }
                }
              })
              if (value) {
                return this.colors(value)
              }
              else {
                if(this.stateName == "AN" || this.stateName == "AS" || this.stateName == "MN") {
                  g.append("text").attr("x", 50).attr("y", 50).text("State's district data not available").style("fill", "grey")

                }
                return "#ccc"
              }
            })
            
            .on("mouseover",  (d: any, i: any) => {
              let val = this.whichStats == "active" ? this.stateData[this.stateName]["districts"][i["properties"]["district"]]["total"]["confirmed"] - this.stateData[this.stateName]["districts"][i["properties"]["district"]]["total"]["recovered"] - this.stateData[this.stateName]["districts"][i["properties"]["district"]]["total"]["deceased"] - (this.stateData[this.stateName]["districts"][i["properties"]["district"]]["total"]["other"] == undefined ? 0 : this.stateData[this.stateName]["districts"][i["properties"]["district"]]["total"]["other"]) : this.stateData[this.stateName]["districts"][i["properties"]["district"]]["total"][this.whichStats]
              d3.selectAll('.district')
                .attr("opacity", 0.3)
              select(d["path"][0])
                .attr("opacity", 1)
              select(".state__info")
							  .transition()
							  .style("opacity", 1)
              select(".state__districtName")
                .text(i["properties"]["district"])
                .style("color", this.color)
              select(".state__districtInfo")
                .style("color", this.color)
                .text((this.whichStats == "deceased" ? "deaths" : this.whichStats).toUpperCase() + ": " + val.toLocaleString())
              select(".fa-caret-right")
                .style("color", this.color)
              })
            .on("mouseout", function(d) {
              d3.selectAll('.district')
              .attr("opacity", 1)
              select(".state__info")
							  .transition()
                .delay(500)
							  .style("opacity", 0)
            })
            .append("title")
            .text((i: any) => {
              let val = this.whichStats == "active" ? this.stateData[this.stateName]["districts"][i["properties"]["district"]]["total"]["confirmed"] - this.stateData[this.stateName]["districts"][i["properties"]["district"]]["total"]["recovered"] - this.stateData[this.stateName]["districts"][i["properties"]["district"]]["total"]["deceased"] - (this.stateData[this.stateName]["districts"][i["properties"]["district"]]["total"]["other"] == undefined ? 0 : this.stateData[this.stateName]["districts"][i["properties"]["district"]]["total"]["other"]) : this.stateData[this.stateName]["districts"][i["properties"]["district"]]["total"][this.whichStats]
              return ( i["properties"]["district"] + ':\n' + val.toLocaleString("en-IN") )
            })
          })  
      })
  }
  ngOnInit(): void {
    this._appData.getData()
      .subscribe(data => {
        this.stateData = data
        this.confirmedCases = this.stateData[this.stateName]["total"]["confirmed"]
        this.recovered = this.stateData[this.stateName]["total"]["recovered"] 
        this.deaths = this.stateData[this.stateName]["total"]["deceased"]
        this.activeCases = this.confirmedCases - this.recovered - this.deaths - (this.stateData[this.stateName]["total"]["other"] == undefined ? 0 : this.stateData[this.stateName]["total"]["other"])
        this.colors = colorScheme(this.whichStats, this.stateData[this.stateName]["districts"])
        this.barData = this.stateData[this.stateName]

        
      })
    this.themesService.mode.subscribe(data => this.darkMode = data)
    this.route.params.subscribe(params => this.stateName = params.id)
    window.scrollTo(0, 0)
    this.render()
  }

}
