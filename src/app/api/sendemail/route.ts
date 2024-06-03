import db from "@/db/db";
import { sendEmail } from "@/lib/mailer";


export async function POST(req:Request) {
  try {
      const {id, name, email} =await req.json()
      if(!email && !name){
            return Response.json({success:false}, {status:405})
      }
      const product = await db.product.findUnique({ where: { id: id }, include:{orders:true} });
      await db.product.update({
            where:{id:product?.id},
            data:{
                  totalOrders: product?.orders.length
            }
      })
      const user= await db.user.findUnique({ where: { email:email } });
      
      const ifOldVerificationData = await db.downloadVerification.findFirst({
            where: { 
                userId: user?.id,
                productId: product?.id
            }
        });
        
      if(ifOldVerificationData){
            return Response.json({ success:false, message:"You have already purchased this Product! Check my orders Section!" }, { status: 500 });
            
      }
      const verifcationData=await db.downloadVerification.create({
            data: {
                  product:{connect: {id: product?.id}},
                  user:{connect: {id:user?.id}},
                  expiresAt: new Date(Date.now()+1000*60*60*24),
                  productFilePath: product?.filePath
            }
      })

      const order=await db.order.create({
            data:{
                  pricePaid:product?.price || 0,
                  user: {connect: {id:user?.id}},
                  product:{connect:{id:product?.id}
            }
            }
      })
     const emailStatus=await sendEmail({email:email, firstname:name.split(" ")[0],  product:product?.name, price:product?.price})

    if (!emailStatus) {
      return Response.json({ success:false, message:"failed to send Email" }, { status: 500 });
    }
    return Response.json({success:true, href:verifcationData.productFilePath }, {status:200});
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
