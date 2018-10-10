$( document ).ready(function(){
    console.log('asdf')
    $.get('/api/employee-data', function(data) {
        if(data){
            data = JSON.parse(data)
            for(key in data){
                const t = new Date()
                const d = new Date(data[key])
                console.log(d)

            }

        } else {
            console.log(err)
        }
    })
})

