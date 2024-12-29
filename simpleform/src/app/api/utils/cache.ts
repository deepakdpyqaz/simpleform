import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 }); // TTL = 60s, check expired every 120s

export default cache;