"use server"
import db from "@/db/db"

export async function deleteUser (id: string){
      const product=await db.product.delete({where: {id}})
      if(product===null) return 
 
 }

 export async function toggleUserActivate(id:string, isActivate:boolean){
      const user = await db.user.update({where: {id}, data:{isActivate} })
      if(user===null) return
      
}
 
 