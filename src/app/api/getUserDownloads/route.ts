import db from "@/db/db"
import { NextResponse } from "next/server"

export async function POST(req:Request){
      const {userId}=await req.json()
      const orders= await db.downloadVerification.findMany({
            where: {
                  userId:userId
            }
      })

      const productsIds=orders.map(order=>order.productId)
      if(productsIds.length==0){

      }

      const products=await db.product.findMany({
            where: {
                  id:{
                        in: productsIds
                  }
            }
      })

      const usersOrders=orders.map(order=>{
            const product=products.find(product=>product.id===order.productId)
            return {
                  orderId:order.id,
                  name:product?.name,
                  description:product?.description,
                  price:product?.price,
                  filePath:product?.filePath,
                  purchaseDate:order.createdAt.toISOString().split("T")[0]
            }
      })
      return NextResponse.json({success:true, orders, products, usersOrders}, {status:200})
}