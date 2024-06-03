import db from "@/db/db";
import { NextRequest, NextResponse } from "next/server";
import fs from 'fs/promises'

export async function GET(req:NextRequest, {params}:any){
      const {downloadVerificationid}=params;
      const pa2=req.nextUrl.searchParams
  let data;
 if(pa2.get('exp')!=='false'){
      data = await db.downloadVerification.findUnique({
            where: { id: downloadVerificationid, expiresAt:{gt: new Date()} },
            select: {
              product: {
                select: { filePath: true, name: true }
              }
            }
          });
 } else{ 
      data = await db.downloadVerification.findUnique({
            where: { id: downloadVerificationid},
            select: {
              product: {
                select: { filePath: true, name: true }
              }
            }
          });
 }

  if(data == null ){
    return NextResponse.redirect(new URL('/products/download/expired', req.url));
  }
  return NextResponse.json({success:true, filePath: data.product.filePath}, {status:200})

//   const {size}=await fs.stat(data.product.filePath)
//   const file = await fs.readFile(data.product.filePath)
//   const extension = data.product.filePath.split('.').pop()
//   return new NextResponse(file, {headers:{
//         "Content-Disposition":`attachment; filename="${data.product.name}.${extension}"`,
//         "Content-Length":size.toString()
//   }})
}
