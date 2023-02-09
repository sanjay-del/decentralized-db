import { FastifyReply, FastifyRequest } from "fastify"
import { paymentInfoRespository } from "../setup.js"
export async function findPaymentInfo(req:FastifyRequest, res:FastifyReply){
    try {
        const madeBy =(req.params as any).madeBy
        if(!madeBy) throw new Error("Missing user");
        const info = await paymentInfoRespository.getByUser(madeBy)
        if(!info){
            return res.status(404).send({
                error: `User with info ${madeBy} not found`
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

export async function getAllPayment(req:FastifyRequest, res:FastifyReply){
    try {
        const infos = await paymentInfoRespository.getAll()
        res.status(200).send(infos)
    } catch (e:any) {
        res.status(500).send({
            error: e.message,
        })
    }
}
export async function addPayment(req: FastifyRequest, res: FastifyReply) {
    try{
        const body:{
            created: string
            madeBy: string
            paymentFor: string
        } = req.body as any
    console.log("Adding payment with info: ",body.madeBy)
    await paymentInfoRespository.save({
        created: body.created,
        paymentFor: body.paymentFor,
        madeBy: body.madeBy
    })
    
    }
    catch(e:any){
        res.send({
            status: "Fail",
            error: e.message
        })
    }
}