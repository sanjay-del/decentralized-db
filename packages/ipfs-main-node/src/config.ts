export const AppConfig = {
    app: {
      domain: process.env.DOMAIN || "http://localhost:5007",
      port: process.env.PORT || "5007",
    },
    ipfs: {
      repo: process.env.IPFS_REPO || "./ipfs",
      apiAddress: process.env.IPFS_API_ADDRESS || "/ip4/127.0.0.1/tcp/5001",
      swarmKeyFile: process.env.SWARM_KEY_FILE || "./swarm/swarm.key",
    },
    orbitdb: {
      repo: process.env.ORBITDB_REPO || "./orbitdb",
      databases: {
       userInfo: process.env.USER_INFO_ADDRESS || undefined,
       paymentInfo: process.env.PAYMENT_INFO_ADDRESS || undefined,
       businessDocs: process.env.BUSINESS_INFO_ADDRESS || undefined,
      },
    },
  }
  