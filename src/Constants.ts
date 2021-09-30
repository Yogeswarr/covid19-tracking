export const MAIN_URL = "https://data.covid19india.org/v4/min/data.min.json"
export const TIMESERIES_URL = "https://data.covid19india.org/v4/min/timeseries.min.json"

export const findConfirmedCases = (data: any) => {
    let sum = 0;
    Object.keys(data).map(i => {
        if (data[i]["total"]["confirmed"] == undefined) {
            sum = sum
        }        
        else {
            sum += data[i]["total"]["confirmed"]
        }
    })
    return sum/2
}


export const findRecoveredCases = (data: any) => {
    let sum = 0;
    Object.keys(data).map(i => {
        if (data[i]["total"]["recovered"] == undefined) {
            sum = sum
        }        
        else {
            sum += data[i]["total"]["recovered"]
        }
    })
    return sum/2
}


export const findTotalDeaths = (data: any) => {
    let sum = 0;
    Object.keys(data).map(i => {
        if (data[i]["total"]["deceased"] == undefined) {
            sum = sum
        }        
        else {
            sum += data[i]["total"]["deceased"]
        }
    })
    return sum/2
}

export const findActiveCases = (data: any) => {
    let sum = 0;
    let confirmed = findConfirmedCases(data)
    let deaths = findTotalDeaths(data)
    let recoverd = findRecoveredCases(data)
    Object.keys(data).map(i => {
        if (data[i]["total"]["other"] == undefined) {
            sum = sum
        }        
        else {
            sum += data[i]["total"]["other"]
        }
    })
    return confirmed - recoverd - deaths - sum/2
}

