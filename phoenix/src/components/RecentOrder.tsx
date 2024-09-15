import React from 'react'
import { format } from 'date-fns'
import Link from 'next/link'
import { getOrderStatus } from '../lib/helpers'

interface Order {
  id: string
  product_id: string
  customer_id: string
  customer_name: string
  order_date: string
  order_total: string
  current_order_status: string
  shipment_address: string
}

const recentOrderData: Order[] = [
  {
    id: '1',
    product_id: '4324',
    customer_id: '23143',
    customer_name: 'Shirley A. Lape',
    order_date: '2022-05-17T03:24:00',
    order_total: '$435.50',
    current_order_status: 'PLACED',
    shipment_address: 'Cottage Grove, OR 97424'
  },
  {
    id: '7',
    product_id: '7453',
    customer_id: '96453',
    customer_name: 'Ryan Carroll',
    order_date: '2022-05-14T05:24:00',
    order_total: '$96.35',
    current_order_status: 'CONFIRMED',
    shipment_address: 'Los Angeles, CA 90017'
  },
  {
    id: '2',
    product_id: '5434',
    customer_id: '65345',
    customer_name: 'Mason Nash',
    order_date: '2022-05-17T07:14:00',
    order_total: '$836.44',
    current_order_status: 'SHIPPED',
    shipment_address: 'Westminster, CA 92683'
  },
  {
    id: '3',
    product_id: '9854',
    customer_id: '87832',
    customer_name: 'Luke Parkin',
    order_date: '2022-05-16T12:40:00',
    order_total: '$334.50',
    current_order_status: 'SHIPPED',
    shipment_address: 'San Mateo, CA 94403'
  },
  {
    id: '4',
    product_id: '8763',
    customer_id: '09832',
    customer_name: 'Anthony Fry',
    order_date: '2022-05-14T03:24:00',
    order_total: '$876.00',
    current_order_status: 'OUT_FOR_DELIVERY',
    shipment_address: 'San Mateo, CA 94403'
  },
  {
    id: '5',
    product_id: '5627',
    customer_id: '97632',
    customer_name: 'Ryan Carroll',
    order_date: '2022-05-14T05:24:00',
    order_total: '$96.35',
    current_order_status: 'DELIVERED',
    shipment_address: 'Los Angeles, CA 90017'
  }
]

const RecentOrders: React.FC = () => {
  return (
    <div className="bg-gray-800 p-4 rounded-md border border-gray-700 shadow-sm">
      <strong className="text-gray-200 text-lg font-semibold">Recent Orders</strong>
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full divide-y border divide-gray-200">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Product ID</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Customer Name</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Order Date</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Order Total</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Shipping Address</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Order Status</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y text-gray-700 text-sm divide-gray-200">
            {recentOrderData.map((order) => (
              <tr key={order.id} className="">
                <td className="px-3 py-4 whitespace-nowrap">
                  <Link href={`/order/${order.id}`} className="text-gray-300 hover:text-gray-200">
                    #{order.id}
                  </Link>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <Link href={`/product/${order.product_id}`} className="text-gray-300 hover:text-gray-200">
                    #{order.product_id}
                  </Link>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <Link href={`/customer/${order.customer_id}`} className="text-gray-300 hover:text-gray-200">
                    {order.customer_name}
                  </Link>
                </td>
                <td className="px-3 py-4 text-gray-300 whitespace-nowrap">
                  {format(new Date(order.order_date), 'dd MMM yyyy')}
                </td>
                <td className="px-3 py-4 text-gray-300 whitespace-nowrap">
                  {order.order_total}
                </td>
                <td className="px-3 py-4 text-gray-300 whitespace-nowrap">
                  {order.shipment_address}
                </td>
                <td className="px-3 py-4 text-gray-300 whitespace-nowrap">
                  {getOrderStatus("DELIVERED")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RecentOrders
