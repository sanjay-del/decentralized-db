
import { FastifyReply, FastifyRequest } from "fastify"
import { userInfoRepository } from "../setup.js"
export async function findUserInfo(req:FastifyRequest, res:FastifyReply){
    try {
        const username = (req.params as any).username
        if(!username) throw new Error("Missing usernmae");
        const info = await userInfoRepository.getLatest(username)
        if(!info){
            return res.status(404).send({
                error: `User with info ${username} not found`
            })
        }
        res.status(200).send(info)
    } catch (e:any) {
        res.send(500).send({
            error: e.message
        })
    }
}

export async function getAll(req:FastifyRequest, res:FastifyReply){
    try {
        const infos = await userInfoRepository.getAll()
        res.status(200).send(infos)
    } catch (e:any) {
        res.status(500).send({
            error: e.message,
        })
    }
}
export async function registerUser(req: FastifyRequest, res: FastifyReply) {
    try{
        const body:{
            email: string
            address: string
            username: string
            created: number
        } = req.body as any
        if(!body.email) throw new Error("Email is required");
        if(!body.address) throw new Error("user address is required");
        if(!body.username) throw new Error("Username for the user is required");
        if(!body.created) throw new Error("Created is required")
        console.log("Adding user with info: ",body.username)
        await userInfoRepository.save({
            email: body.email,
            address: body.address,
            username: body.username,
            created: body.created
        })
        res.send({status:"OK"})
    }catch(e:any){
        res.send({
            status: "Fail",
            error: e.message
        })
    }
}