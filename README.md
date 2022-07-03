# tiktok-scraper

## Download and install

```bash
git clone https://github.com/jeanvalentin/tiktok-scraper.git
cd tiktok-scraper
npm install
```

This program uses Puppeteer. It seems to run out of the box on Windows, however on Linux you may have to install some additional libraries manually. If so, watch the error messages and get the dependencies from your package manager.

## How to use

Using this program violates TikTok's terms of service.

`npm run start ${accountname}`

Example: `npm run start edsheeran`

Videos and metadata are saved to `./downloads`, directory is created if need be. Videos are in mp4 format. Metadata is in json.

## Metadata

For each video, the following information is fetched and saved:
- username
- videoFileName
- pageUrl
- videoUrl
- likeCount
- commentCount
- shareCount
- videoDescription
- publicationDate

## Convert output data

Yeah sure you don't like json, you want Excel files. Fine.

### Create one XLSX file per json file:

`npm run convert`

### Create one big XLSX file with all metadata:

`npm run concat`

## Known issues, work in progress

- Only the last 30 videos of an account are downloaded.
- Like count, comment count, and share count may or may not be integers.
