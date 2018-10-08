const request = require('request')
const cheerio = require('cheerio')
const mongoose = require('mongoose')
const fs = require('fs')

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

    const getEf = res => {
        request('https://www.efaucets.com/?_vis_test_id=51&_vis_opt_random=0.4777546671009354&_vis_hash=ba7adeae48e3d7315920016960e0af05&_vis_opt_preview_combination=2', (err,response,body) => {
            if(err) { return err };
            const links = {
                textLinks : {},
                photoLinks: {}
            };
            const $ = cheerio.load(body);
            $('li.navExtra > ul > li > a').each(function(i,e){
                const title = $(this).text().trim()
                const href = $(this).attr('href')
                links.textLinks[title] = href
            })
            $('li > a > img').each(function(i,e) {
                const title = $(this).next().text()
                console.log($(this).attr('src'))
                links.photoLinks[title] = { href: $(this).parent().attr('href'), src: $(this).attr('data-yo-src') }
            })
            console.log(links)
            fs.writeFile('efaucets-data.txt', JSON.stringify(links), function(err){
                err && console.log(err)
                console.log('File saved!')
            })
            res.json().status(200)
            //console.log(dates)
            //res.json(JSON.stringify(dates))
        })
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