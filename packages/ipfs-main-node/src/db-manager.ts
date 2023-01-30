import fse from "fs-extra"
import { AppConfig } from "./config.js"
import {create } from "ipfs-core"
import OrbitDB from "orbit-db"
import {CID} from "multiformats"
import {generateKey, preSharedKey} from "libp2p/pnet"

export class DBManager{
    node: any
    orbitDB : any
    private defaultOptions = {
        replicate :true,
        accessController:{
            type: "orbitdb",
            write: ["*"]
        },
    }
    async connect (){
        try {
            await this.removeLockIfExist()
            await this.createSwarmKey()
            const swarmKey = await fse.readFile(AppConfig.ipfs.swarmKeyFile)
            let ipfsConfig: any = {
              repo: AppConfig.ipfs.repo,
              EXPERIMENTAL: {
                pubsub: true,
              },
              config: {
                Bootstrap: [],
                Addresses: {
                  API: "/ip4/0.0.0.0/tcp/5001",
                  Swarm: [
                    "/ip4/0.0.0.0/tcp/4002",
                    "/ip4/0.0.0.0/udp/4002/quic",
                    "/ip4/0.0.0.0/tcp/4003/ws",
                  ],
                },
              },
              libp2p: {
                connectionProtector: preSharedKey({
                  psk: swarmKey
                })
              },
            }
            this.node = await create(ipfsConfig)
            await this.node.config.profiles.apply("server")
            await this.node.bootstrap.clear()
    
            this.handleGracefulStop()
            this.node.libp2p.connectionManager.addEventListener("peer:connect", (peer: any) => {
                console.log(`Peer connected: ${peer.remotePeer.toB58String()}`)
              })
      
              this.node.libp2p.connectionManager.addEventListener(
                "peer:disconnect",
                (peer: any) => {
                  console.log(`Peer disconnected: ${peer.remotePeer.toB58String()}`)
                },
              )
              console.log("IPFS node connected.")

              this.orbitDB = await OrbitDB.createInstance(this.node, {
                directory: AppConfig.orbitdb.repo,
              })
              console.log("OrbitDB instance created..")
        } catch (e:any) {
            console.log(e)
        }
    }
    async openDatabase(dbName: string, options: any = {}) {
        try {
          const db = await this.orbitDB.docs(dbName, {
            ...this.defaultOptions,
            ...options,
          })
          await db.load()
          console.log("Database opened at:", db.address.toString())
          return db
        } catch (e: any) {
          throw e
        }
      }
      async loadDatabase(address: string) {
        try {
          const db = await this.orbitDB.docs(address)
          await new Promise<void>((ok, fail) => {
            db.events.on("replicated", async () => {
            console.log("Database replicated. Loading...")
              try {
                await db.load()
              } catch (err) {
                fail(err)
              }
            })
            db.events.on("ready", async () => {
            console.log("Database ready.")
              ok()
            })
          })
    
          return db
        } catch (e: any) {
          throw e
        }
      }
      async put(db: any, payload: any) {
        try {
          const cidStr = await db.put(payload, { pin: true })
          const cid = CID.parse(cidStr)
    
          const content = await this.node.dag.get(cid)
          console.log(content.value.payload)
        } catch (e: any) {
          throw e
        }
      }
      query(db: any, callback: (doc: any) => boolean) {
        try {
          const res = db.query(callback)
          console.log("Query result:", res)
          return res
        } catch (e: any) {
          throw e
        }
      }
    
      get(db: any, key: string) {
        try {
          const res = db.get(key)
          console.log(`Query result count: ${res.length}`)
          return res
        } catch (e: any) {
          throw e
        }
      }
    
      async createSwarmKey() {
        const isDirectoryExist = await fse.pathExists(AppConfig.ipfs.swarmKeyFile)
        if (isDirectoryExist) {
        console.log("Swarm key already exist. Skipping creation.")
          return
        }
    
        try {
          const swarmKey = Buffer.alloc(95)
          generateKey(swarmKey)
          await fse.writeFile(AppConfig.ipfs.swarmKeyFile, swarmKey)
          console.log(`Swarm key created at: ${AppConfig.ipfs.swarmKeyFile}`)
        } catch (e: any) {
          throw e
        }
      }
      private async removeLockIfExist() {
        const lockfile = `${AppConfig.ipfs.repo}/repo.lock`
        const isLockExist = await fse.pathExists(lockfile)
        if (isLockExist) {
          await fse.remove(lockfile)
        }
      }
    
      private handleGracefulStop() {
        const stop = async () => {
          try {
            await this.node.stop()
          } catch (e: any) {
            console.log(e.message)
          }
          process.exit()
        }
        process.on("SIGTERM", stop)
        process.on("SIGINT", stop)
        process.on("SIGHUP", stop)
        process.on("uncaughtException", stop)
      }
}