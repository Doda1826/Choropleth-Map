

const urlEducationData = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';
const urlCountyData = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';

let countyData;
let educationData;

let canvas = d3.select('#canvas')
let tooltip = d3.select('#tooltip')

const drawMap = () => {
    canvas.selectAll('path')
          .data(countyData)
          .enter()
          .append('path')
          .attr('d', d3.geoPath())
          .attr('class', 'county')
          .attr('fill', (countyDataItem) => {
            let id = countyDataItem['id']
            let county = educationData.find((item) => {
                return item['fips'] === id
            })
            let percentage = county['bachelorsOrHigher']
            if(percentage <= 12 ){
                return '#e9f7e9'
            } else if( percentage <= 21){
                return '#c4e6c4'
            } else if ( percentage <= 30){
                return '#9fd59f'
            } else if ( percentage <= 39){
                return '#7ac47a'
            } else if (percentage <= 48) {
                return '#55b355'
            } else if (percentage <= 57) {
                return '#30a230'
            } else if (percentage <= 100) {
                return '#0b910b'
            }
          })
          .attr('data-fips', (countyDataItem) => {
            return countyDataItem['id']
          })
          .attr('data-education', (countyDataItem) => {
            let id = countyDataItem['id']
            let county = educationData.find((item) => {
                return item['fips'] === id
            })
            let percentage = county['bachelorsOrHigher']
            return percentage
          })
          .each(function(countyDataItem) {
            this.addEventListener('mouseover', function(){
                tooltip.transition().style('visibility', 'visible')

                let id = countyDataItem['id']
                let county = educationData.find((item) => {
                    return item['fips'] === id
                })
                tooltip.text(county['fips'] + ' - ' + county['area_name'] + ', ' + county['state'] + ' : ' + county['bachelorsOrHigher'] + '%')
                tooltip.attr('data-education', county['bachelorsOrHigher'])
            
            })

            this.addEventListener('mouseout', function() {
                tooltip.transition().style('visibility', 'hidden')
            })
          })
}

d3.json(urlCountyData).then(
    (data, error) => {
        if(error){
            console.log(log)
        } else {
            countyData = topojson.feature(data, data.objects.counties).features
            console.log(countyData)

            d3.json(urlEducationData).then(
                (data, error) => {
                    if(error){
                        console.log(log)
                    } else {
                        educationData = data
                        console.log(educationData)
                        drawMap()
                    }
                }
            )
        }
    }
)