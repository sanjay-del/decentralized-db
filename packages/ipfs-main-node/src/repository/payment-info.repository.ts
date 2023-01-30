import { DBManager } from "../db-manager.js";
export type paymentInfo= {
    created: number,
    paymentFor:string,
    madeBy: string
}
export class PaymentInfo {
    private manager ?: DBManager
    database: any
    async init(manager:DBManager, address?:string):Promise<void>{
        this.manager = manager
        if(address){
            this.database = await this.manager.loadDatabase(address)
        }else {
            this.database = await this.manager.openDatabase("payment-info",{
                indexBy:"madeBy",
            })
        }
    }
    async getByUser (
        madeBy: string
    ): Promise <{created:number;paymentFor:string;madeBy:string} | undefined>{
        if (!this.manager) {
            throw new Error("DBManager not initialized.")
          }
          const result: paymentInfo[] = await this.manager.get(this.database, madeBy)
          if (!result.length) return undefined
          return {
            created: result[0].created,
            paymentFor: result[0].paymentFor,
            madeBy: result[0].madeBy
          }
    }
    async getAll(): Promise<paymentInfo[]>{
        if(!this.manager){
            throw new Error("DBManger not initialized")
        }
        return this.manager.get(this.database,"")
    }
    async save(args: {
        created: string
        paymentFor: string
        madeBy: string
      }): Promise<void> {
        if (!this.manager) {
          throw new Error("DBManager not initialized.")
        }
        const bDocs = {
          created: new Date(args.created).getTime(),
          paymentFor: args.paymentFor,
          madeBy: args.madeBy
        }
    
        await this.manager.put(this.database, bDocs)
      }
}