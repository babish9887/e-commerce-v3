import db from "@/db/db"
import { sendVerifyEmail } from "@/lib/mailer2"
import { NextResponse } from "next/server"

export async function POST(req:Request){
      const {email}=await req.json()

      try {
        const code=Math.floor(100000+Math.random()*900000)
            const user=await db.user.update({where:{email:email}, data: {verificationCode:code, verificationCodeExpiry:new Date(Date.now() + 3600000)}})
            if(!user){
            return NextResponse.json({success:false, message:"User doesnot Exist"}, {status: 500})

            }
            const res=await sendVerifyEmail({email, code})
            if(res.accepted.length>0)
                  return NextResponse.json({success:true, message:"We have sent Verification code to your Email"}, {status:200})

            return NextResponse.json({success:false, message:"Error in sending email"}, {status:200})
            
      } catch (error) {
            console.log(error)
            return NextResponse.json({success:false}, {status: 500})
      }
}