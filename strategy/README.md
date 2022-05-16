How it works for TRIANGULER
1. get all the currencies available
2. get all the symbols available
3. analyze the exchange to see the popular existing
base currencies... e.g BTC,USDT
4. permuted between popular currencies to get a symbols - BTC-USDT, USDT-BTC
5. check to know if the permuted symbols exist. - True
6. collect the ones that exist and save. - Save in json file sha

next
1. for every currency(e.g LTC), get all the symbols that they exist
as quote currency. - LTC-BTC, LTC-USDT
2. permuted to pair them together and save. - LTC-BTC|LTC-USDT, LTC-USDT|LTC-BTC
3. for every permuted result, extract there base currency - BTC|USDT,USDT|LTC
4. convert this extracted base(one for each) to a symbol,
which would be a two way symbol.- BTC-USDT, USDT-BTC
5. search to see if the newly formed symbol exists in the
list of the 'base pairs' - TRUE
6. if it does exist, then:

  a. trade pair A --- base pair - BTC-USDT
  b. trade pair B --- the symbol with first currency of base pair - LTC-BTC
  c. trade pair C --- the symbol with second currency of base pair - LTC-USDT

7. Final result [BTC-USDT,LTC-BTC,LTC-USDT]

8. save the results in a json file.

HOW IT WORKS FOR SPOTTER
1. get triangles to spot
2. get how many spots to returns
3. get the tickers for the symbols
4. for each triangle, calculate the cross rates involved
for first order path and for second order path
5. calculate and append the percentage profit for each triangle. order by this percent
if better.
5. add to the spotted list
6. order the spotted list
7. return the spot count from the spotted list.
