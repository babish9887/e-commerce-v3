
import db from "@/db/db"
import { NextResponse } from "next/server"

export async function POST(req:Request){
      const {id}=await req.json()
      const product= await db.product.delete({
            where: {
                  id: id
            }
      })
      if(product)
            return NextResponse.json({success:true}, {status:200})

      return NextResponse.json({success:false}, {status:400})

}