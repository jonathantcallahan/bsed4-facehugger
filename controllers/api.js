const request = require('request')
const cheerio = require('cheerio')
const mongoose = require('mongoose')

module.exports = (app) => {

    const scr = res => {
        request('http://face.roirevolution.com/', (err,response,body) => {
            if(err) { return err };
            const dates = {};
            const $ = cheerio.load(body);
            $('small').each(function(i,e){
                const date = $(this).text().split(' ')[2]
                dates[i] = date
            })
            //console.log(dates)
            res.json(JSON.stringify(dates))
        })
    };

    app.get('/api/employee-data', (req, res) => {
        console.log('request made to api')
        scr(res)
        //console.log(scr())
        //res.json(scr())
    })

}