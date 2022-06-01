const fs = require("fs");
const _ = require("lodash");
import T_ArbitrageMetadata from "../../strategy/T_ARB_metadata";
import Spotter from "../../strategy/spotter";
import { config } from "./myconfig";

/** Require SDK */
const API = require("kucoin-node-sdk");

/** Init Configure */
API.init({ ...config });

/**
 *@name spotArbitrage
 *@author Onwuka Victor https://twitter.com/MrOvos
 *@description spots the arbitrage opportunities
 *@param {number} spotCount - the number of spotted, to return
 *@param {Array} trianglesClient - list of triangules to spot from
 *@return {Object} {data, success}
 * - {Array} data - list of objects - triangle, profitPercent, feeRate, crossRate, orderPaths, paths
 * - {Boolean} success - true or false
 */
export async function spotArbitrage(spotCount = 10, trianglesClient = []) {
  let response;
  let tickers = [];
  let triangles = [];
  let tradingFees = []; //usdt 0.001, kcs 0.0008;
  const filePath = "./metadata/kucoin/triangles.json";
  const filePathTradeFees = "./metadata/kucoin/tradefees.json";

  // get trading fees from metadata json file;
  fs.readFile(filePathTradeFees, function (err, data) {
    // Check for errors
    if (err) throw err;
    // Converting to JSON
    const tradefeesData = JSON.parse(data);

    _.forEach(tradefeesData.tradefees, (tradefee) => {
      tradingFees.push(tradefee);
    });

    // console.log(tradingFees);
  });

  //get triangles from metadata json file
  if (trianglesClient.length == 0) {
    // Read triangles.json file
    fs.readFile(filePath, function (err, data) {
      // Check for errors
      if (err) throw err;
      // Converting to JSON
      const trianglesData = JSON.parse(data);

      _.forEach(trianglesData.triangles, (triangle) => {
        triangles.push(triangle);
      });

      // console.log(triangles);
    });
  } else {
    _.forEach(trianglesClient, (triangle) => {
      triangles.push(triangle[1]); //triangleclient [crossRateData, [...triangle symbols]]
    });
  }
  // console.log(triangles);
  const tickersData = await await API.rest.Market.Symbols.getAllTickers();
  tickers = tickersData.data.ticker;
  // console.log(tickers);
  const spotter = new Spotter(triangles, tickers, tradingFees, spotCount);
  let data = spotter.spotArbitrage();

  response = { data: data, success: true };
  // console.log(response.data);
  return response;
}

/**
 *@name generateTriangles
 *@author Onwuka Victor https://twitter.com/MrOvos
 *@description generates triangles including tradefees and stores them at
 *             "./metadata/kucoin/triangles.json" and "./metadata/kucoin/tradefees.json"
 *             respectively. Used for spotting arbitrage
 *@return {Object} {success, data} - success true or false. data used at frontend
 */
export async function generateTriangles() {
  let response;
  let currencies = [];
  let symbols = [];
  let tradeFees = [];
  const filePathA = "./metadata/kucoin/triangles.json";
  const filePathB = "./metadata/kucoin/tradefees.json";

  const currenciesData = await API.rest.Market.Currencies.getCurrencies();

  const symbolsData = await API.rest.Market.Symbols.getSymbolsList();

  _.forEach(currenciesData.data, (data) => {
    currencies.push(data.currency);
  });

  _.forEach(symbolsData.data, (data) => {
    symbols.push(data.symbol);
  });

  //Get the trade fees
  const getTradeFees = async (symb) => {
    // console.log(symb);
    let fees = [];
    let batch = _.chunk(symb, 9);

    for (const symbols of batch) {
      let feesData = await API.rest.User.TradeFee.getActualFeeRateBySymbols(
        symbols
      );
      console.log(feesData);
      for (const fee of feesData.data) {
        console.log(fee);
        fees.push({
          symbol: fee.symbol,
          takerFeeRate: fee.takerFeeRate,
          makerFeeRate: fee.makerFeeRate,
        });
      }
    }
    return fees;
  };

  // console.log(symbols);
  const metadata = new T_ArbitrageMetadata(currencies, symbols);

  //first run: to set markets
  let triangles_saved = metadata.generateTriangles(filePathA);

  tradeFees = await getTradeFees(symbols);

  let fees_saved = metadata.generateFeeRate(tradeFees, filePathB);
  response = {
    data: {
      triangles_saved: triangles_saved,
      fees_saved: fees_saved,
    },
    suceess: true,
  };
  return response;
}
