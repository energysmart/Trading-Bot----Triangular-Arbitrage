This is My Cryptocurrency Triangular Arbitrage Trading Bot. @autho Onwuka Victor
This bot has been carefully built up to the point of being able to spot Arbitrage Opportunities on the Cryptocurrency Exchange called [Kucoin](https://kucoin.com) Using the [kucoin API documentation](https://docs.kucoin.com).

- Also, the [kucoin Node.js SDK](https://github.com/Kucoin/kucoin-node-sdk)

## NOTE:

THIS PROJECT IS ONLY PART OF A LARGER PROJECT AIMED AT AUTOMATING EVERYTHING TRADING AND MAKING IT ACCESSIBLE TO MANY. The larger project is hosted on a Private Repository. If you wish to contribute to the larger Project or have access to the team, Message Me (+23408087118129 Whatsapp or email onwukavictoronwuka@gmail.com)

## Tech Stack Used

the tech stack used are all Javascript for now. They include:

- TypeScript
- React.js
- Node.js
- Next.js
- Material UI for React
- NPM packages installed

## How To Run This Project

First, clone the Repositories. Make sure you have a suitable editor for javascript and Node.js. Also, you must have Node.js installed in your computer.

Next: Run the following command on your terminal (project root) to install the needed NPM packages

```bash
npm install
# or
yarn install
```

after the installations are complete, run:

```bash
npm run dev
# or
yarn dev
```

Open [https://localhost:3000](http://localhost:3000) with your browser to see the result.

First, you need to create an account with kucoin exchange to generate your own API key which is added at ./exchanges/kucoin/myconfig.js

```

export const config = {
baseUrl: "https://api.kucoin.com",
apiAuth: {
key: "xxxxxxxxxxxxxxxxxxxxxx", // KC-API-KEY
secret: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", // API-Secret
passphrase: "SPOT_T_ARBITRAGE", // KC-API-PASSPHRASE
},
authVersion: 2, // KC-API-KEY-VERSION. Notice: for v2 API-KEY, not required for v1 version.
};

```

Next, generate The metadatas ( Triangles.json and Tradefees.json ) by clicking the generate metadata button.

You can start spotting Triangular Arbitrage Opportunities by clicking Start spotting Arbitrage button

Thanks For Checking out this Project. Please Contribute.

## Follow me on Twitter and Medium

= My Twitter Page - [Onwuka Victor@MrOvos](https://twitter.com/MrOvos)

- I also write on Medium. Stories on Programing and Cryptocurrency and Startups on my [Medium](https://medium.com/@MrOvos) blog.

## You may want to learn Next.js Bellow

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
