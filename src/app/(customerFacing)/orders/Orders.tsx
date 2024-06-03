"use server"
import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CheckCircle2, DownloadIcon, XCircle } from 'lucide-react'
import db from '@/db/db'
async function Orders({email}:{email:string}) {
      const user=await db.user.findUnique({where: {email}})
      
      // const product=await db.downloadVerification.findMany({where: {userId:user?.id}})
  return (
      <div>
      <Table>
              <TableHeader>
                    <TableRow>
                          <TableHead className='w-0'>
                                <span className='sr-only'>Available For Purchase</span>
                          </TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Sold</TableHead>
                          <TableHead className='w-0'>
                                <span className='sr-only'>Actions</span>
                          </TableHead>
  
                    </TableRow>
              </TableHeader>
              <TableBody>
                   
              </TableBody>
        </Table>
      </div>
  )
}

export default Orders