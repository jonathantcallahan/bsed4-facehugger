$( document ).ready(function(){
    console.log('asdf')
    $.get('/api/employee-data', function(data) {
        if(data){
            data = JSON.parse(data)
            b = []
            for(key in data){
                const t = new Date()
                const d = new Date(data[key])
                const timeDif = Math.floor((t.getTime() - d.getTime()) / (1000 * 3600 * 24))
                const roundDif = Math.round(timeDif / 50) * 50
                //b.push(roundDif)
                b.push(Math.round(timeDif / 30))
            }
        } else {
            console.log(err)
        }
        console.log(d3)
        const histogram = d3.layout.histogram()
            .bins(100)(b)
        // console.log(histogram)

        const canvas = d3.select('#data').append('svg')
            .attr('width', 500)
            .attr('height', 500)

        const bars = canvas.selectAll('.bar')
            .data(histogram)
            .enter()
            .append('g')

        bars.append('rect')
            .attr('x', d => d.x * 5)
            .attr('y', 0)
            .attr('width', d => d.dx * 4)
            .attr('height', d => d.y * 20)
    })
})

