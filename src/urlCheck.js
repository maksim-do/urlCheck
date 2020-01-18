import axios from 'axios';
import urls from './checkList';

const isRedirect = (url, answer) => {
  const httpUrl = `http://${url}/`;
  const httpsUrl = `https://${url}/`;
  const answerUrl = answer.request.res.responseUrl;
  return !((answerUrl === httpUrl) || (answerUrl === httpsUrl));
};

const isGag = () => false;

const isOmission = (url, answer) => (answer.status === 200)
  && !isGag(answer.data) && !isRedirect(url, answer);

const getResponse = async (url) => {
  try {
    // console.log(url);
    const answer = await axios.get(`http://${url}`);
    console.log({
      url,
      cheskResult: isOmission(url, answer),
    }, answer.request.res.responseUrl, isRedirect(url, answer));
    return {
      url,
      cheskResult: isOmission(url, answer),
    };
  } catch (_err) {
    console.log(_err.code, 'Oups');
    return {
      url,
      cheskResult: false,
    };
  }
};

const сheсkList = async (domens) => {
  const list = domens.map((el) => getResponse(el));
  const result = (await Promise.all(list))
    .filter(({ cheskResult }) => cheskResult)
    .map(({ url }) => url);
  console.log(result, result.length);
};

сheсkList(urls);
