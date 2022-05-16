import axios from "axios";
const fs = require("fs");
const _ = require("lodash");
const axios = require("axios");
import T_ArbitrageMetadata from "../../strategy/T_ARB_metadata";
import Spotter from "../../strategy/spotter";

//initialize axios client as trading Client
const tdClient = () =>
  axios.create({
    baseURL: "https://api.kucoin.com",
    // ...config,
  });

//This function is spots the arbitrage opportunities
export async function spotArbitrage(spotCount = 10, trianglesClient = []) {
  let response;
  let tickers = [];
  let triangles = [];
  let tradingFees = []; //usdt 0.001, kcs 0.0008;
  const filePath = "./metadata/arbitrage/kucoin/triangles.json";
  const filePathTradeFees = "./metadata/arbitrage/kucoin/tradefees.json";

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
  const tickersData = await tdClient.get("/api/v1/market/allTickers");
  tickers = tickersData.data.ticker;
  // console.log(tickers);
  const spotter = new Spotter(triangles, tickers, tradingFees, spotCount);
  let data = spotter.spotArbitrage();

  response = { data: data };
  // console.log(response.data);
  return response;
}

// /** Generates Arbitragetriangles*/
export async function generateTriangles() {
  let response;
  let currencies = [];
  let symbols = [];
  let tradeFees = [];
  const filePathA = "./metadata/kucoin/triangles.json";
  const filePathB = "./metadata/kucoin/tradefees.json";

  const currenciesData = await tdClient().get("/api/v1/currencies");
  const symbolsData = await tdClient().get("/api/v1/symbols");

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
      let feesData = await tdClient().get("/api/v1/trade-fees?symbols=symbols");

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
  };

  console.log(response.data);
  return response;
}
