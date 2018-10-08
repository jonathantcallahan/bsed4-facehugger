$( document ).ready(function(){
    console.log('asdf')
    $.get('/api/employee-data', function(data) {
        console.log('asdf')
        console.log(JSON.parse(data) || err)
    })
})

