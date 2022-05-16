import Trianguler from './trianguler';

//USE case
const currencies = ['BTC','USDT','LTC'];
const symbols = ['BTC-USDT','LTC-BTC','LTC-USDT'];
const filePathA = "./teamtrader/metadata/kucoin/triangles.json";
const filePathB = "./teamtrader/metadata/kucoin/basepairs.json";

const trianguler = new Trianguler(currencies,symbols);

//first run: to set markets
trianguler.generateTriangles(filePathA);

//then run:
const basepairs = trianguler.generateBasePairs(filePathB);

console.log(basepairs);
