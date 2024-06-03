"use server"

import db from '@/db/db'
import { describe } from 'node:test'
import {z} from 'zod'
import fs from 'fs/promises'
import { redirect } from 'next/navigation'
import crypto from 'crypto'
import { revalidatePath } from 'next/cache'
import { ref, uploadBytes } from 'firebase/storage'
import { storage } from '@/db/config'

const fileSchema=z.instanceof(File, {message:"Required"})

const imageSchema=fileSchema.refine(file=>file.size>0 || file.type.startsWith('image/'))

const addSchema=z.object({
      name:z.string().min(1),
      description:z.string().min(1),
      price: z.coerce.number().int().min(1),
      file:fileSchema.refine(file=>file.size>0, "Required"),
      image:imageSchema.refine(image=>image.size>0, "Required"),
      category:z.string()
})



export async function addProduct(prevState:unknown, formData:FormData) {
      const result=addSchema.safeParse(Object.fromEntries(formData.entries()))
      if(result.success===false){
            return result.error.formErrors.fieldErrors
      }

      // const data = result.data
      // fs.mkdir('products', {recursive:true})
      // const filePath=`products/${crypto.randomUUID()}-${data.file.name}`
      // await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))

      // fs.mkdir('public/products', {recursive:true})
      // const imagePath=`/products/${crypto.randomUUID()}-${data.image.name}`
      // await fs.writeFile(`public${imagePath}`, Buffer.from(await data.image.arrayBuffer()))
      const data=result.data
      const imagePath= `Images/${crypto.randomUUID()}-${data.image.name}`
      const imageref=ref(storage,imagePath)
      const imageUpload=await uploadBytes(imageref, data.image)
      
      const filePath=`Products/${crypto.randomUUID()}-${data.file.name}`
      const fileref=ref(storage, filePath)
      const fileUpload=await uploadBytes(fileref, data.file)
      
      await db.product.create({data:{
            name:data.name,
            description:data.description,
            price:data.price,
            filePath,
            imagePath: imagePath,
            category:data.category || "None"
      }})
      revalidatePath('/')
      revalidatePath('/products')
            redirect('/admin/products')
  
}


const editSchema=addSchema.extend({
      image:imageSchema.optional(),
      file:fileSchema.optional(),
})


export async function updateProduct(id:string, prevState:unknown, formData:FormData) {
      const result=editSchema.safeParse(Object.fromEntries(formData.entries()))
      if(result.success===false){
            return result.error.formErrors.fieldErrors
      }

      const data = result.data
      const product=await db.product.findUnique({where:{id}})

      if(product==null) return 

      let filePath=product.filePath
      if(data.file!=null && data.file.size>0){
            const imagePath= `Images/${crypto.randomUUID()}-${data.file.name}`
      const imageref=ref(storage,imagePath)
      const imageUpload=await uploadBytes(imageref, data.file)
      }

      let imagePath=product.imagePath
      if(data.image!=null && data.image.size>0){
            const imagePath= `Images/${crypto.randomUUID()}-${data.image.name}`
            const imageref=ref(storage,imagePath)
            const imageUpload=await uploadBytes(imageref, data.image)
      }


      await db.product.update({where:{id},data:{
            name:data.name,
            description:data.description,
            price:data.price,
            filePath,
            imagePath: imagePath
      }})
            revalidatePath('/')
            revalidatePath('/products')
            redirect('/admin/products')
  
}




export async function toggleProductAvailability(id:string, isAvailableforPurchase:boolean){
      await db.product.update({where: {id}, data:{isAvailableforPurchase}})
      revalidatePath('/')
      revalidatePath('/products')
}

export async function deleteProduct (id: string){
     const product=await db.product.delete({where: {id}})
     if(product===null) return 

     await fs.unlink(product.filePath)
     await fs.unlink(`public${product.imagePath}`)
     revalidatePath('/')
     revalidatePath('/products')

}

