import React from "react";
// import ReactCC from '../../developmentBuild';
// import ReactCC from '../../productionBuild';
import ReactCC from "react-component-caching";
import { flushChunkNames } from "react-universal-component/server";
import flushChunks from "webpack-flush-chunks";

import App from "../shared/App";

// can pass in max-size, otherwise defaults to 1 million
const cache = new ReactCC.ComponentCache();
// import redis from "redis";
// const cache = redis.createClient();
// import memcached from 'memcached';
// const cache = new memcached('localhost:11211');

// Force NodeStream
// import createCacheStream from './cacheStream';

const htmlStart =
  '<html><head><title>Page</title></head><body><div id="react-root">';
const htmlEnd = "</div></body></html>";

const streamingStart = {
  sliceStartCount: htmlStart.length
};
/**
 * @param clientStats Parameter passed by hot server middleware
 */
export default ({ clientStats }) => async (req, res) => {
  // Need To Come back To If Statement
  // if(false){
  // const cacheStream = createCacheStream(cache, streamingStart);
  // cacheStream.pipe(res);
  // cacheStream.write(htmlStart);

  // ReactCC.renderToNodeStream(<App />, cache, res);
  // stream.pipe(cacheStream, { end: false });
  // stream.on("end", () => {
  //   cacheStream.end(htmlEnd);
  // });
  // }
  // else if (true){
  const app = <App />;
  const start_cached = process.hrtime();

  const appString = await ReactCC.renderToString(app);
  const end_cached = process.hrtime(start_cached);
  console.info(
    "Cached render time: %ds %dms",
    end_cached[0],
    end_cached[1] / 1000000
  );
  const chunkNames = flushChunkNames();
  const { js, styles, cssHash } = flushChunks(clientStats, { chunkNames });

  res.render("index", {
    appString,
    js,
    styles,
    cssHash
  });
  // }
};
