
import db from "@/db/db"
import { NextResponse } from "next/server"

export async function POST(req:Request){
      const {email}=await req.json()
      const user= await db.user.findUnique({
            where: {
                  email:email
            }
      })
      return NextResponse.json({success:true, user:user}, {status:200})
}