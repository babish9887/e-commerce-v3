import PageHeader from '../_components/PageHeader'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import db from '@/db/db'
import { CheckCircle2, DownloadIcon, MoreVertical, PencilIcon, XCircle } from 'lucide-react'
import { formatCurrency, formatNumber } from '@/lib/Formatter'
import { DropdownMenuContent, DropdownMenu, DropdownMenuSeparator,DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { ActiveToggleDropdownItem, DeleteDropdownItem } from './_components/UserActions'

function page() {
  return (
    <>
    <div className='flex justify-between items-center gap-4'>
    <PageHeader>Customers</PageHeader>
    </div>
    <ProductsTable />
    </>
  )
}

async function ProductsTable(){
      const products=await db.user.findMany({select:{id:true, 
            name:true, 
            email: true,  
            isActivate:true,
            _count:{select:{orders:true}}
      },
      orderBy:{name: "asc"}
      })

      if(products.length===0) return <p>No Customers</p>
      return <Table>
            <TableHeader>
                  <TableRow>
                        <TableHead className='w-0'>
                              <span className='sr-only'>is Activated</span>
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Orders</TableHead>

                        <TableHead className='w-0'>
                              <span className='sr-only'>Actions</span>
                        </TableHead>

                  </TableRow>
            </TableHeader>
            <TableBody>
                  {products.map(product=>(
                        <TableRow key={product.id}>
                              <TableCell>
                                    {product.isActivate? (
                                          <>
                                          <CheckCircle2 />
                                          <span className='sr-only'>Activate</span>
                                          </>
                                    ): (
                                          <>
                                          <XCircle className='text-red-600' />
                                          <span className='sr-only'>Deactivate</span>
                                          </>
                                    )}
                              </TableCell>

                              <TableCell>{product.name}</TableCell>
                              <TableCell>{product.email}</TableCell>
                              <TableCell>{formatNumber(product._count.orders)}</TableCell>
                              <TableCell className='flex gap-3'>
                                    {/* <MoreVertical/> */}
                                    {/* <a download href={`/admin/products/${product.id}/download`}>
                                                            <DownloadIcon />
                                                      </a>
                              <Link href={`/admin/products/${product.id}/edit`}><PencilIcon /></Link>
                               */}

                                    <DropdownMenu>
                                          <DropdownMenuTrigger>
                                                <MoreVertical />
                                                <span className='sr-only'>Actions</span>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent>
                                               
                                                <ActiveToggleDropdownItem
                                                id={product.id}
                                                isActivate={product.isActivate}
                                                />
                                                <DropdownMenuSeparator />
                                                <DeleteDropdownItem
                                                id={product.id}
                                                disabled={product._count.orders > 0}
                                                 />
                                          </DropdownMenuContent>
                                    </DropdownMenu>
                              </TableCell>

                              
                        </TableRow>
                  ))}
            </TableBody>
      </Table>
}

export default page