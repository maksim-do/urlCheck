import axios from 'axios';

// eslint-disable-next-line no-useless-escape
const regularSentenceForFilter = new RegExp('\ айт (не( |)доступен|выставлен на продажу)|(упить|родлить) этот домен|page cannot be display|Единый реес|suspended domain', 'ig');
const attemptcount = 1;

const isRedirect = (url, answer) => {
  const httpUrl = `http://${url}/`;
  const httpsUrl = `https://${url}/`;
  const answerUrl = answer.request.res.responseUrl;
  return !((answerUrl === httpUrl) || (answerUrl === httpsUrl));
};

const isStopper = (sentece, regExp) => {
  const result = sentece.search(regExp);
  return result >= 0;
};

const isOmission = (url, answer) => (answer.status === 200)
  && !isStopper(answer.data, regularSentenceForFilter) && !isRedirect(url, answer);

const getResponse = async (url, attempt) => {
  try {
    // console.log(url);
    const answer = await axios.get(`http://${url}`, { timeout: 3000 });
    console.log(`Domain ${url} ответ от ${answer.request.res.responseUrl} доступен ${isOmission(url, answer)} `);
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

const сheсkList = async (domens) => {
  const list = domens.map((el) => getResponse(el, attemptcount));
  return (await Promise.all(list))
    .filter(({ cheskResult }) => cheskResult)
    .map(({ url }) => url);
};

export default сheсkList;
