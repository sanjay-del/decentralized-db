export const AppConfig = {
    app: {
        domain: process.env.DOMAIN || "http://localhost:5005",
        port: process.env.PORT || "5005",
      },
      ipfs: {
        repo: process.env.IPFS_REPO || "./ipfs",
        apiAddress: process.env.IPFS_API_ADDRESS || "/ip4/127.0.0.1/tcp/5001",
      },
      orbitdb: {
        repo: process.env.ORBITDB_REPO || "./orbitdb",
        databases: {
          businessDocs: process.env.BUSINESS_DOCS_ADDRESS || '/orbitdb/zdpuAoUJ34Sz5MxdvpYKbnCV1TRZLaBBGeb18NC1QzaGauKne/business-docs',
        },
      },
}