"use client"
import Nav, { NavLink } from '@/components/Nav'
import { Button } from '@/components/ui/button'
import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import React, { useState } from 'react'
import { X } from "lucide-react"
import {
      Dialog,
      DialogContent,
      DialogDescription,
      DialogFooter,
      DialogHeader,
      DialogTitle,
    } from "@/components/ui/dialog"
export const dynamic = 'force-dynamic'

import Placeholder from '../../../public/placeholder.jpg'

const CustomerLayout = ({children}:Readonly<{children:React.ReactNode}>) => {
      const {data:session}=useSession();
      const [open, setOpen]=useState(false);
      console.log(session)
  return (
    <>
      <Nav>
      <a href='/'>
            <h1 className='hidden sm:block sm:text-3xl font-bold'>Digital Oasis</h1>
      </a>
      <div>
            <NavLink href='/'>Home</NavLink>
            <NavLink href='/products'>Products</NavLink>
            <NavLink href='/orders'>My Orders</NavLink>
      </div>
     { session===undefined || session===null ? (<div>
      <Button onClick={()=>signIn("google")} variant={"outline"} className='text-black'>{session===undefined? "Loading":"Log In"}</Button>
     </div>):(
      <div className='w-10 h-10 relative rounded-full overflow-hidden hover:cursor-pointer' onClick={()=>setOpen(true)}>
            <Image src={session?.user?.image || Placeholder} alt='avatar' fill />
      </div>
     )}
      </Nav>
      <div className='container my-6'>
      {children}
            <Dialog open={open}>
                  <DialogContent className="sm:max-w-[425px]">
                  <div onClick={()=>setOpen(false)} className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                        <X className='h-4 w-4'/>
                  </div>
                  <DialogHeader>
                  <DialogTitle>Confirm Logout</DialogTitle>
                  <DialogDescription>
                       Are you sure to Logout?
                  </DialogDescription>
                  </DialogHeader>
                 
                  <DialogFooter>
                  <Button onClick={()=>setOpen(false)}  variant="ghost">cancel</Button>
                  <Button onClick={()=>signOut()} type='button' variant="destructive">Logout</Button>

                  </DialogFooter>
                  </DialogContent>
            </Dialog>
      </div>
    </>
  )
}

export default CustomerLayout