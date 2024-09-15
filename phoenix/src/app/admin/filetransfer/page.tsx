'use client'
import React from 'react'
import FileTransferTable from '@/components/FileTransferDetails'
import Layout from '@/components/shared/Layout'

export default function Dashboard() {
  return (
    <Layout>
      <div className="flex flex-col gap-4">
        <FileTransferTable />
      </div>
    </Layout>
  )
}
