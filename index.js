import { mkdirSync, writeFileSync } from 'fs';
import fetch from 'node-fetch';
import { argv } from 'process';
import puppeteer from 'puppeteer';

const downloadsPath = 'downloads';
const account = argv[2];
account ?? process.exit(console.log('Please supply an account name.'));
const accountData = [];
const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto(`https://www.tiktok.com/@${account}`);
const videoLinks = await page.$$eval(`a`, e => e.map(v => v.getAttribute('href')).filter(v => /^https:\/\/www\.tiktok\.com\/@.+\/video\/\d+$/.test(v)));
// videoLinks.splice(2);
console.log(`${videoLinks.length} videos found.`)
mkdirSync(downloadsPath, { recursive: true });
for (const link of videoLinks) {
    console.log(link);
}
for (const link of videoLinks) {
    try {
        const videoId = link.replace(/^.*\/(\d+)$/g, (u, v) => v);
        // console.log(videoId);
        const videoPage = await browser.newPage();
        await videoPage.goto(link);
        const videoFileName = `${account}_${videoId}.mp4`
        console.log(`Downloading ${videoFileName}...`)
        const videoUrl = await videoPage.$eval(`video`, e => e.getAttribute('src'));
        const likeCount = await videoPage.$eval(`strong[data-e2e="like-count"]`, e => e.textContent);
        const commentCount = await videoPage.$eval(`strong[data-e2e="comment-count"]`, e => e.textContent);
        const shareCount = await videoPage.$eval(`strong[data-e2e="share-count"]`, e => e.textContent);
        const videoDescription = await videoPage.$eval(`div[data-e2e="browse-video-desc"]`, e => e.textContent);
        const videoData = {
            username: account,
            videoFileName: videoFileName,
            pageUrl: link,
            videoUrl: videoUrl,
            likeCount: likeCount,
            commentCount: commentCount,
            shareCount: shareCount,
            videoDescription: videoDescription,
        };
        // console.log(videoData);
        accountData.push(videoData);
        writeFileSync(`${downloadsPath}/${account}_data.json`, JSON.stringify(accountData));
        await videoPage.close();
        const videoBytes = await fetch(videoUrl).then(res => res.arrayBuffer()).then(arrayBuffer => Buffer.from(arrayBuffer));
        writeFileSync(`${downloadsPath}/${videoFileName}`, videoBytes);
        console.log(`Done.`)
    } catch {
        console.log(`${link}: failure`);
    }
}
await browser.close();
