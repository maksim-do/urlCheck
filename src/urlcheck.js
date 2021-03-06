import axios from 'axios';

// eslint-disable-next-line no-useless-escape
const regularSentenceForFilter = new RegExp('\ айт (не( |)доступен|выставлен на продажу)|(упить|родлить) этот домен|page cannot be display|Единый реес|suspended domain', 'ig');
const attemptcount = 3;

const isRedirect = (url, answer) => {
  // eslint-disable-next-line no-useless-escape
  const filter = `htt(p|ps):\/\/${url}\/`;
  const urlRegExp = new RegExp(filter, 'ig');
  const answerUrl = answer.request.res.responseUrl;
  return answerUrl.search(urlRegExp) === -1;
};

const isStopper = (sentece, regExp) => sentece.search(regExp) >= 0;

const isOmission = (url, answer) => (answer.status === 200)
  && !isStopper(answer.data, regularSentenceForFilter) && !isRedirect(url, answer);

const getResponse = async (url, attempt) => {
  try {
    const answer = await axios.get(`http://${url}`, { timeout: 5000 });
    console.log(`Domain ${url} ответ от ${answer.request.res.responseUrl}`); // редирект ${isRedirect(url, answer)} фильтр ${isStopper(answer.data, regularSentenceForFilter)}
    return {
      url,
      cheskResult: isOmission(url, answer),
    };
  } catch (_err) {
    if (attempt === 1 || _err.code === 'ETIMEDOUT') {
      console.log(`Domain ${url} unavailable`, _err.code);
      return {
        url,
        cheskResult: false,
      };
    }
    return getResponse(url, attempt - 1);
  }
};

const сheсkChankList = async (list) => {
  const listGetAxios = list.map((el) => getResponse(el, attemptcount));
  return (await Promise.all(listGetAxios))
    .filter(({ cheskResult }) => cheskResult)
    .map(({ url }) => url);
};

const сheсkList = async (domains) => {
  const sizeChunk = 500;
  const iter = async (list, checkResult) => {
    if (list.length === 0) return checkResult;
    const endChunk = list.length < sizeChunk;
    const chunk = endChunk ? list.slice() : list.slice(0, sizeChunk);
    const newList = endChunk ? [] : list.slice(sizeChunk);
    const checkChunk = await сheсkChankList(chunk);
    return iter(newList, [...checkResult, checkChunk]);
  };
  return iter(domains, []);
};


export default сheсkList;
