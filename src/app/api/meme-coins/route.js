// Add your CoinMarketCap API key here
const COINMARKETCAP_API_KEY = '50a83e0742fd4564968ed5c459332980'; // Replace with your actual key

export async function GET() {
  try {
    console.log('Fetching meme coins from CoinMarketCap...');

    let coins = [];

    // Primary Source: CoinMarketCap
    try {
      console.log('Fetching from CoinMarketCap...');
      const cmcResponse = await fetch(
        'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=100&sort=market_cap&sort_dir=desc',
        {
          headers: {
            'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY,
            'Accept': 'application/json'
          },
          cache: 'no-store',
        }
      );

      if (!cmcResponse.ok) {
        throw new Error(`CoinMarketCap API error: ${cmcResponse.status}`);
      }

      const cmcData = await cmcResponse.json();
      
      if (cmcData.data && cmcData.data.length > 0) {
        // Filter for meme coins
        const memeCoins = cmcData.data.filter(coin => {
          const name = coin.name.toLowerCase();
          const symbol = coin.symbol.toLowerCase();
          
          const memeKeywords = [
            'dog', 'shib', 'pepe', 'floki', 'bonk', 'wojak', 'elon', 'samo',
            'hoge', 'kishu', 'akita', 'kabosu', 'shiba', 'inu', 'cat', 'fish',
            'wif', 'bome', 'myro', 'popcat', 'trump', 'wen', 'coq', 'toshi', 'turbo'
          ];
          
          return memeKeywords.some(keyword => 
            name.includes(keyword) || symbol.includes(keyword)
          );
        });

        const cmcTransformed = memeCoins.map(coin => ({
          pairData: {
            baseToken: {
              name: coin.name,
              symbol: coin.symbol
            },
            priceUsd: coin.quote.USD.price,
            priceChange: {
              h24: coin.quote.USD.percent_change_24h
            },
            liquidity: {
              usd: coin.quote.USD.market_cap
            },
            volume: {
              h24: coin.quote.USD.volume_24h
            },
            info: {
              imageUrl: `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`
            },
            url: `https://coinmarketcap.com/currencies/${coin.slug}/`
          }
        }));

        coins = [...coins, ...cmcTransformed];
        console.log(`Added ${cmcTransformed.length} coins from CoinMarketCap`);
      }
    } catch (cmcError) {
      console.log('CoinMarketCap failed:', cmcError.message);
    }

    // Fallback: CoinGecko (no API key needed)
    if (coins.length < 15) {
      try {
        console.log('Falling back to CoinGecko...');
        const geckoResponse = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=meme-token&order=volume_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h',
          {
            headers: { 'Accept': 'application/json' },
            cache: 'no-store',
          }
        );
        
        if (geckoResponse.ok) {
          const geckoData = await geckoResponse.json();
          const geckoCoins = geckoData.map(coin => ({
            pairData: {
              baseToken: {
                name: coin.name,
                symbol: coin.symbol.toUpperCase()
              },
              priceUsd: coin.current_price,
              priceChange: {
                h24: coin.price_change_percentage_24h || 0
              },
              liquidity: {
                usd: coin.market_cap || coin.total_volume * 10
              },
              volume: {
                h24: coin.total_volume || 0
              },
              info: {
                imageUrl: coin.image
              },
              url: `https://www.coingecko.com/en/coins/${coin.id}`
            }
          }));
          
          // Only add coins not already in the list
          geckoCoins.forEach(geckoCoin => {
            if (!coins.find(c => c.pairData.baseToken.symbol === geckoCoin.pairData.baseToken.symbol)) {
              coins.push(geckoCoin);
            }
          });
          console.log(`Added ${geckoCoins.length} coins from CoinGecko`);
        }
      } catch (geckoError) {
        console.log('CoinGecko failed:', geckoError.message);
      }
    }

    // Final fallback: Manual coins
    if (coins.length < 10) {
      console.log('Adding manual meme coins...');
      const manualCoins = generateManualCoins();
      manualCoins.forEach(manualCoin => {
        if (!coins.find(c => c.pairData.baseToken.symbol === manualCoin.pairData.baseToken.symbol)) {
          coins.push(manualCoin);
        }
      });
      console.log(`Added manual coins, total: ${coins.length}`);
    }

    console.log(`Final coin count: ${coins.length}`);

    // Apply randomization to first 10 coins
    const coinsToRandomize = Math.min(10, coins.length);
    const randomizedCoins = coins.map((coin, index) => {
      if (index < coinsToRandomize) {
        const variation = 0.06;
        const randomChange = (Math.random() * variation * 2) - variation;
        const newPrice = Math.max(0.000001, coin.pairData.priceUsd * (1 + randomChange));
        const priceChange = ((newPrice - coin.pairData.priceUsd) / coin.pairData.priceUsd) * 100;
        
        return {
          ...coin,
          pairData: {
            ...coin.pairData,
            priceUsd: newPrice,
            priceChange: {
              h24: priceChange
            },
            liquidity: {
              usd: Math.max(1000, coin.pairData.liquidity.usd * (1 + (Math.random() * 0.1 - 0.05)))
            },
            volume: {
              h24: Math.max(100, coin.pairData.volume.h24 * (1 + (Math.random() * 0.2 - 0.1)))
            },
            _randomized: true
          }
        };
      }
      return coin;
    });

    return new Response(JSON.stringify({ 
      data: randomizedCoins,
      metadata: {
        total: randomizedCoins.length,
        randomized: coinsToRandomize,
        sources: ['CoinMarketCap', 'CoinGecko', 'Manual'],
        timestamp: new Date().toISOString()
      }
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
    });

  } catch (error) {
    console.error('Error:', error);
    
    // Ultimate fallback
    const fallbackCoins = generateManualCoins();
    return new Response(JSON.stringify({ 
      data: fallbackCoins,
      metadata: {
        total: fallbackCoins.length,
        randomized: 10,
        sources: ['Fallback'],
        error: error.message
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

function generateManualCoins() {
  const coins = [
    { symbol: 'DOGE', name: 'Dogecoin', price: 0.15 },
    { symbol: 'SHIB', name: 'Shiba Inu', price: 0.000008 },
    { symbol: 'PEPE', name: 'Pepe', price: 0.0000012 },
    { symbol: 'FLOKI', name: 'Floki', price: 0.000032 },
    { symbol: 'BONK', name: 'Bonk', price: 0.000015 },
    { symbol: 'WIF', name: 'Dogwifhat', price: 0.35 },
    { symbol: 'BOME', name: 'Book of Meme', price: 0.0085 },
    { symbol: 'MYRO', name: 'Myro', price: 0.12 },
    { symbol: 'POPCAT', name: 'Popcat', price: 0.12 },
    { symbol: 'TRUMP', name: 'Trump', price: 1.25 },
    { symbol: 'WEN', name: 'Wen', price: 0.00035 },
    { symbol: 'SAMO', name: 'Samoyedcoin', price: 0.025 },
    { symbol: 'COQ', name: 'Coq Inu', price: 0.00000015 },
    { symbol: 'TOSHI', name: 'Toshi', price: 0.00085 },
    { symbol: 'TURBO', name: 'Turbo', price: 0.0012 },
    { symbol: 'ELON', name: 'Dogelon Mars', price: 0.00000028 },
    { symbol: 'AKITA', name: 'Akita Inu', price: 0.00000018 },
    { symbol: 'KISHU', name: 'Kishu Inu', price: 0.00000000015 },
    { symbol: 'HOGE', name: 'Hoge Finance', price: 0.00012 },
    { symbol: 'LEASH', name: 'Doge Killer', price: 450 },
    { symbol: 'BABYDOGE', name: 'Baby Doge', price: 0.0000000015 },
    { symbol: 'SAITAMA', name: 'Saitama', price: 0.000000025 },
    { symbol: 'CATE', name: 'Catecoin', price: 0.000000015 },
    { symbol: 'BONE', name: 'Shibarium', price: 0.85 },
    { symbol: 'PUDGY', name: 'Pudgy Penguins', price: 4.25 }
  ];

  return coins.map(coin => ({
    pairData: {
      baseToken: {
        name: coin.name,
        symbol: coin.symbol
      },
      priceUsd: coin.price * (0.8 + Math.random() * 0.4),
      priceChange: {
        h24: (Math.random() * 40 - 20)
      },
      liquidity: {
        usd: Math.random() * 5000000 + 1000000
      },
      volume: {
        h24: Math.random() * 3000000 + 500000
      },
      info: {
        imageUrl: `https://s2.coinmarketcap.com/static/img/coins/64x64/${getCoinMarketCapId(coin.symbol)}.png`
      },
      url: `https://coinmarketcap.com/currencies/${coin.name.toLowerCase().replace(/\s+/g, '-')}/`
    }
  }));
}

// Helper function to get approximate CoinMarketCap IDs for images
function getCoinMarketCapId(symbol) {
  const idMap = {
    'DOGE': 74,
    'SHIB': 5994,
    'PEPE': 24478,
    'FLOKI': 9606,
    'BONK': 28301,
    'WIF': 22611,
    'BOME': 25327,
    'MYRO': 27229,
    'POPCAT': 27996,
    'TRUMP': 15256,
    'WEN': 27989,
    'SAMO': 13480,
    'COQ': 26359,
    'TOSHI': 27357,
    'TURBO': 25436,
    'ELON': 9436,
    'AKITA': 9436,
    'KISHU': 9436,
    'HOGE': 9436,
    'LEASH': 9436,
    'BABYDOGE': 9436,
    'SAITAMA': 9436,
    'CATE': 9436,
    'BONE': 9436,
    'PUDGY': 9436
  };
  return idMap[symbol] || 1; // Default to Bitcoin if not found
}
