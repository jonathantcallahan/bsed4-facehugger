const request = require('request')
const cheerio = require('cheerio')
const mongoose = require('mongoose')
const fs = require('fs')

module.exports = (app, Person) => {

    const scr = res => {
        
        Person.find()
            .sort({order:1})
            .then(d=> {
                console.log(d)
                res.json(JSON.stringify(d))
            })
    };

    app.get('/api/data-refresh', (req,res) => {
        
        const newNames = []
        const add = data => {
            const stamp = [data[0].stamp]
            data.forEach(e => {
                newNames.push(e.name)
                Person.find({name:e.name})
                    .then(entry => {
                        if(!entry.length){
                            const person = new Person(e)
                            person.save()
                        } 
                    })
            })
            Person.find({})
                .then(d => {
                    d.forEach(e => {
                        const id = e._id
                        const name = e.name
                        if(!~newNames.indexOf(name)) {
                            Person.findAndModify({
                                query:{id:id},
                                update: {$inc: { stamp:'not here'}}
                            })
                        }

                      //  console.log(id)

                    })
                })
        }

        request('http://face.roirevolution.com/', (err,response,body) => {
            const data = []
            if(err) { return err };
            const $ = cheerio.load(body);
            const dateKey = String(Date.now())
            $('small').each(function(i,e){
                const date = $(this).text().split(' ')[2]
                const name = $(this).parent().parent().find('h3 > a').html().replace(/<br>/g,' ')
                console.log(name)
                const unix = new Date(date).valueOf()
                //console.log(unix)
                data.push({'name':name,'start':date,'stamp':dateKey,'order':unix})
            })
            //console.log(data.length)
            add(data)
        })
        res.send('asdf')

    })

    app.get('/api/employee-data', (req, res) => {
        console.log('request made to api')
        scr(res)
        //console.log(scr())
        //res.json(scr())
    })

    app.get('/api/efaucets-data', (req, res) => {
        getEf(res)
    })

}