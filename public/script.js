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
                b.push(roundDif)
            }
            console.log(b)

        } else {
            console.log(err)
        }
    })
})

