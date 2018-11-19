const request = require('request')
const cheerio = require('cheerio')
const mongoose = require('mongoose')
const fs = require('fs')

module.exports = (app) => {

    const scr = res => {
        request('http://face.roirevolution.com/', (err,response,body) => {
            if(err) { return err };
            const data = {};
            const $ = cheerio.load(body);
            const dateKey = String(Date.now())
            $('small').each(function(i,e){
                const date = $(this).text().split(' ')[2]
                const name = $(this).parent().parent().find('h3 > a').text()
                data[name] = {'date':date,'datekey':dateKey}

            })
            console.log(data)
            const dates = []
            for(let d in data) dates.push(data[d].date)
            res.json(JSON.stringify(dates))
        })
    };

    const wdata = data => {

    }

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