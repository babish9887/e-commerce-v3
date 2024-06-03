
import db from "@/db/db";
import Product from "./Product";

async function PurchaseSuccessPage({searchParams}: {
      searchParams:{id:string, name:string, email:string}
}) {
      
      console.log(searchParams.name, searchParams.email)
      const product=await db.product.findUnique({
            where:{id: searchParams.id} ,
            include:{
                  orders:true
            }
      })
   
      try {
            const user=await db.user.create({
                  data:{
                        email:searchParams.email,
                        name: searchParams.name,
                        isActivate:true

                  }
            })

      } catch (error) {
      }
    return (
     <Product product={product} name={searchParams.name} email={searchParams.email} />
    );
}

export default PurchaseSuccessPage;
