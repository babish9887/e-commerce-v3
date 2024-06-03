import db from "@/db/db";
import { NextResponse } from "next/server";

export async function POST(req:Request){
      const{code, email} = await req.json();

      const user=await db.user.findUnique({
            where:{email, verificationCodeExpiry:{
                  gt: new Date()
            }}
      })
      if(!user){
            return NextResponse.json({success:false, message:"Verifcation Code Expired"}, {status:200})
      }
      if(user?.verificationCode===code){
            await db.user.update({
                  where: {
                        email:email
                  }, data:{
                        verificationCode:null,
                        verificationCodeExpiry:null
                  }
            })
            return NextResponse.json({success:true, message:"Verification Successfull!"}, {status:200})
      }
      else
            return NextResponse.json({success:false, message:"Verifcation Code is incorrect"}, {status:200})


} 