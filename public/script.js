$( document ).ready(function(){
    let searchData = []
    $.get('/api/employee-data', function(data) {
        if(data){
            const people = []
            const oldPeople = []
            JSON.parse(data).filter(e => (e.name != 'asdf')).map((e,i) => {
                //console.log(e)
                const s = ( `${i+1}: <div class='list-image' style='background-image: url(./media/images/${e.name.replace(/\s/g,'_')}.jpg)'></div> ${e.name} started on ${e.start}`)
                e.stamp == 'not here' ? oldPeople.push(s) : people.push(s)
                
            })
            people.slice(0,10).forEach(e => {
                $('#start-rank').append(`<div class='list-entry'>${e}</div>`)
            })
            people.slice(people.length-10,people.length).forEach(e => {
                $('#new-rank').append(`<div class='list-entry'>${e}</classdiv>`)
            })
            oldPeople.forEach(e => {
                $('#old-rank').append(`<div class='list-entry'>${e}</div>`)
            })

            searchData = JSON.parse(data).filter(e => (e.name != 'asdf' && e.stamp != 'not here'))
            
            const search = term => {
                console.log(term)
                if(term == ''){ 
                    $('#results-container').empty()
                    return
                 }
                const matches = searchData.map((e,i)=> {return {name:e.name, rank:i}}).filter(e => e.name.toLowerCase().includes(term))
                $('#results-container').empty()
                
                const percentile = person => ((people.length-person.rank)/people.length)*100
                const results = (person, percentile) =>  `
                    <div class='search-result'>
                        <div class='results-image' style='background-image: url(./media/images/${person.name.replace(/\s/g,'_')}.jpg)'></div>
                        <span>${person.name}</span>
                        <span>Rank: ${person.rank}</span>
                        <span>Percentile: ${percentile}</span>
                    </div>
                `
                matches.forEach(e => {
                    const p = percentile(e)
                    const r = results(e,p)
                    $('#results-container').append(r)
                })
            }
        
            const renderSearch = d => {
                d.forEach(e => {
                    
                })
            }

            $('#search').keyup(function(){
                const term = $(this).val()
                search(term)
            })

            $('#search-button').click(function(){
                const term = $('#search').val()
                search(term)
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

