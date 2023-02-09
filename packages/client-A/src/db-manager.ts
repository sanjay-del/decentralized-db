import { AppConfig } from "./config.js"
import * as IpfsClient from "ipfs-http-client";
import OrbitDB from "orbit-db";
import {CID} from "multiformats"
export class DBManager{
    node:any
    orbitDB:any
    private defaultOptions = {
        replicate: true, 
        accessController: {
          type: "orbitdb",
          write: ["*"],
        },
      } 
    async connect(){
        try {
            this.node = await IpfsClient.create(AppConfig.ipfs.apiAddress)
            this.orbitDB = await OrbitDB.createInstance(this.node,{
                directory: AppConfig.orbitdb.repo,
              })
            console.log('orbitdb instance created...')
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    async openDatabase(dbName:string, options:any = {}){
        try {
          const db = await this.orbitDB.docs(dbName,{
            ...this.defaultOptions,
            ...options
          })
          await db.load()
          console.log("Db opened at", db.address.toString())
          return db;
        } catch (e: any) {
          console.log(e)
          throw e
        }
     }
     async loadDatabase(address: string){
      try{
        const db = await this.orbitDB.docs(address)
        await new Promise<void>((ok, fail)=>{
          db.events.on("replicated", async()=>{
            console.log("Database replicated loading ")
            try{
              await db.load()
            } catch(err){
            fail(err)
            }
          })
          db.events.on("ready", async()=>{
            console.log("Database ready")
            ok()
          })
        })
        return db
      }
      catch(e:any){
        console.log(e)
        throw e
      }
     }
    async put (db:any, payload:any){
      try {
        const cidStr = await db.put(payload, {pin:true})
        const cid = CID.parse(cidStr)
        const content = await this.node.dag.get(cid)
        console.log(content.value.payload)
      } catch (e:any) {
        console.log(e)
        throw e
      }
    }
    query (db:any, callback:(doc:any)=> boolean){
      try {
        const res = db.query(callback)
        console.log("Result", res)
        return res
      } catch (e:any) {
        console.log(e)
        throw e
      }
    }
    get (db:any, key:string){
      try {
        const res = db.get(key)
        console.log(`Result count : ${res.length}`)
        return res
      } catch (e) {
        console.log(e)
        throw e
      }
    }
}