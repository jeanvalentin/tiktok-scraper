import { readdirSync, readFileSync } from 'fs';
import xlsx from 'xlsx';
import { DOWNLOADS_PATH } from './constants.js';

const jsonFiles = readdirSync(DOWNLOADS_PATH).filter(v => /\.json$/.test(v));
jsonFiles.map(jsonFile => {
  const workbook = xlsx.utils.book_new();
  const json = JSON.parse(readFileSync(`${DOWNLOADS_PATH}/${jsonFile}`));
  const worksheet = xlsx.utils.json_to_sheet(json);
  xlsx.utils.book_append_sheet(workbook, worksheet);
  const filename = jsonFile.replace(/\.json$/, '.xlsx');
  const xlsSavePath = `${DOWNLOADS_PATH}/${filename}`;
  xlsx.writeFile(workbook, xlsSavePath);
  console.log(`Created ${xlsSavePath}`);
});
