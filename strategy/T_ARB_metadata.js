require('lodash.permutations');
const _ = require("lodash");
const fs = require('fs');


// //USE case
// const trianguler = new Trianguler(currencies,symbols);
//
// //first run: to set markets
// trianguler.generateTriangles(filePath);
//
// //then run:
// trianguler.generateBasePairs(filePath);

// const tradefeesGetter = () => {};

//it generates metadatas for trianguler arbitrage.
class T_ArbitrageMetadata {
  // e.g BTC, USDT, ETH, SHIB
  currencies = [];

  // a list of traded symbols
  symbols = []

  // the transaction currency for the entire trading market.
  // e.g BTC, USDT, TRX, ETH
  markets = [];
//
  // basepairs include a list of existing symbols for markets
  // e.g BTC-USDT, BTC-ETH TRX-USDT etc..
  basepairs = [];

  constructor(currencies, symbols) {
    this.currencies = currencies;
    this.symbols = symbols;
    // this.markets = markets;

    /** bind function */
    this.generateBasePairs = this.generateBasePairs.bind(this);
    this.generateTriangles = this.generateTriangles.bind(this);
    this._getCurrencyTriangles = this._getCurrencyTriangles.bind(this);
    this._getCurrencyPairs = this._getCurrencyPairs.bind(this);
  }

  // this function will generate the base pairs
  generateBasePairs = (filePath) => {
    let arr = this.markets;
    let pairs = [];
    // Making chunks of size 2
    let chunk = _.permutations(arr, 2);
    console.log(pairs)

    _.forEach(chunk, function(value) {
       let pair = value.join('-');
       pairs.push(pair);
    });

    let truePairs = this._checkSymbols(pairs);

    this._saveFile(truePairs, filePath);

    this.basepairs = truePairs;

    return true;
  };

  //generate triangles for every currency and
  //save them at the specified file path.
  generateTriangles = (filePath) => {

    let trianglesPack = {
      trianglesCount:0,
      currencyCount:0,
      triangles:[] ,//[...triangles]
      perCurrency:[] //['ltc',[...triangles]]
    };

    _.forEach(this.currencies, (currency) => {
       // console.log(currency)
       let triangles = this._getCurrencyTriangles(currency);
       console.log(triangles);
       if(triangles.length == 0 ) return; // continue;
       _.forEach(triangles, (triangle) =>{

         trianglesPack.triangles.push(triangle);
       });
       trianglesPack.perCurrency.push([currency,triangles]);
    });

    const trianglesCount = trianglesPack.triangles.length;
    const currencyCount = trianglesPack.perCurrency.length;

    trianglesPack.trianglesCount = trianglesCount;
    trianglesPack.currencyCount = currencyCount;

    console.log(trianglesPack);
    this._saveFile(trianglesPack, filePath);

    return true;
  };


  generateFeeRate = (Tradefees, filePath) => {
     //Formate
     // let tradefees = [
     //   {
     //     symbol:'BTC-USDT',
     //     takerFeeRate:'0.001',
     //     makerFeeRate:'0.001',
     //   },
     // ]
     let tradefeesFile = {tradefees:Tradefees};
    let saved = this._saveFile(tradefeesFile, filePath);
     return saved;
  };



  _getCurrencyPairs = (currency) => {
     let currencyPairs = [];
    _.forEach(this.symbols, function(value){
      let quote = value.split('-')[0];
      if(currency === quote){
        currencyPairs.push(value);
      };
    });
    // console.log(currencyPairs);
    return currencyPairs;
  };

  _getQuotePairs = (currency) => {
    let currencyPairs = this._getCurrencyPairs(currency);
    // console.log(currencyPairs);
    let quotePairs = _.permutations(currencyPairs, 2);

    //[['ltc-btc',ltc-usdt],[ltc-eth,ltc-usdt],]
    // console.log(quotePairs);
    return quotePairs;
  };

//This return the triangles for a particular currency(quote)
  _getCurrencyTriangles = (currency) => {
   let quotePairs = this._getQuotePairs(currency);

   let triangles = [];
   _.forEach(quotePairs,(value) => {

     //check if it only contains one Symbols
     //as a single symbol is useless.
     if(value.length == 1) return //continue;

      let firstBase = value[0].split('-')[1];
      let secondBase = value[1].split('-')[1];
      let bases = [firstBase, secondBase];

      //You can set markets from here sha
      _.forEach(bases, (base) => {
          if(!_.includes(this.market, base)){
            this.markets.concat(bases);
          };
      });

      let checksymb = _.permutations(bases, 2);
      let toCheckSymb = [];
      _.forEach(checksymb, (value) => {
         let symb = value.join('-');
         toCheckSymb.push(symb);

      });

      // console.log('tt');
      // console.log(toCheckSymb);
      let checkedSymbols = this._checkSymbols(toCheckSymb);
      // console.log('ddd');
      // console.log(checkedSymbols);
      _.forEach(checkedSymbols, function(value2){
        //check if pairs in order BTC-USDT, LTC-BTC, LTC-USDT
        if(value2.split('-')[0] !== value[0].split('-')[1]) return;

        let tradePairA = value2;
        let tradePairB = value[0];
        let tradePairC = value[1];

        //generate triange
        triangles.push([tradePairA,tradePairB,tradePairC]);
      });
    });
   // console.log(triangles);
   return triangles;
 };

  _checkSymbols = (symbols) => {
    let trueSymbols = [];
    _.forEach(symbols, (value) => {
      let check = _.includes(this.symbols, value)
      if(check){
        trueSymbols.push(value);
      }

    });
    return trueSymbols;
  };



  _saveFile = async (data, filePath) => {
    // file path example "./alphabet.json"
    let jsonContent = JSON.stringify(data);
    await fs.writeFile(filePath, jsonContent, 'utf8', function (err) {
      if (err) {
      console.log(err);
      return false;
    }
    console.log("The file was saved!");
    return true;
    });
  };


}

export default T_ArbitrageMetadata;
