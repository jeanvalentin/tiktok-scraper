import { mkdirSync, writeFileSync } from 'fs';
import fetch from 'node-fetch';
import { argv } from 'process';
import puppeteer from 'puppeteer';

const downloadsPath = 'downloads';
const account = argv[2];
account ?? process.exit(console.log('Please supply an account name.'));
const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto(`https://www.tiktok.com/@${account}`);
const videoLinks = await page.$$eval(`a`, e => e.map(v => v.getAttribute('href')).filter(v => /\/video\/\d+$/.test(v)));
// videoLinks.splice(2);
// console.log(videoLinks);
console.log(`${videoLinks.length} videos found.`)
mkdirSync(downloadsPath, { recursive: true });
for (const link of videoLinks) {
    console.log(link);
}
for (const link of videoLinks) {
    const videoId = link.replace(/^.*\/(\d+)$/g, (u, v) => v);
    // console.log(videoId);
    const videoPage = await browser.newPage();
    await videoPage.goto(link);
    const videoUrl = await videoPage.$eval(`video`, e => e.getAttribute('src'));
    // console.log(videoUrl);
    await videoPage.close();

    const videoFileName = `${account}_${videoId}.mp4`
    console.log(`Downloading ${videoFileName}...`)
    const videoBytes = await fetch(videoUrl).then(res => res.arrayBuffer()).then(arrayBuffer => Buffer.from(arrayBuffer));
    writeFileSync(`${downloadsPath}/${videoFileName}`, videoBytes);
    console.log(`Done.`)
}
await browser.close();