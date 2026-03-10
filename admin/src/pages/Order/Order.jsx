import React, { useState,useEffect } from 'react'
import './Order.css'
import axios from 'axios';
import { toast } from 'react-toastify';
import assets from '../../assets/assets';

const Order = ({url}) => {
  const [orders, setOrders] = useState([]);
  const fetchAllOrders = async()=>{
  const response = await axios.get(url+"/api/order/list")
  if(response.data.success){
    setOrders(response.data.data)
  }else{
    toast.error("Error fetching orders")
  }
  }
  const statusHandler = async(event,orderId)=>{
    const response = await axios.post(url+"/api/order/status",{orderId:orderId,status:event.target.value})
    if(response.data.success){
      await fetchAllOrders()
      toast.success("Order status updated")
    }else{
      toast.error("Error updating order status")
    }
    
  }

  useEffect(()=>{
    fetchAllOrders()
  },[])

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order,index)=>

        (
          <div key={index} className='order-item'>
            <img src={assets.parcels_icon} alt="" />
            <div>
              <p className='order-item-food'>
                {order.items.map((item,index)=>{
                 if(index===order.items.length-1){
                  return item.name + "x" + item.quantity
                 }
                 else{
                  return item.name + "x" + item.quantity + ","
                 }
                })}
              </p>
              <p className='order-item-name'>{order.address.firstName + " " + order.address.lastName}</p>

              <div className="order-item-address">
                <p>{order.address.street}</p>
                <p>{order.address.city + "," + order.address.state + "," + order.address.zip}</p>
              </div>
              <p>{order.address.phone}</p>
            </div>
            <p>Items:{order.items.length}</p>
            <p>${order.amount}</p>
            <select onChange={(event)=>statusHandler(event,order._id)} value={order.status}>
              <option value="Food Processing">Food Processing</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>

          </div>
        ))}
      </div>

    </div>
  )
}

export default Order
