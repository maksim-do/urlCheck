import checkUrlList from './urlcheck';
import parse from './parse';
import writeResultFile from './writeresultfile';

const UrlCountForManualChesk = 100;

export default async () => {
  const list = parse('./Domains.txt');
  const resultCheckUrlList = await checkUrlList(list);
  const UrlsForManualChesk = resultCheckUrlList.length > UrlCountForManualChesk - 1
    ? resultCheckUrlList.slice(0, UrlCountForManualChesk)
    : resultCheckUrlList.slice();
  const resultSentence = `Проверка завершена. Проверено ${list.length} ресурсов. Признаков нарушений ${resultCheckUrlList.length}`;
  writeResultFile(UrlsForManualChesk, resultSentence);
  console.log(resultSentence);
};
