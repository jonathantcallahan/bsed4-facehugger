const request = require('request')
const cheerio = require('cheerio')
const mongoose = require('mongoose')

module.exports = (app) => {

    const scr = () => {
        request('http://face.roirevolution.com/', (err,response,body) => {
            if(err) { return err };
            const dates = {};
            const $ = cheerio.load(body);
            $('small').each(function(i,e){
                const date = $(this).text().split(' ')[2]
                dates[i] = date
            })
            return dates
        })
    };

    app.get('/api/employee-data', (req, res) => {
        res.json(scr())
    })

}