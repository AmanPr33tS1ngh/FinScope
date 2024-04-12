export const EXCHANGES = [
  "PNK",
  "NASDAQ",
  "NYSE",
  "BSE",
  "XETRA",
  "LSE",
  "AMEX",
  "HKSE",
  "JPX",
  "ASX",
  "SHZ",
  "NSE",
  "EURONEXT",
  "SHH",
  "TSX",
];

export const ADJ_CLOSE = { value: "adjClose", label: "ADJUSTED CLOSE" };
export const HIGH = { value: "high", label: "HIGH" };
export const LOW = { value: "low", label: "LOW" };
export const CLOSE = { value: "close", label: "CLOSE" };
export const OPEN = { value: "open", label: "OPEN" };

export const SERIES_OPTIONS = [ADJ_CLOSE, HIGH, LOW, CLOSE, OPEN];

export const ONE_MIN = { value: "1min", label: "1 Min" };
export const FIVE_MIN = { value: "5min", label: "5 Min" };
export const FIFTEEN_MIN = { value: "15min", label: "15 Min" };
export const THIRTY_MIN = { value: "30min", label: "30 Min" };
export const ONE_HOUR = { value: "1hour", label: "1 Hour" };
export const FOUR_HOUR = { value: "4hour", label: "4 Hour" };

export const TIMEFRAME_OPTIONS = [
  ONE_MIN,
  FIVE_MIN,
  FIFTEEN_MIN,
  THIRTY_MIN,
  ONE_HOUR,
  FOUR_HOUR,
];

export const CRYPTO_NEWS = { label: "CRYPTO NEWS", value: "crypto_news" };
export const PRESS_RELEASES = {
  label: "PRESS RELEASES",
  value: "press-releases",
};
export const FOREX_NEWS = {
  label: "FOREX NEWS",
  value: "forex_news",
};
export const RSS_FEED = {
  label: "STOCK NEWS RSS FEED",
  value: "stock-news-sentiments-rss-feed",
};

export const STOCK_NEWS = {
  label: "STOCK NEWS",
  value: "stock_news",
};

export const GENERAL_NEWS = {
  label: "GENERAL NEWS",
  value: "general_news",
};

export const NEWS_TYPE = [
  CRYPTO_NEWS,
  PRESS_RELEASES,
  FOREX_NEWS,
  RSS_FEED,
  STOCK_NEWS,
  GENERAL_NEWS,
];
