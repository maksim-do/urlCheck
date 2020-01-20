import fs from 'fs';

const parse = (fileName) => fs.readFileSync(fileName).toString().split('\n');

export default parse;
