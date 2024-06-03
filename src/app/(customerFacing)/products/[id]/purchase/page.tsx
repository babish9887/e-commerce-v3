import db from '@/db/db'
import React from 'react'
import Checkout2 from './_components/Checkout2';


async function PurchaseProductPage({params:{id}}:{params:{id:string}}) {
  const product = await db.product.findUnique({
    where: {id}
  })

  if (product == null) return 

  return <Checkout2 product={product}/>      

}

export default PurchaseProductPage
