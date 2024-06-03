import Nav, { NavLink } from '@/components/Nav'
import React from 'react'

export const dynamic = 'force-dynamic'

const AdminLayout = ({children}:Readonly<{children:React.ReactNode}>) => {
  return (
    <>
      <Nav>
      <a href='/admin'>
            <h1 className='hidden sm:block sm:text-3xl font-bold'>Digital Oasis</h1>
      </a>
      <div>

            <NavLink href='/admin'>Dashboard</NavLink>
            <NavLink href='/admin/products'>Products</NavLink>
            <NavLink href='/admin/customers'>Customers</NavLink>
            <NavLink href='/admin/sales'>Sales</NavLink>
      </div>

      </Nav>
      <div className='container my-6'>{children}</div>
    </>
  )
}

export default AdminLayout