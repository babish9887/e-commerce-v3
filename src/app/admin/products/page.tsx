import PageHeader from '../_components/PageHeader'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import db from '@/db/db'
import { CheckCircle2, DownloadIcon, MoreVertical, PencilIcon, XCircle } from 'lucide-react'
import { formatCurrency, formatNumber } from '@/lib/Formatter'
import { DropdownMenuContent, DropdownMenu, DropdownMenuSeparator,DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { ActiveToggleDropdownItem, DeleteDropdownItem, DownloadDropDownItem } from './_components/ProductActions'

function page() {
  return (
    <>
    <div className='flex justify-between items-center gap-4'>
    <PageHeader>Products</PageHeader>
    <Button>
      <Link href='/admin/products/new'>Add Product</Link>
    </Button>
    </div>
    <ProductsTable />
    </>
  )
}

async function ProductsTable(){
      const products=await db.product.findMany({select:{id:true, 
            name:true, 
            price: true, 
            isAvailableforPurchase: true, 
            filePath:true,
            imagePath:true,
            _count:{select:{downloadVerifications:true, orders:true}}
      },
      orderBy:{name: "asc"}
      })

      if(products.length===0) return <p>No Products found</p>
      return <Table>
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
                  {products.map(product=>(
                        <TableRow key={product.id}>
                              <TableCell>
                                    {product.isAvailableforPurchase? (
                                          <>
                                          <CheckCircle2 />
                                          <span className='sr-only'>Available</span>
                                          </>
                                    ): (
                                          <>
                                          <XCircle className='text-red-600' />
                                          <span className='sr-only'>Unavailable</span>
                                          </>
                                    )}
                              </TableCell>

                              <TableCell>{product.name}</TableCell>
                              <TableCell>{formatCurrency(product.price)}</TableCell>
                              <TableCell>{formatNumber(product._count.downloadVerifications)}</TableCell>
                              <TableCell className='flex gap-3'>
                               

                                    <DropdownMenu>
                                          <DropdownMenuTrigger>
                                                <MoreVertical />
                                                <span className='sr-only'>Actions</span>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent>
                                               <DownloadDropDownItem filePath={product.filePath}/>
                                                <DropdownMenuItem asChild>
                                                     <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                                                </DropdownMenuItem>
                                                <ActiveToggleDropdownItem
                                                id={product.id}
                                                isAvailableForPurchase={product.isAvailableforPurchase}
                                                />
                                                <DropdownMenuSeparator />
                                                <DeleteDropdownItem
                                                filePath={product.filePath}
                                                imagePath={product.imagePath}
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