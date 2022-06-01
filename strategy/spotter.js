const _ = require("lodash");
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// NOTE: Ask always greater than bid... the are cases
// both can be equal. but Bid is never > Ask

class Spotter {
  triangles = [];
  spotCount = 100;

  // tickers contain bothe the symbol
  // and besk ask and bid along other important Data
  //takerfeeRate and makerfeeRate
  tickers = [];

  tradingFees = [];

  constructor(triangles, tickers, tradingFees, spotCount) {
    this.triangles = triangles;
    this.tickers = tickers;
    this.spotCount = spotCount;
    this.tradingFees = tradingFees;
    // this.markets = markets;

    /** bind function */
  }

  /**
   *@name spotArbitrage
   *@author Onwuka Victor https://twitter.com/MrOvos
   *@description spots the arbitrage opportunities
   *@param {number} spotCount - the number of spotted, to return
   *@param {Array} trianglesClient - list of triangules to spot from
   *@return {Object} {triangle, profitPercent, feeRate, crossRate, orderPaths, paths}
   * - {Array} triangle - list of symbols to trade
   * - {number}profitPercent - percentage profit
   * - {number} feeRate - the combined fee rates of the trade. taker and maker fees
   * - {number} crossRate - the combined cross rate of the trade/ triangle
   * - {number} orderPaths - the other the trade was executed
   * - {number} paths - how many parts the trade undergoed
   */
  spotArbitrage = () => {
    let spotList = [];
    let triangles = this.triangles;
    let orderPaths = [1, 2]; // no 3: I removed 3 orderpath as it is similar to 2 op.
    _.forEach(triangles, (triangle) => {
      _.forEach(orderPaths, (orderPath) => {
        let crossRateData = this._calcCrossRate(orderPath, triangle);
        // console.log(crossRateData);
        spotList.push({ ...crossRateData, triangle: triangle });
      });
    });

    let orderedSpotList = _.orderBy(spotList, ["crossRate"], ["desc"]);
    // console.log(orderedSpotList);

    return orderedSpotList.slice(0, this.spotCount);
  };

  /**
   *@name _getAskBid
   *@author Onwuka Victor https://twitter.com/MrOvos
   *@description returns the asks and bids of triangles
   *@param {Array} triangle - list of symbols trade
   *@param {number} orderPath - the order the trade the triangle
   *@return {Array} AskBid - a list of the ask or bid of symbols in the triangle
   */
  _getAskBid = (triangle, orderPath) => {
    let AskBid = [];

    if (orderPath === 1) {
      let tickers = [];
      _.forEach(triangle, (symbol) => {
        // console.log(symbol);
        _.find(this.tickers, (ticker) => {
          if (ticker.symbol == symbol) {
            tickers.push(ticker);
          }
        });
      });
      // this is specific for kucoin. make changes for other exchanges
      // it should be Ask, Ask , Bid (Buy, Buy, Sell)
      AskBid = [tickers[0].sell, tickers[1].sell, tickers[2].buy];
    }
    if (orderPath === 2) {
      let tickers = [];
      _.forEach(triangle, (symbol) => {
        _.find(this.tickers, (ticker) => {
          if (ticker.symbol == symbol) {
            tickers.push(ticker);
          }
        });
      });
      // this is specific for kucoin. make changes for other exchanges
      // it should be Ask, Bid , Bid  (Buy, Sell, Sell)
      AskBid = [tickers[2].sell, tickers[1].buy, tickers[0].buy];
    }

    if (orderPath === 3) {
      let tickers = [];
      _.forEach(triangle, (symbol) => {
        _.find(this.tickers, (ticker) => {
          if (ticker.symbol == symbol) {
            tickers.push(ticker);
          }
        });
      });
      // this is specific for kucoin. make changes for other exchanges
      // it should be Ask, Bid , Ask  (Buy, Sell, Buy)
      AskBid = [tickers[1].sell, tickers[2].buy, tickers[0].sell];
    }

    return AskBid;
  };

  /**
   *@name _calcCrossRate
   *@author Onwuka Victor https://twitter.com/MrOvos
   *@description calculates the cross rate of a triangle
   *@param {number} orderPath - the order the trade the triangle
   *@param {Array} triangle - list of symbols trade
   *@return {Object} {profitPercent, feeRate, crossRate, orderPaths, paths}
   * - {number}profitPercent - percentage profit
   * - {number} feeRate - the combined fee rates of the trade. taker and maker fees
   * - {number} crossRate - the combined cross rate of the trade/ triangle
   * - {number} orderPaths - the other the trade was executed
   * - {number} paths - how many parts the trade undergoed
   */
  _calcCrossRate = (orderPath, triangle) => {
    let AskBid = this._getAskBid(triangle, orderPath);
    let crossRate;
    let profitPercent = 0;
    let feeRateAndPaths = this._getFeeRateAndPaths(triangle, orderPath);
    let feeRate = feeRateAndPaths.feeRate;
    let paths = feeRateAndPaths.paths;

    if (orderPath === 1) {
      crossRate = (1 / AskBid[0]) * (1 / AskBid[1]) * AskBid[2];
    }
    if (orderPath === 2) {
      crossRate = (1 / AskBid[0]) * AskBid[1] * AskBid[2];
    }
    if (orderPath === 3) {
      crossRate = (1 / AskBid[0]) * AskBid[1] * (1 / AskBid[2]);
    }

    if (crossRate > 1 && crossRate > feeRate) {
      console.log("profitable");
      profitPercent = ((crossRate - feeRate) / feeRate) * 100;
      // profitPercent = this._calProfitability(triangle, AskBid, paths, orderPath);
    }

    return {
      feeRate: feeRate,
      crossRate: crossRate,
      profitPercent: profitPercent,
      orderPath: orderPath,
      paths: paths,
    };
  };

