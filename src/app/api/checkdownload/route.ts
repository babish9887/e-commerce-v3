import db from "@/db/db";
import { NextResponse } from "next/server";

export async function POST(req:Request){
      const{email, product}=await req.json()
      const user= await db.user.findUnique({
            where: {
                  email:email
            }
      })

      if(!user)
            return NextResponse.json({success:true},{status:200})

      if(!user.isActivate)
            return NextResponse.json({success:false, message:"You've been blocked. Please contact the administrator for assistance."},{status:200})


      const downloadVerification=await db.downloadVerification.findFirst({
            where: {userId: user.id, productId:product}
      })

      if(downloadVerification){
            return NextResponse.json({success:false, message:"Product already purchased.You can Download from \"My Orders\" page."}, {status:200})
      }
      return NextResponse.json({success:true}, {status:200})

}