"use client"
import { Button } from '@/components/ui/button'
import { storage } from '@/db/config'
import axios from 'axios'
import { getDownloadURL, ref } from 'firebase/storage'
import React, {  useState } from 'react'
import toast from 'react-hot-toast'

function Product({product, name, email}:{product:any, name:string, email:string}) {
      const [isLoading, setIsLoading]=useState(false)
      const [isSuccess, setIsSuccess]=useState(false)
      const [id, setId]=useState<string>()
      const url=`https://firebasestorage.googleapis.com/v0/b/digital-oasis-35451.appspot.com/o/Images%2F${product?.imagePath.split('/')[1]}?alt=media&token=${process.env.URL_TOKEN}`

      let toastId=""

      const handleClick = async () => {
            setIsLoading(true);
            toastId=toast.loading("Confirming your Purchase")
            try {
              const response = await axios.post('/api/sendemail', {
                name, email, id: product.id
              });
              
              if (response.data.success) {
                toast.success("Purchase Confirmed! Click Download Button to Download or you can visit the 'My Orders' page", { duration: 5000, id:toastId });
                setIsSuccess(true);
                setId(response.data.href);
              } else {
                toast.error("You have already purchased this product. Check your email or visit the 'My Orders' page", { duration: 4000, id:toastId });
              }
            } catch (error: any) {
              toast.error("Error confirming purchase.", { duration: 4000, id:toastId });
            } finally {
              setIsLoading(false);
            }
          };

      const handleDownload=async ()=>{
            setIsLoading(true)
            const imageRef=ref(storage,id )
            const url=await getDownloadURL(imageRef)     
            try {
                  const respnse=await fetch(url)
                  const blob=await respnse.blob()
                  const blobUrl=URL.createObjectURL(blob)
            
                  const link=document.createElement('a')
                  link.href=blobUrl
                  let extension=id?.split(".")
                  //@ts-ignore
                  link.download=`${name}.${extension[extension?.length-1]}` || "DigitalOasisProduct"
                  link.click()
                  URL.revokeObjectURL(blobUrl)
                } catch (error) {
                } finally{
                  setIsLoading(false)
                }
            }

  return (
      <div className="max-w-5xl w-full mx-auto space-y-8">
      <h1 className='text-4xl font-bold'>{"Payment Successful!"}</h1>
      <div className='flex gap-4 items-center'>
            <div className='aspect-video flex-shrink-0 w-1/3 relative'>
                  <img src={url} alt={product?.name}  className='object-cover'/>
            </div>
            <div>
                  <h1 className='text-2xl font-bold'>{product?.name}</h1>
                  <div className='line-clamp-3 text-muted-foreground'>{product?.description}</div>
            
            {isSuccess ? <Button className='mt-4' onClick={handleDownload} disabled={isLoading}>
                  {isLoading?"Downloading...":"Download"}
                  </Button>:
                   <Button className='mt-4' size="lg" onClick={handleClick} disabled={isLoading}>
                   {isLoading? "confirming...": "Click to Confirm"}
             </Button>

            }
            </div>
            </div>
</div>
  )
}

export default Product