  /**
   *@name _calProfitability
   *@author Onwuka Victor https://twitter.com/MrOvos
   *@description calculates the profit possible
   *@param {number} orderPath - the order the trade the triangle
   *@deprecated this was no longer used
   */
  _calProfitability = (triangle, AskBid, paths, orderPath) => {
    let profitPercent;
    let investmentCurrencySize = 10; // 10USDT or feerate??
    let startCurrrencySize;
    let pairASize;
    let pairBSize;
    let pairCSize;

    let quotePath5Order2 = [triangle[0].split("-")[1], "USDT"].join("-");
    let quotePath5Order3 = [triangle[1].split("-")[1], "USDT"].join("-");

    let invtCurrencyStartCurrencySymbol =
      orderPath === 3 ? quotePath5Order3 : quotePath5Order2;
    let invtCurrencyAskBid = _.find(this.tickers, (ticker) => {
      if (ticker.symbol == invtCurrencyStartCurrencySymbol) {
        //specific for kucoin as (Buy)
        return ticker.sell;
      }
    });

    rl.question(
      "What is" +
        invtCurrencyStartCurrencySymbol +
        invtCurrencyAskBid +
        " your name ? ",
      (name) => {
        rl.close();
      }
    );

    //as USDT-USDT NEVER EXISTS. though usdt/btc or something else may sha...
    if (paths === 5 && invtCurrencyAskBid) {
      startCurrrencySize = investmentCurrencySize / invtCurrencyAskBid;
    } else {
      startCurrrencySize = investmentCurrencySize;
    }

    if (orderPath === 1) {
      pairASize = startCurrrencySize / AskBid[0];
      pairBSize = pairASize / AskBid[1];
      pairCSize = pairBSize * AskBid[2];
      profitPercent =
        ((pairCSize - startCurrrencySize) / startCurrrencySize) * 100;
    }

    if (orderPath === 2) {
      pairASize = startCurrrencySize / AskBid[0];
      pairBSize = pairASize * AskBid[1];
      pairCSize = pairBSize * AskBid[2];
      profitPercent =
        ((pairCSize - startCurrrencySize) / startCurrrencySize) * 100;
    }

    if (orderPath === 3) {
      pairASize = startCurrrencySize / AskBid[0];
      pairBSize = pairASize * AskBid[1];
      pairCSize = pairBSize / AskBid[2];
      profitPercent =
        ((pairCSize - startCurrrencySize) / startCurrrencySize) * 100;
    }

    return profitPercent;
  };

  /**
   *@name _getFeeRateAndPaths
   *@author Onwuka Victor https://twitter.com/MrOvos
   *@description the symbol passed here is for tradpairA
   *@param {Array} triangle - list of symbols trade
   *@param {number} orderPath - the order the trade the triangle
   *@return {Object} {feeRate, paths}
   * - {number} feeRate - the combined fee rates of the trade. taker and maker fees
   * - {number} paths - how many parts the trade undergoed
   */
  _getFeeRateAndPaths = (triangle, orderPath) => {
    let feeRate;
    let paths = 3;
    let symb = orderPath === 3 ? triangle[1] : triangle[0];
    let quote = symb.split("-")[1];
    if (quote !== "USDT") {
      paths = 5;
    }
    let feelist = [];
    let takes =
      orderPath === 1
        ? ["makerFeeRate", "makerFeeRate", "takerFeeRate"]
        : ["makerFeeRate", "takerFeeRate", "takerFeeRate"];

    _.forEach(triangle, (symbol) => {
      if (symbol == triangle[0]) {
        _.find(this.tradingFees, (tradeFee) => {
          if (tradeFee.symbol == symbol) {
            let take = takes[0];
            feelist.push(tradeFee[take]);
          }
        });
      }
      if (symbol == triangle[1]) {
        _.find(this.tradingFees, (tradeFee) => {
          if (tradeFee.symbol == symbol) {
            let take = takes[1];
            feelist.push(tradeFee[take]);
          }
        });
      }
      if (symbol == triangle[2]) {
        _.find(this.tradingFees, (tradeFee) => {
          if (tradeFee.symbol == symbol) {
            //specific for kucoin as (Buy)
            let take = takes[2];
            feelist.push(tradeFee[take]);
          }
        });
      }
    });
    console.log(feelist);
    feeRate = 1 + Number(feelist[0]) + Number(feelist[1]) + Number(feelist[2]);
    if (paths === 5) {
      _.find(this.tradingFees, (tradeFee) => {
        if (tradeFee.symbol == `${quote}-USDT`) {
          feeRate += 2 * tradeFee.makerFeeRate;
        }
      });
    }
    return {
      feeRate: feeRate,
      paths: paths,
    };
  };
}

export default Spotter;
