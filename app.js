
import puppeteer from "puppeteer";
import express from "express";
import {ParsePage, StopParse, UpdateData} from "./core.js";
const app = express();
const port = process.env.PORT || 6080;
const URL = "https://www.city.kharkov.ua/ru/novosti.html";
const SELECTOR = "a.name";
const LIMIT = 5;
let accumulator = [];

(async () => {
  try {
    let parserBrowser = async () => {
      let flag = true;
      let counter = 0;
      const browser = await puppeteer.launch({
        headless: true,
        devtools: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      const page = await browser.newPage();
      await page.setDefaultNavigationTimeout(0);

      while (flag) {
        await page.goto(`${URL}?p=${counter * 10}`, {waitUntil: "networkidle2"});
        await page.waitForSelector(SELECTOR);
        await accumulator.push(await ParsePage(page));
        counter++;
        StopParse(browser, counter, flag, LIMIT);
      }
    };
    parserBrowser().catch((e) => {
      console.log(e);
    });
    UpdateData(accumulator, parserBrowser, 300000);
  } catch (e) {
    console.log(e);
    await browser.close();
  }
})();

app.get("/news", async function (req, res) {
  res.send(JSON.stringify(accumulator));
});

app.listen(port, () => {
  console.log(` app listening at http://localhost:${port}/news`);
});

