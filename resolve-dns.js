const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

dns.resolveSrv('_mongodb._tcp.cluster0.omslik6.mongodb.net', (err, addresses) => {
  if (err) {
    console.error('SRV Resolution failed:', err);
    return;
  }
  console.log('SRV Records:', addresses);

  dns.resolveTxt('cluster0.omslik6.mongodb.net', (err, txt) => {
    if (err) {
      console.error('TXT Resolution failed:', err);
      return;
    }
    console.log('TXT Records:', txt);
  });
});
