"use client"
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import axios from 'axios';
import { Button } from '@/components/ui/button';
import CryptoJS from 'crypto-js'
import toast from 'react-hot-toast';
import { signIn, useSession } from 'next-auth/react';
import { formatCurrency } from '@/lib/Formatter';



function Checkout2({product}:any) {
      const [isLoading, setIsLoading]=useState(false);
      const [errorMessage, setErrorMessage]=useState<string>()
      const {data: session}=useSession();

      async function handlePayButtonClick(e:any) {
            e.preventDefault()
            setIsLoading(true)

            if(session===null || session===undefined){
                  return;
            }

            //check if the user has already purchased the product or not
            try {
                  const email=session.user?.email;
                  const name=session.user?.name
                  const res=await axios.post('/api/checkdownload',{email, product:product.id})
                  if(!res.data.success)
                        return toast.error(res.data.message, {duration:4000})
                  const uuid=new Date().getTime().toString().slice(-6);
            const jsonData:any = {
                  "amount": product.price.toString(),
                  "failure_url": `https://babish9887-ecommerce-nextjs.vercel.app/fail`,
                  "product_delivery_charge": "0",
                  "product_service_charge": "0",
                  "product_code": "EPAYTEST",
                  "signature": "",
                  "signed_field_names": "total_amount,transaction_uuid,product_code",
                  "success_url": `https://babish9887-ecommerce-nextjs.vercel.app/esewa/purchase-success?id=${product.id}&name=${name}&email=${email}&`,
                  // "success_url": `http://localhost:3000/esewa/purchase-success?id=${product.id}&name=${name}&email=${email}&`,

                  "tax_amount": "0",
                  "total_amount": product.price.toString(),
                  "transaction_uuid":uuid
            };
            let url="https://rc-epay.esewa.com.np/api/epay/main/v2/form";
            
            const message = "total_amount=" + jsonData.total_amount + ",transaction_uuid=" + jsonData.transaction_uuid + ",product_code=" + jsonData.product_code;
            const signature = createSignature(message);
            jsonData.signature = signature;
            
            
            const form = document.createElement("form");
            for (const key in jsonData) {
                  const field = document.createElement("input");
                  field.setAttribute("type", "hidden");
                  field.setAttribute("name", key);
                  field.setAttribute("value", jsonData[key]);
                  form.appendChild(field);
            }
            
            form.setAttribute("method", "post");
            form.setAttribute("action", url); 
            document.body.appendChild(form);
            form.submit();

            } catch (error) {
                  console.log(error)
                  toast.error("Something Unexpected Happen! Please Try Again later")                 
            } finally{
                  setIsLoading(false)
            }
        }
      
        function createSignature(message:string) {
          const hash = CryptoJS.HmacSHA256(message,"8gBm/:&EnhH.1/q");
          const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
          return hashInBase64;
        }

        const url=`https://firebasestorage.googleapis.com/v0/b/digital-oasis-35451.appspot.com/o/Images%2F${product.imagePath.split('/')[1]}?alt=media&token=${process.env.URL_TOKEN}`


      return(
      <div className="max-w-5xl w-full mx-auto space-y-8">
      <div className='flex gap-4 items-center'>
            <div className='aspect-video flex-shrink-0 w-1/3 relative'>
                  <img src={url} alt={product.name} />
            </div>
            <div>
                 
                  <h1 className='text-2xl font-bold'>{product.name}</h1>
                  <div className='line-clamp-3 text-muted-foreground'>{product.description}</div>
            </div>
      </div>

      <form onSubmit={handlePayButtonClick}>
      <Card>
            <CardHeader>
                  <CardTitle>Get the Product</CardTitle>
                  {errorMessage && <CardDescription className='text-destructive'>{errorMessage}</CardDescription>}
                  <CardDescription className='text-desctructive'></CardDescription>
            </CardHeader>
            <CardContent>
                 <div className='mt-2 space-y-6'>
                  <h1>Click on the Link Below to Buy</h1>
                 </div>
            </CardContent>
            <CardFooter>
                 {session===null || session===undefined ? (
                  <Button className='w-full' size="lg" disabled={ isLoading} type='button' onClick={()=>{signIn("google")}}
                  >
                  {isLoading ?  "Signing in...": `Sign in to Buy`}
                  </Button>
                 ):(
                  <Button className='w-full' size="lg" disabled={ isLoading} type='submit'
                  >
                      {isLoading ?  "Submitting...": `Purchase via esewa (${formatCurrency(product.price)})`}
                  </Button>
                 )}
            </CardFooter>
      </Card>
      </form>
      <div>
            <h2 className='font-semibold text-2xl'>Use Following credentials for esewa</h2>
            <p>esewaID: 9806800001</p>
            <p>Password: 1122 or Nepal@123</p>
            <p>Token/Code: 123456</p>
      </div>
      </div>  
      )
}

export default Checkout2