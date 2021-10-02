import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';
import { select } from 'd3';

@Component({
	selector: 'app-bar-graph',
	templateUrl: './bar-graph.component.html',
	styleUrls: ['./bar-graph.component.scss'],
})
export class BarGraphComponent implements OnInit {
	constructor() {}
	@Input('data') data: any
	changeNumberFormat(number: number, decimals: number, recursiveCall: boolean) {
		const decimalPoints = decimals || 0;
		const noOfLakhs = number / 100000;
		let displayStr;
		let isPlural;
	
		// Rounds off digits to decimalPoints decimal places
		function roundOf(integer: any) {
			return +integer.toLocaleString(undefined, {
				minimumFractionDigits: decimalPoints,
				maximumFractionDigits: decimalPoints,
			});
		}
	
		if (noOfLakhs >= 1 && noOfLakhs <= 99) {
			const lakhs = roundOf(noOfLakhs);
			isPlural = lakhs > 1 && !recursiveCall;
			displayStr = `${lakhs} Lk`;
		} else if (noOfLakhs >= 100) {
			const crores = roundOf(noOfLakhs / 100);
			let crorePrefix: any = crores >= 100000 ? this.changeNumberFormat(crores, decimals, true) : crores;
			isPlural = crores > 1 && !recursiveCall;
			displayStr = `${crorePrefix} Cr`;
		} else {
			displayStr = roundOf(+number);
		}
	
		return displayStr;
	}

	ngOnInit(): void {
		let dataBar = [
			{
				"type": "1st Dose",
				"value": this.data["total"]["vaccinated1"]
			},
			{
				"type": "2nd Dose",
				"value": this.data["total"]["vaccinated2"]
			},
			{
				"type": "Population",
				"value": this.data["meta"]["population"]
			}
		]
		
		let val = this.data["meta"]["population"]
		let svg = d3.select("#bar-graph")
			.attr("preserveAspectRatio", "xMinYMin meet")
			.attr("viewBox", "0 0 600 130")
			.classed("svg-content", true);
		let group = svg.selectAll("g")
			.data(dataBar)
			.enter()
			.append("g")
			.attr("transform", "translate(-10, 25)")
		group
			.append("rect")
			.attr("class", "bar")
			.attr("height", "25")
			.transition()
			.ease(d3.easeSinOut)
			.duration(500)
			.attr("width", (d:any, i) => {
				return d["value"] * (450/val)
			})
			.attr("x", 20)
			.attr("y", (d, i: any) => {
				return i*30
			})
			.attr("fill", (d, i) => {
				switch (i) {
					case 0:
						return "#f2af94";
					case 1:
						return "#c7582c	";
					case 2:
						return "#a32f02";
				
					default:
						break;
				}
				return "green"
			})
			.attr("rx", 7)
			.attr("ry", 7)
		group.append("text")
			.attr("class", "bar_text")
			.text((d: any, i) => {
				return (d["type"] + ': ' + this.changeNumberFormat(d["value"], 0, false) )
			})
			.style("fill", "#8b939b")
			.attr("x", (d:any, i) => {
				return d["value"] * (450/val) + 20
			})
			.attr("y", (d, i:any) => {
				return (i + 0.6)*30
			})
		group.append("title")
			.text((d:any, i) => {
				return d["value"].toLocaleString()
			})
	}	
}
