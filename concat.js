import { readdirSync, readFileSync } from 'fs';
import xlsx from 'xlsx';
import { DOWNLOADS_PATH } from './constants.js';

const workbook = xlsx.utils.book_new();
const jsonFiles = readdirSync(DOWNLOADS_PATH).filter(v => /\.json$/.test(v));
const bigJson = jsonFiles.flatMap(jsonFile => JSON.parse(readFileSync(`${DOWNLOADS_PATH}/${jsonFile}`)));
const worksheet = xlsx.utils.json_to_sheet(bigJson);
xlsx.utils.book_append_sheet(workbook, worksheet);
const xlsSavePath = `${DOWNLOADS_PATH}/data_all.xlsx`;
xlsx.writeFile(workbook, xlsSavePath);
console.log(`Created ${xlsSavePath}`);
