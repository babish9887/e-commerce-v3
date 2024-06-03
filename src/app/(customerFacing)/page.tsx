import ProductCard, { ProductCardSkeleton } from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import db from '@/db/db'
import { Product } from '@prisma/client'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React, { Suspense } from 'react'


const getMostPopularProducts =  ()=>{
      return db.product.findMany({
            where:{isAvailableforPurchase:true},
            orderBy:{orders:{_count:"desc"}},
            take:6
      })
}

const getNewestProducts = ()=>{
      return db.product.findMany({
            where:{isAvailableforPurchase:true},
            orderBy:{createdAt:"desc"},
            take:6
      })
}

function HomePage() {
  return (
    <main className='space-y-12'>
      <ProductGridSection productFetcher={getMostPopularProducts} title='Most Popular'/>
      <ProductGridSection productFetcher={getNewestProducts} title='Newest'/>

    </main>
  )
}


async function ProductGridSection({title, productFetcher}:{title:string,productFetcher:()=>Promise<Product[]>}){
      return(
      <div className='space-y-4'>
      <div className='flex gap-4'>
            <h1 className='text-3xl font-bold'>{title}</h1>
            <Button asChild variant={'outline'}>
                  <Link href='/products' className='space-x-2'>
                        <span>View All</span>
                        <ArrowRight className='size-4'/>
                  </Link>
            </Button>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          
            {(await productFetcher()).map(product=>(
            <ProductCard key={product.id} {...product} totalOrders={product.totalOrders || 0}/>
      ))}
      </div>
      </div>
)
}





export default HomePage