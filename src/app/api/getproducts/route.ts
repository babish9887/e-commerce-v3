
import db from "@/db/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req:NextRequest){
      
      const params=req.nextUrl.searchParams
      const order=params.get('order')
      const category=params.get('category')
      if(order=='Top Sales'){
            const temp=await db.product.findMany({
                  where:{isAvailableforPurchase:true}, 
                  include:{
                        orders:true
                  }});
                  temp.forEach(product => {
                        product.totalOrders = product.orders.length;
                    });
                    if(category==="All"){
                        //@ts-ignore
                         temp.sort((a, b) => b.totalOrders - a.totalOrders);
                        return NextResponse.json({success:true, products:temp}, {status:200})
                    }
                    const products=temp.filter(product=>product.category==category)
                     //@ts-ignore
                     products.sort((a, b) => b.totalOrders - a.totalOrders);
                     return NextResponse.json({success:true, products}, {status:200})

      } else if(order=='Price Low to High'){
            const temp=await db.product.findMany({
                  where:{isAvailableforPurchase:true}, 
                  orderBy:{price:"asc"}})
                  if(category=="All")
                        return NextResponse.json({success:true, products:temp}, {status:200})
                  
                  const products=temp.filter(product=>product.category===category)
                  return NextResponse.json({success:true, products}, {status:200})


      } else if(order=='Price High to Low'){
            const temp=await db.product.findMany({
                  where:{isAvailableforPurchase:true}, 
                  orderBy:{price:"desc"}})
                  if(category=="All")
                        return NextResponse.json({success:true, products:temp}, {status:200})
                  
                  const products=temp.filter(product=>product.category===category)

                  return NextResponse.json({success:true, products}, {status:200})

      }else if(order=='Newest First'){
            const temp=await db.product.findMany({
                  where:{isAvailableforPurchase:true}, 
                  orderBy:{createdAt:"desc"}})
                  if(category=="All")
                        return NextResponse.json({success:true, products:temp}, {status:200})
                  
                  const products=temp.filter(product=>product.category===category)
                  return NextResponse.json({success:true, products}, {status:200})

      } else if(order=='A-Z'){
            const temp=await db.product.findMany({
                  where:{isAvailableforPurchase:true}, 
                  orderBy:{name:"asc"}})
                  if(category=="All")
                        return NextResponse.json({success:true, products:temp}, {status:200})
                  
                  const products=temp.filter(product=>product.category===category)
                  return NextResponse.json({success:true, products}, {status:200})
      } else {
            const temp=await db.product.findMany({
                  where:{isAvailableforPurchase:true}, 
                  orderBy:{name:"asc"}})
                  if(category=="All")
                        return NextResponse.json({success:true, products:temp}, {status:200})
                  
                  const products=temp.filter(product=>product.category===category)
                  return NextResponse.json({success:true, products}, {status:200})
      }
}
