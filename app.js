const puppeteer = require('puppeteer');
const express = require("express")
const app = express()
const port =  process.env.PORT || 6080;
let resar = [];
let   html = [];
(async () => {
    try {
        let parserBrowser = async () =>{
        let flag = true
        let counter = 0
        const browser = await puppeteer.launch({headless: false, devtools: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
            ],

        });
        const page = await browser.newPage();
        while (flag){



            await page.goto(`https://www.city.kharkov.ua/ru/novosti.html?p=${counter * 10 }`);
            await page.waitForSelector("a.name")

             html = await page.evaluate(async () => {

                let listNewsOne = []
                let ListNewsGloal = []
                let listNewsTow = []
                let listNewsThree = []
                let listNewsObjOne = {}
                let listNewsObjTow = {}
                let listNewsObjThree = {}



                let listAr = await document.querySelectorAll(".container_news")
                await listAr.forEach(el => {
                    listNewsOne = [...el.children[0].children[1].children ]
                    el.children[0].children[4] === undefined ? listNewsTow = undefined : listNewsTow = [...el.children[0].children[4].children]
                    el.children[0].children[7] === undefined ? listNewsThree = undefined : listNewsThree = [...el.children[0].children[7].children]

                })

              const OneDete  =  listAr[0].children[0].children[0].children[1].children[0].innerHTML
              const TowDate  =  !listAr[0].children[0].children[3].children[0].children[0]  ?  undefined : listAr[0].children[0].children[3].children[0].children[0].innerHTML
              const TheeDate =  !listAr[0].children[0].children[6]  ?  undefined : listAr[0].children[0].children[6].children[0].children[0].innerHTML
              const Constructor = (ObjectElS,ConstructorObj,Dete) =>{
                    ObjectElS.forEach((li) => {
                        ConstructorObj = {
                            data_time: li.children[1].children[0].innerHTML,
                            dete:Dete,
                            title: li.children[1].children[2].innerHTML,
                            img: li.children[0].children[0].children[0].src,
                            description: li.children[1].children[3].innerHTML,
                            href: li.children[0].children[0].href,
                        }

                        ListNewsGloal.push(ConstructorObj)})}
              listNewsOne === undefined ?   undefined :  Constructor(listNewsOne,listNewsObjOne,OneDete)
              listNewsTow === undefined ?   undefined :  Constructor(listNewsTow,listNewsObjTow,TowDate)
              listNewsThree === undefined ? undefined :  Constructor(listNewsThree,listNewsObjThree,TheeDate)
                return ListNewsGloal
            })
            await  resar.push(html)
            counter++
            if(counter >= 5) {
                await browser.close()
                flag = false
                counter = 0
            }
            }}
        parserBrowser().catch(e =>{console.log(e)})
        setInterval(async () =>{
            resar = []
           parserBrowser().catch(e =>{console.log(e)})
        }, 300000 )
    } catch (e) {
        console.log(e)
        await  browser.close()
    }})()










app.get('/news', async function(req, res) {
    res.send(JSON.stringify(resar ));
});



app.listen(port, () => {
    console.log(` app listening at http://localhost:${port}/news`)
})

