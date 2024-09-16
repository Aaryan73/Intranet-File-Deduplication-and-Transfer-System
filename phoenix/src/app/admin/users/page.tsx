'use client'
import React from 'react'
import Layout from '@/components/shared/Layout'
import UserManagement from '@/components/UserManagement'

export default function Dashboard() {
  return (
    <Layout>
      <div className="flex  flex-col gap-4">
        <UserManagement />
      </div>
    </Layout>
  )
}
