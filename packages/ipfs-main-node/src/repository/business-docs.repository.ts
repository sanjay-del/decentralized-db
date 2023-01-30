import { DBManager } from "../db-manager.js";
export type BusinessDocs ={
    _id: string
    created: number
    personel: string
    manifest: string
}

export class businessDocs{
    private manager ?:DBManager
    database: any
    async init(manager: DBManager, address?: string): Promise<void> {
        this.manager = manager
        if (address) {
          this.database = await this.manager.loadDatabase(address)
        } else {
          this.database = await this.manager.openDatabase("business-docs",{
            indexBy:"personel"
          })
        }
      }
      async getById(
        id: string,
      ): Promise<{ id: string; created: number; personel: string ; manifest: string} | undefined> {
        if (!this.manager) {
          throw new Error("DBManager not initialized.")
        }
        const result: BusinessDocs[] = await this.manager.get(this.database, id)
        if (!result.length) return undefined
        return {
          id: result[0]._id,
          created: result[0].created,
          personel: result[0].personel,
          manifest: result[0].manifest
        }
      }

      async save(args: {
        id: string
        created: string
        personel: string
        manifest: string
      }): Promise<void> {
        if (!this.manager) {
          throw new Error("DBManager not initialized.")
        }
        const bDocs = {
          _id: args.id,
          created: new Date(args.created).getTime(),
          personel: args.personel,
          manifest: args.manifest
        }
    
        await this.manager.put(this.database, bDocs)
      }
}