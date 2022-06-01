// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { generateTriangles, spotArbitrage } from "../../exchanges/kucoin/rest";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  var response = null;
  const { call } = req.query;
  console.log(call);

  if (req.method === "GET" && call === "generate_meta") {
    response = await generateTriangles();
    console.log(response);
  }
  if (req.method === "GET" && call === "spot_arbitrage") {
    response = await spotArbitrage(10, []);
    // console.log(response);
  }

  res.status(200).json(response);
}
