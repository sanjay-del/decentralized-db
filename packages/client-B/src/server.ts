import "dotenv/config";
import {fastify,  FastifyInstance } from "fastify"
import { AppConfig } from "./config.js"
import { addBusinessDocs, findBusinessDocId } from "./controller/business-docs.controller.js";
import { DBManager } from "./db-manager.js";
import { businessDocsRepository } from "./setup.js";

const server: FastifyInstance = fastify()
server.get("/find-business-docs",findBusinessDocId)
server.post("/add-business-docs",addBusinessDocs)
server.listen (AppConfig.app.port,"0.0.0.0",100000,async()=>{
  console.log('starting')  
  const manager = new DBManager()
    await manager.connect()
      await businessDocsRepository.init(
          manager,
          AppConfig.orbitdb.databases.businessDocs,
        )
      const nodeIdentity = await manager.node.id()
      console.log(`IPFS PeerID: ${nodeIdentity.id}`)
      console.log(`Databases:`, {
          businessDocs: businessDocsRepository.database.address.toString()
      })
      console.log(`Client B started at ${AppConfig.app.domain}`) 
})