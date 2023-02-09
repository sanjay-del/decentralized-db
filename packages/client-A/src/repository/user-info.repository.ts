
import {DBManager} from "../db-manager.js"

export type storedInfo = {
    email: string
    adddress: string
    username: string
    created: number
    updated: number
}

export class userInfo {
    private manager ?: DBManager
    database: any
    async init(manager:DBManager, address?:string):Promise<void>{
        this.manager = manager
        if(address){
            this.database = await this.manager.loadDatabase(address)
        }else {
            this.database = await this.manager.openDatabase("user-info",{
                indexBy:"username",
            })
        }
    }
    async getLatest(username: string): Promise<storedInfo | undefined>{
        if(!this.manager){
            throw new Error("Db Manger is not initialized")
          }  
        const result : storedInfo[] = await this.manager.query(this.database,
                (doc)=>{
                    return doc.username === username
                },
                )
        if(!result.length) return undefined
        const userInfo = result.sort((doc)=>doc.updated).reverse()
        return userInfo[0]
    }
    async getAll(): Promise<storedInfo[]>{
        if(!this.manager){
            throw new Error("DBManger not initialized")
        }
        return this.manager.get(this.database,"")
    }
    async save(args:{
        email: string
        address: string
        username: string
        created: number
    }): Promise<void>{
        if(!this.manager) throw new Error("DBManger is not initialized");
        const info = {
            email: args.email,
            address: args.address,
            username: args.username,
            created: new Date(args.created).getTime(),
            updated: new Date().getTime()
        }
        await this.manager.put(this.database,info)
    }
}