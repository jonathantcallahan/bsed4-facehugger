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

        const width = 500,
                height = 200,
                padding = 50;

        const histogram = d3.layout.histogram()
            .bins(100)(b)
        console.log(histogram)

        const y = d3.scale.linear()
             .domain([0,d3.max(histogram.map(i=>i.length))])
             .range([0,height])

        const x = d3.scale.linear()
            .domain([0,d3.max(b)])
            .range([0,width])

        const canvas = d3.select('#data').append('svg')
            .attr('width', width)
            .attr('height', height + padding)

        const bars = canvas.selectAll('.bar')
            .data(histogram)
            .enter()
            .append('g')

        bars.append('rect')
            .attr('x', d => x(d.x))
            .attr('y', d => height - y(d.y))
            .attr('width', d => x(d.dx))
            .attr('height', d => y(d.y))
    })
})

