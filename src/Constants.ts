import * as d3 from "d3"

export const MAIN_URL = "https://data.covid19india.org/v4/min/data.min.json"
export const TIMESERIES_URL = "https://data.covid19india.org/v4/min/timeseries.min.json"
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

export const STATE_NAMES: any = {
    AP: 'Andhra Pradesh',
    AR: 'Arunachal Pradesh',
    AS: 'Assam',
    BR: 'Bihar',
    CT: 'Chhattisgarh',
    GA: 'Goa',
    GJ: 'Gujarat',
    HR: 'Haryana',
    HP: 'Himachal Pradesh',
    JH: 'Jharkhand',
    KA: 'Karnataka',
    KL: 'Kerala',
    MP: 'Madhya Pradesh',
    MH: 'Maharashtra',
    MN: 'Manipur',
    ML: 'Meghalaya',
    MZ: 'Mizoram',
    NL: 'Nagaland',
    OR: 'Odisha',
    PB: 'Punjab',
    RJ: 'Rajasthan',
    SK: 'Sikkim',
    TN: 'Tamil Nadu',
    TG: 'Telangana',
    TR: 'Tripura',
    UT: 'Uttarakhand',
    UP: 'Uttar Pradesh',
    WB: 'West Bengal',
    AN: 'Andaman and Nicobar Islands',
    CH: 'Chandigarh',
    DN: 'Dadra and Nagar Haveli and Daman and Diu',
    DL: 'Delhi',
    JK: 'Jammu and Kashmir',
    LA: 'Ladakh',
    LD: 'Lakshadweep',
    PY: 'Puducherry',
};
  
const stateCodes: any = [];
const stateCodesMap:any = {};
Object.keys(STATE_NAMES).map((key, index) => {
    stateCodesMap[STATE_NAMES[key]] = key;
    stateCodes.push({code: key, name: STATE_NAMES[key]});
    return null;
});
export const STATE_CODES = stateCodesMap;
export const STATE_CODES_ARRAY = stateCodes;