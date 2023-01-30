import { FastifyReply, FastifyRequest } from "fastify"
import { businessDocsRepository } from "../setup.js"
export async function findBusinessDocId(req:FastifyRequest, res:FastifyReply){
    try {
        const id =(req.params as any).id
        if(!id) throw new Error("Missing user");
        const info = await businessDocsRepository.getById(id)
        if(!info){
            return res.status(404).send({
                error: `Business with info ${id} not found`
            })
        }
        res.status(200).send(info)
    }
    catch(e:any){
        res.send(500).send({
            error: e.message
        })
    }
}

export async function addBusinessDocs(req: FastifyRequest, res: FastifyReply) {
    try{
        const body:{
            id:string,
            created: string
            personel: string
            manifest: string
        } = req.body as any
    console.log("Adding business docs with info: ",body.personel)
    await businessDocsRepository.save({
        id:body.id,
        created: body.created,
        personel: body.personel,
        manifest: body.manifest
    }) 
    }
    catch(e:any){
        res.send({
            status: "Fail",
            error: e.message
        })
    }
}