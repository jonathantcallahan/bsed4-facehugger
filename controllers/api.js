const request = require('request')
const cheerio = require('cheerio')
const mongoose = require('mongoose')
const fs = require('fs')

module.exports = (app, Person) => {

    const scr = res => {
        request('http://face.roirevolution.com/', (err,response,body) => {
            if(err) { return err };
            const data = {};
            const $ = cheerio.load(body);
            const dateKey = String(Date.now())
            $('small').each(function(i,e){
                const date = $(this).text().split(' ')[2]
                const name = $(this).parent().parent().find('h3 > a').text()
                data[name] = {'start':date,'stamp':dateKey}

            })
            console.log(data)
            const dates = []
            for(let d in data) dates.push(data[d].start)
            res.json(JSON.stringify(dates))
            Person.find({})
                .then(d => {
                    const test = new Person({name:'asdf',start:'asdfasdf',stamp:'asdfasdfasdf'})
                    test.save()
                })
            Person.find({})
                .then(d => console.log(d))
        })
    };

    app.get('/api/data-refresh', (req,res) => {
        
        const newNames = []
        const add = data => {
            // console.log(typeof data)
            const stamp = [data[0].stamp]
            // console.log(stamp)
            data.forEach(e => {
                newNames.push(e.name)
                // console.log(e.name)
                Person.find({name:e.name})
                    .then(entry => {
                        if(!entry.length){
                            // console.log('new')
                            const person = new Person(e)
                            person.save()
                        } else {
                            // console.log(entry[0].stamp)
                            // console.log(e.stamp)
                            // console.log(e.name, 'saved')
                        }
                    })
            })
            Person.find({})
                .then(d => {
                    //console.log(d)
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
                const name = $(this).parent().parent().find('h3 > a').text()
                data.push({'name':name,'start':date,'stamp':dateKey})
            })
            console.log(data.length)
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