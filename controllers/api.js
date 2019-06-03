const request = require('request')
const cheerio = require('cheerio')
const mongoose = require('mongoose')
var fs = require('fs'), options

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
        let dataInCorrectFormat = true

        const add = data => {
            const stamp = [data[0].stamp]
            data.forEach(e => {
                newNames.push(e.name)
                Person.find({name:e.name})
                    .then(entry => {
                        if(!entry.length){
                            const person = new Person(e)
                            console.log(e)
                            person.save()
                        } else {
                            console.log(e.img)
                            Person.findOneAndUpdate(
                                {'name':e.name},
                                {'img':e.img},
                                {upsert:true},
                                (err,doc) => {
                                    if(err) console.log(err)
                                    else console.log(doc)
                                }
                            )
                        }
                    })
            })
            Person.find({})
                .then(d => {
                    d.forEach(e => {
                        const id = e._id
                        const name = e.name
                        if(!~newNames.indexOf(name)) {
                            console.log(name, 'not in list')
                            Person.find({'name':name}).then(d => console.log(d))
                            Person.findOneAndUpdate(
                                {'name':name},
                                {'stamp':'not here'},
                                {upsert:true},
                                (err,doc) => {
                                    if(err) console.log(err)
                                    else console.log(doc)
                                }
                            )
                        }

                      //  console.log(id)

                    })
                })
        }

        const saveImg = (url,name) => {
            request('http://face.roirevolution.com'+url)
                .on('error', function(err){console.log(err)})
                .pipe(fs.createWriteStream(`./public/media/images/${name.replace(/\s/g,'_')}.jpg`))
        }
        request('http://face.roirevolution.com/', (err,response,body) => {
            const data = []
            if(err) { return err };
            const $ = cheerio.load(body);
            const dateKey = String(Date.now())
            $('small').each(function(i,e){
                const date = $(this).text().split(' ')[2]
                const name = $(this).parent().parent().find('h3 > a').html().replace(/<br>/g,' ')
                const img = $(this).parent().parent().find('img').attr('src')
                saveImg(img,name)
                console.log(name)
                const unix = new Date(date).valueOf()
                if(!name){ dataInCorrectFormat = false }
                //console.log(unix)
                data.push({'name':name,'start':date,'stamp':dateKey,'order':unix, 'img':img})
            })
            //console.log(data.length)
            dataInCorrectFormat && add(data)
        })
        dataInCorrectFormat ? res.redirect('/') : res.send('error in data refresh')

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