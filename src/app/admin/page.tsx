import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import db from '@/db/db'
import { formatCurrency, formatNumber } from '@/lib/Formatter'
import React from 'react'

async function Dashboard() {
      const[salesData, userData, productData]=await Promise.all([
            getSalesData(),
            getUserData(),
            getProductData()
      ])

      
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      <DashboardCard title='Sales' body={formatCurrency(salesData.amount).toString()} subtitle={`${formatNumber(salesData.numberOfSales).toString()} Orders`}/>

      <DashboardCard title='Customers' subtitle={`${formatCurrency(userData.averageValuePerUser).toString()} Average Values`} body={`${formatNumber(userData.userCount)} Customers`}/>

      <DashboardCard title='Active Products' subtitle={`${formatNumber(productData.inActiveCount).toString()} Inactive`} body={`${formatNumber(productData.activeCount)} Active`}/>
    </div>
  )
}


async function getProductData(){
      const [activeCount, inActiveCount]=await Promise.all([
            db.product.count({where: {isAvailableforPurchase:true}}),
            db.product.count({where:{isAvailableforPurchase:false}})
      ])
      return {activeCount, inActiveCount}
}

async function getUserData(){
      const [userCount, orderData]=await Promise.all([
             db.user.count(),
            db.order.aggregate({
                  _sum:{pricePaid:true}
            })
      ])
      return {
            userCount, averageValuePerUser: userCount===0 ? 0: (orderData._sum.pricePaid || 0)/userCount || 0
      }
}

async function getSalesData(){
      const data=await db.order.aggregate({
            _sum: {pricePaid:true},
            _count:true
      })
      return {
            amount:data._sum.pricePaid || 0,
            numberOfSales:data._count
      }
}

type DashboardCardProps={
      title:string,
      subtitle:string,
      body:string
}
function DashboardCard({title, subtitle, body}:DashboardCardProps){
      return (
            <Card>
            <CardHeader>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{subtitle}</CardDescription>
            </CardHeader>
            <CardContent>
                  <p>{body}</p>
            </CardContent>
            </Card>
      )
}

export default Dashboard