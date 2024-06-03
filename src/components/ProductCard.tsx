
import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { formatCurrency } from '@/lib/Formatter'
import { Button } from './ui/button'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'



function ProductCard({id, name, price, description, imagePath, totalOrders, position}:{id:string, name:string,price:number, description:string, imagePath:string, totalOrders?:number, position?:string | ""}) {
      const url=`https://firebasestorage.googleapis.com/v0/b/digital-oasis-35451.appspot.com/o/Images%2F${imagePath.split('/')[1]}?alt=media&token=${process.env.URL_TOKEN}`

  return (
    <Card className='flex overflow-hidden flex-col'>
      <div className='relative w-full h-auto aspect-video overflow-hidden transition-all'>
            <Image src={url} fill alt={name} priority sizes='20' className='hover:scale-110 transition-all'/>
      </div>
      <CardHeader>
            <CardTitle>{name}</CardTitle>
            <CardDescription>
                  {formatCurrency(price)}  {position==='Top Sales' &&  <span className='text-sm '>| Sold: {totalOrders || 0}</span>}
            </CardDescription>
      </CardHeader>
      <CardContent className='flex-grow'>
            <p className='line-clamp-2'>{description}</p>
      </CardContent>
      <CardFooter>
            <Button><Link href={`/products/${id}/purchase`}>Get this Product</Link></Button>
      </CardFooter>
    </Card>
  )
}

export function ProductCardSkeleton(){
      return(
            <Card className='overflow-hidden flex flex-col animate-pulse'>
                  <div className='w-full aspect-video bg-gray-300'/>
                  <CardHeader>
                        <CardTitle>
                              <div className='w-3/4 h-6 rounded-full bg-gray-300'/>
                        </CardTitle>
                        <CardDescription>
                              <div className='w-1/2 h-4 rounded-full bg-gray-300'/>
                        </CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-2'>
                        <div className='w-full rounded-full bg-gray-300'/>
                        <div className='w-full rounded-full bg-gray-300'/>
                        <div className='w-3/4 rounded-full bg-gray-300'/>
                  </CardContent>
                  <CardFooter>
                        <Button className='w-full' disabled size="lg"></Button>
                  </CardFooter>

            </Card>
      )
}

export default ProductCard