"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import React, { useState } from 'react'
import axios from 'axios'
import { formatCurrency } from '@/lib/Formatter'
import toast from 'react-hot-toast'
import { getDownloadURL, ref } from 'firebase/storage'
import { storage } from '@/db/config'
import { signIn, useSession } from 'next-auth/react'

function page() {
      const [isLoading, setIsLoading]=useState(false)
      const [download, setDownload]=useState("")

      const [gotPurchased, setGotPurchased]=useState(false)


      const [Orders, setOrders]=useState<any>([])
      const {data: session}=useSession();


      const handleSubmit=async (e:any)=>{
          
            setIsLoading(true)
            e.preventDefault()

            try {
                  const email=session?.user?.email;
                  console.log(email)
                  const res=await axios.post('/api/getUser', {email})
                  if(!res.data.user) return toast.error("You have not Purchased anything Yet!");
                  const userId=res.data.user?.id
                  console.log(userId)
                  if(res.data.user){
                  const res=await axios.post('/api/getUserDownloads', {userId})
                  setOrders(res.data.usersOrders)
                  console.log(res.data.usersOrders)
                  setGotPurchased(true)
                  }
      } catch (error) {
            toast.error("Something went wrong!")      
      } finally{
            setIsLoading(false)
      }
      }

      const handleClick=async (e:any, name:any)=>{
            setDownload(name);
            setIsLoading(true);
            const imageRef=ref(storage, e)
            const url=await getDownloadURL(imageRef)     
            try {
                  const respnse=await fetch(url)
                  const blob=await respnse.blob()
                  const blobUrl=URL.createObjectURL(blob)
            
                  const link=document.createElement('a')
                  link.href=blobUrl
                  let extension=e?.split(".")
                  link.download=`${name}.${extension[extension?.length-1]}` || "DigitalOasisProduct"
                  link.click()
                  URL.revokeObjectURL(blobUrl)
                } catch (error) {
                  console.log(error)
                } finally{
                  setIsLoading(false)
                  setDownload("")
                }
      }

  return (
      <>
    <div className='max-2-xl mx-auto'>
      <Card>
            <CardHeader>
                  <CardTitle>My Orders</CardTitle>
                  <CardDescription>Click Get Purchase to get All your Purchases</CardDescription>
            </CardHeader>
           
            <CardFooter>
                 {session===undefined || session===null ?
                  <Button  onClick={()=>signIn("google")} type='button'>{"Sign in to Get Purchase"}</Button>
                  :
                  <Button disabled={isLoading || gotPurchased} onClick={handleSubmit} type='button'>{isLoading? "Getting...": "Get My purchases"}</Button>
                  
                  }
            </CardFooter>
      </Card>
    </div>
      {gotPurchased &&
      (
            <>
            <h1 className='font-semibold mt-6 mb-4 text-3xl'>Here is All your Purchases!</h1>
            <Table>
            
            <TableHeader>
                  <TableRow>
                        
                        <TableHead>Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Purchase Date</TableHead>

                        <TableHead className='w-0'>
                              <span className='sr-only'>Actions</span>
                        </TableHead>

                  </TableRow>
                  {Orders.map((order:any)=>{
                        return (
                              <TableRow key={order.id}>
                                    <TableCell className=''>
                                          <div className='flex flex-col'>
                                          <h4 className='font-semibold '>{order.name}</h4> 
                                          <p className='text-gray-700'>{order.description}</p>
                                          </div>
                                    </TableCell>
                                    <TableCell>{formatCurrency(order.price)}</TableCell>

                                    <TableCell>{order.purchaseDate}</TableCell>

                              <TableCell className='flex justify-end items-center'>
                              <Button className='mt-4 self-end' onClick={()=>handleClick(order.filePath, order.name)}
                              disabled={isLoading && download==order.name}>
                              {(isLoading && download==order.name)? "Downloading..." :"Download"}
                              </Button>
                              </TableCell>
                              </TableRow>
                        )
                  })}
            </TableHeader>
            <TableBody>
                 
            </TableBody>
      </Table>
      </>
      )}
      </>
  )
}



export default page