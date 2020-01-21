import fs from 'fs';

const beginFile = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge"><title>Document</title></head><body></body>';
const endFile = '</body></html>';
const getNameFile = () => {
  const date = new Date();
  return `${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}_${date.getDate()}-${date.getMonth()}-${date.getFullYear()}.html`;
};

export default (domens, sentence) => {
  const fileName = getNameFile();
  fs.writeFileSync(`${fileName}`, beginFile);
  const bodyFile = domens.map((el) => `<br><a href="http://${el}">http://${el}</a>`).reduce((acc, el) => `${acc}${el}`, `${sentence}<br>`);
  fs.appendFileSync(fileName, bodyFile);
  fs.appendFileSync(fileName, endFile);
  console.log(`По результатам проверки создан файл ${fileName}`);
  return fileName;
};
