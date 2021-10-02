import * as d3 from "d3"

export const MAIN_URL = "https://data.covid19india.org/v4/min/data.min.json"
export const TIMESERIES_URL = "https://data.covid19india.org/v4/min/timeseries.min.json"

// export const findConfirmedCases = (data: any) => {
//     let sum = 0;
//     Object.keys(data).map(i => {
//         if (data[i]["total"]["confirmed"] == undefined) {
//             sum = sum
//         }        
//         else {
//             sum += data[i]["total"]["confirmed"]
//         }
//     })
//     return sum/2
// }


// export const findRecoveredCases = (data: any) => {
//     let sum = 0;
//     Object.keys(data).map(i => {
//         if (data[i]["total"]["recovered"] == undefined) {
//             sum = sum
//         }        
//         else {
//             sum += data[i]["total"]["recovered"]
//         }
//     })
//     return sum/2
// }


// export const findTotalDeaths = (data: any) => {
//     let sum = 0;
//     Object.keys(data).map(i => {
//         if (data[i]["total"]["deceased"] == undefined) {
//             sum = sum
//         }        
//         else {
//             sum += data[i]["total"]["deceased"]
//         }
//     })
//     return sum/2
// }

// export const findActiveCases = (data: any) => {
//     let sum = 0;
//     let confirmed = findConfirmedCases(data)
//     let deaths = findTotalDeaths(data)
//     let recoverd = findRecoveredCases(data)
//     Object.keys(data).map(i => {
//         if (data[i]["total"]["other"] == undefined) {
//             sum = sum
//         }        
//         else {
//             sum += data[i]["total"]["other"]
//         }
//     })
//     return confirmed - recoverd - deaths - sum/2
// }

export const colorScheme = (stat: string, data: any) => {

    let max = 0;
    let min = 10000000;
    let colors;
    Object.keys(data).map((i) => {
        if (i == "TT") {
            max = max
            min = min
        }
        else {
            if (stat == "active") {
                let otherVal = data[i]["total"]["other"] == undefined ? 0 : data[i]["total"]["other"]
                if (data[i]["total"]["confirmed"] - data[i]["total"]["recovered"] - data[i]["total"]["deceased"] - otherVal  > max) {
                    max = data[i]["total"]["confirmed"] - data[i]["total"]["recovered"] - data[i]["total"]["deceased"] - otherVal
                }
                else {
                    max = max
                }
                if (data[i]["total"]["confirmed"] - data[i]["total"]["recovered"] - data[i]["total"]["deceased"] - otherVal < min) {
                    min = data[i]["total"]["confirmed"] - data[i]["total"]["recovered"] - data[i]["total"]["deceased"] - otherVal
                }
                else {
                    min = min
                }
            }
            else {
                if (data[i]["total"][stat] > max) {
                    max = data[i]["total"][stat]
                }
                else {
                    max = max
                }
                if (data[i]["total"][stat] < min) {
                    min = data[i]["total"][stat]
                }
                else {
                    min = min
                }
            }
            
        }
        
    })
    switch (stat) {
        case "confirmed":
            colors = d3.scaleLinear<string>()
		    .domain([min, max])
            .range(["#fab1b1", "#9e0000"])
            
            return colors
        case  "deceased":
            colors = d3.scaleLinear<string>()
		    .domain([min, max])
            .range(["#d9d9d9", "#545454"])
            
            return colors
        case "active":
            colors = d3.scaleLinear<string>()
		    .domain([min, max])
            .range(["#d2cffa", "#002ba1"])
            
            return colors
        case "recovered":
            colors = d3.scaleLinear<string>()
            .domain([min, max])
            .range(["#87e68e", "#00940b"])
            
            return colors
        default:
            return colors;
    }
}