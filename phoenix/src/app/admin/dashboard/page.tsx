'use client'
import React from 'react'
import DashboardStatsGrid from '@/components/DashboardStatsGrid'
import BandwidthSavedChart from '@/components/Transaction'
import RecentOrders from '@/components/RecentOrder'
import BuyerProfilePieChart from '@/components/BuyerProfileChart'
import PopularProducts from '@/components/PopularProducts'
import Layout from '@/components/shared/Layout'

export default function Dashboard() {
  return (
    <Layout>
      <div className="flex flex-col gap-4">
        <DashboardStatsGrid />
        <div className="flex flex-row gap-4 w-full">
          <BandwidthSavedChart />
          <BuyerProfilePieChart />
        </div>
        <div className="flex flex-row gap-4 w-full">
          <RecentOrders />
          <PopularProducts />
        </div>
      </div>
    </Layout>
  )
}
