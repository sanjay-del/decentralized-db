export const AppConfig = {
    app: {
        domain: process.env.DOMAIN || "http://localhost:4005",
        port: process.env.PORT || "4005",
      },
      ipfs: {
        repo: process.env.IPFS_REPO || "./ipfs",
        apiAddress: process.env.IPFS_API_ADDRESS || "/ip4/127.0.0.1/tcp/5001",
      },
      orbitdb: {
        repo: process.env.ORBITDB_REPO || "./orbitdb",
        databases: {
            userInfo: process.env.USER_INFO_ADDRESS || '/orbitdb/zdpuAqoS1CN7tjBKn9CAtXWBRXzHTFwzKzSTa46UHERFHJpaG/user-info',
            paymentInfo: process.env.PAYMENT_INFO_ADDRESS || '/orbitdb/zdpuAtJd7Gte1JHdsQvpMPmxfif85NEFD7fFha3mhwU7FH2xq/payment-info',
        },
      },
}