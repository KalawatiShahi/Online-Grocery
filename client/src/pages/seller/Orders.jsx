import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import toast from 'react-hot-toast'

const Orders = () => {
  const { currency, axios } = useAppContext()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/orders/seller') // Your seller orders endpoint
      if (data.success) {
        setOrders(data.orders)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // Delete handler
  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const { data } = await axios.delete(`/api/orders/seller/${orderId}`) // Your delete endpoint
      if (data.success) {
        toast.success(data.message)
        setOrders(prev => prev.filter(order => order._id !== orderId)) // Remove deleted order from state
      } else {
        toast.error(data.message || "Failed to delete order")
      }
    } catch (error) {
      toast.error("Server error while deleting order")
      console.error(error)
    }
  }

  return (
    <div className='no-scrollbar flex-1 h-[95vh] overflow-y-scroll'>
      <div className="md:p-10 p-4 space-y-4">
        <h2 className="text-lg font-medium">Orders List</h2>

        {loading ? (
          <p className="text-gray-500">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          orders.map((order, index) => (
            <div key={index} className="flex flex-col md:items-center
             md:flex-row gap-5 justify-between
              p-5 max-w-4xl rounded-md border border-gray-300">
              
              <div className="flex gap-5 max-w-80">
                <img className="w-12 h-12 object-cover" src={assets.box_icon} alt="boxIcon" />
                <div>
                  {order.items.map((item, idx) => (
                    <p key={idx} className="font-medium">
                      {item.product?.name || 'Unknown Product'} <span className="text-primary">x {item.quantity}</span>
                    </p>
                  ))}
                </div>
              </div>

              <div className="text-sm md:text-base text-black/60">
                <p className='text-black/80'>{order.address?.firstName} {order.address?.lastName}</p>
                <p>{order.address?.street}, {order.address?.city}, {order.address?.state}, {order.address?.zipcode}, {order.address?.country}</p>
                <p>{order.address?.phone}</p>
              </div>

              <p className="font-medium text-base my-auto text-black/70">{currency}{order.amount}</p>

              <div className="flex flex-col text-sm">
                <p>Method: {order.paymentType}</p>
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(order._id)}
                className="bg-red-600 hover:bg-red-700
                 text-white px-3 py-1 rounded self-center md:self-auto"
                type="button"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Orders
