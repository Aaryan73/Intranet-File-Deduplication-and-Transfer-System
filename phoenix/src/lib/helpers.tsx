import React from 'react'

// Define a TypeScript enum for order statuses
export enum OrderStatus {
	PLACED = 'PLACED',
	CONFIRMED = 'CONFIRMED',
	SHIPPED = 'SHIPPED',
	OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
	DELIVERED = 'DELIVERED',
}

// Define the type for the status parameter
type OrderStatusType = keyof typeof OrderStatus

// Update the function to use the enum and type
export function getOrderStatus(status: OrderStatusType) {
	switch (status) {
		case OrderStatus.PLACED:
			return (
				<span className="capitalize py-1 px-2 rounded-md text-xs text-sky-600 bg-sky-100">
					{status.replaceAll('_', ' ').toLowerCase()}
				</span>
			)
		case OrderStatus.CONFIRMED:
			return (
				<span className="capitalize py-1 px-2 rounded-md text-xs text-orange-600 bg-orange-100">
					{status.replaceAll('_', ' ').toLowerCase()}
				</span>
			)
		case OrderStatus.SHIPPED:
			return (
				<span className="capitalize py-1 px-2 rounded-md text-xs text-teal-600 bg-teal-100">
					{status.replaceAll('_', ' ').toLowerCase()}
				</span>
			)
		case OrderStatus.OUT_FOR_DELIVERY:
			return (
				<span className="capitalize py-1 px-2 rounded-md text-xs text-yellow-600 bg-yellow-100">
					{status.replaceAll('_', ' ').toLowerCase()}
				</span>
			)
		case OrderStatus.DELIVERED:
			return (
				<span className="capitalize py-1 px-2 rounded-md text-xs text-green-600 bg-green-100">
					{status.replaceAll('_', ' ').toLowerCase()}
				</span>
			)
		default:
			return (
				<span className="capitalize py-1 px-2 rounded-md text-xs text-gray-600 bg-gray-100">
					{status.replaceAll('_', ' ').toLowerCase()}
				</span>
			)
	}
}
