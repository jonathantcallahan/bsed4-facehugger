$( document ).ready(function(){
    $.get('/api/employee-data', function(data) {
        if(data){
            const people = JSON.parse(data).filter(e => (e.name != 'asdf' && e.stamp != 'not here')).map((e,i) => {
                //console.log(e)
                return ( `${i+1}: <div class='list-image' style='background-image: url(./media/images/${e.name.replace(/\s/g,'_')}.jpg)'></div> ${e.name} started on ${e.start}`)
            })
            people.slice(0,10).forEach(e => {
                $('#start-rank').append(`<div>${e}</div>`)
            })
            people.slice(people.length-11,people.length).forEach(e => {
                $('#new-rank').append(`<div>${e}</div>`)
            })

            data = JSON.parse(data).filter(e => e.name != 'asdf').map(e => e.start)

            b = []
            for(key in data){
                const t = new Date()
                const d = new Date(data[key])
                const timeDif = Math.floor((t.getTime() - d.getTime()) / (1000 * 3600 * 24))
                const roundDif = Math.round(timeDif / 50) * 50
                //b.push(roundDif)
                b.push(Math.round(timeDif / 30))
            }
            console.log(b.length)
        } else {
            console.log(err)
        }
        console.log(d3)

        const width = 2000,
                height = 200,
                padding = 50;

        const histogram = d3.layout.histogram()
            .bins(192)(b)
        console.log(histogram)

        const y = d3.scale.linear()
             .domain([0,d3.max(histogram.map(i=>i.length))])
             .range([0,height])

        const x = d3.scale.linear()
            .domain([0,d3.max(b)])
            .range([0,width])


            const xAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom')

        const canvas = d3.select('#data').append('svg')
            .attr('width', width)
            .attr('height', height + padding)
            .append('g')
                .attr('transform','translate(20,0)')

        /*
        const group = canvas.append('g')
            .attr('transform','translate(0,' + height + ')')
            .call(xAxis)
        */
        const bars = canvas.selectAll('.bar')
            .data(histogram)
            .enter()
            .append('g')

        bars.append('rect')
            .attr('x', d => x(d.x))
            .attr('y', d => height - y(d.y))
            .attr('width', d => x(d.dx))
            .attr('height', d => y(d.y))

        bars.append('text')
            .attr('x', d => x(d.x) + 5)
            .attr('y', d => height - y(d.y) + 8)
            .attr('fill','#fff')
            .attr('text-anchor','middle')
            .attr('font-size','8px')
            .attr('font-family','monospace')
            .text(d => d.y)

    })
})

