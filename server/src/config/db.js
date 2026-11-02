const net = require('net');
const dns = require('dns');
const { PrismaClient } = require('@prisma/client');

let realPrisma = null;
let bridgeServer = null;
let initPromise = null;

/**
 * Initializes Prisma with resilient DNS resolution.
 * If local ISP router refuses DNS for cloud endpoints (e.g. *.neon.tech on Jio/Airtel),
 * it transparently bridges the connection via Google DNS (8.8.8.8) loopback.
 */
function ensureReady() {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const rawUrl = process.env.DATABASE_URL;
    if (!rawUrl) {
      realPrisma = new PrismaClient();
      return realPrisma;
    }

    try {
      const parsed = new URL(rawUrl);
      const host = parsed.hostname;

      // In production (Render, Vercel, Docker) or localhost, use standard connection directly
      if (process.env.NODE_ENV === 'production' || process.env.RENDER || host === 'localhost' || host === '127.0.0.1') {
        realPrisma = new PrismaClient({
          datasources: { db: { url: rawUrl } }
        });
        return realPrisma;
      }

      // Check if system DNS resolves host
      const systemResolves = await new Promise((resolve) => {
        dns.lookup(host, (err) => resolve(!err));
      });

      if (systemResolves) {
        realPrisma = new PrismaClient({
          datasources: { db: { url: rawUrl } }
        });
        return realPrisma;
      }

      console.log(`📡 Local router DNS blocked ${host} -> Establishing resilient bridge via 8.8.8.8...`);

      // Fallback: Resolve using public DNS
      const resolver = new dns.promises.Resolver();
      resolver.setServers(['8.8.8.8', '1.1.1.1']);
      const addresses = await resolver.resolve4(host);
      const targetIp = addresses[0];

      // Start local loopback TCP bridge
      bridgeServer = net.createServer((socket) => {
        const client = net.connect(5432, targetIp);
        socket.pipe(client).pipe(socket);
        client.on('error', () => {});
        socket.on('error', () => {});
      });

      // Keep process from hanging on shutdown
      bridgeServer.unref();

      await new Promise((resolve) => {
        bridgeServer.listen(0, '127.0.0.1', () => {
          const bridgePort = bridgeServer.address().port;
          console.log(`✅ Resilient PostgreSQL bridge active on 127.0.0.1:${bridgePort} -> Neon (${targetIp}:5432)`);

          // Route Neon project endpoint ID if applicable
          const endpointMatch = host.match(/^(ep-[a-z0-9-]+?)(?:-pooler)?\./);
          const endpointParam = endpointMatch ? `&options=endpoint%3D${endpointMatch[1]}` : '';

          const localUrl = `postgresql://${parsed.username}:${parsed.password}@127.0.0.1:${bridgePort}${parsed.pathname}${parsed.search}${endpointParam}`;

          realPrisma = new PrismaClient({
            datasources: { db: { url: localUrl } }
          });

          resolve();
        });
      });

      return realPrisma;
    } catch (err) {
      console.warn('⚠️ Resilient bridge fallback warning, using standard PrismaClient:', err.message);
      realPrisma = new PrismaClient();
      return realPrisma;
    }
  })();

  return initPromise;
}

// Start discovery immediately in background
ensureReady().catch((e) => console.error('Database bridge init error:', e));

// Graceful cleanup
process.on('beforeExit', async () => {
  if (realPrisma) await realPrisma.$disconnect().catch(() => {});
  if (bridgeServer) bridgeServer.close();
});

// Resilient Proxy to allow immediate property and method access across all controllers
const prismaProxy = new Proxy({}, {
  get(target, prop) {
    if (prop === 'then') return undefined;
    if (prop === '$isReady') return () => ensureReady();

    return new Proxy(() => {}, {
      get(subTarget, subProp) {
        return async (...args) => {
          const client = await ensureReady();
          const delegate = client[prop];
          if (!delegate) {
            throw new Error(`Prisma delegate '${String(prop)}' not found.`);
          }
          if (typeof delegate[subProp] === 'function') {
            return delegate[subProp](...args);
          }
          return delegate[subProp];
        };
      },
      apply(subTarget, thisArg, args) {
        return (async () => {
          const client = await ensureReady();
          if (typeof client[prop] === 'function') {
            return client[prop](...args);
          }
          return client[prop];
        })();
      }
    });
  }
});

module.exports = prismaProxy;
