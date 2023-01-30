import "dotenv/config";
import {fastify,  FastifyInstance } from "fastify"
import { AppConfig } from "./config.js"
import { addBusinessDocs, findBusinessDocId } from "./controller/business-docs.controller.js";
import { addPayment, findPaymentInfo, getAllPayment } from "./controller/payment-info.controller.js";
import { findUserInfo, getAll, registerUser } from "./controller/user-info.controller.js";
import { DBManager } from "./db-manager.js";
import { businessDocsRepository, paymentInfoRespository, userInfoRepository } from "./setup.js";

const server: FastifyInstance = fastify()
server.get("/user-info/:username",findUserInfo)
server.get("/get-all-info", getAll)
server.post("/write-info",registerUser)
server.get("/payment-info/:user",findPaymentInfo)
server.get("/get-all-payments",getAllPayment)
server.post("/add-payments",addPayment)
server.get("/find-business-docs",findBusinessDocId)
server.post("/add-business-docs",addBusinessDocs)
server.listen (AppConfig.app.port,"0.0.0.0",100000,async()=>{
  console.log('starting')  
  const manager = new DBManager()
    await manager.connect()
      await userInfoRepository.init(manager, AppConfig.orbitdb.databases.userInfo)
      await paymentInfoRespository.init(
        manager,
        AppConfig.orbitdb.databases.paymentInfo,
      )
      await businessDocsRepository.init(
          manager,
          AppConfig.orbitdb.databases.businessDocs,
        )
      const nodeIdentity = await manager.node.id()
      console.log(`IPFS PeerID: ${nodeIdentity.id}`)
      console.log(`Databases:`, {
          userInfo: userInfoRepository.database.address.toString(),
          paymentInfo: paymentInfoRespository.database.address.toString(),
          businessDocs: businessDocsRepository.database.address.toString()
      })
      console.log(`Ipfs main node started at ${AppConfig.app.domain}`) 
})