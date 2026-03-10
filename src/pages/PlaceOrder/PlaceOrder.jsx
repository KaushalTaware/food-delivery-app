import React, { useContext, useState,useEffect } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import axios from "axios"
import { useNavigate } from 'react-router-dom'

const PlaceOrder = () => {

  const { getTotalCartAmount, cartItems, food_list, url,token } = useContext(StoreContext)

  const [data, setData] = useState({
    firstName:"",
    lastName:"",
    email:"",
    street:"",
    city:"",
    state:"",
    zip:"",
    country:"",
    phone:""
  })

  const onChangeHandler = (e)=>{
    const name = e.target.name
    const value = e.target.value
    setData(prev => ({...prev,[name]:value}))
  }

  const submitHandler = async (e) => {

    e.preventDefault()

    let orderItems = []

    food_list.forEach((item)=>{
      if(cartItems[item._id] > 0){
        let itemInfo = {...item}
        itemInfo.quantity = cartItems[item._id]
        orderItems.push(itemInfo)
      }
    })

    const orderData = {
      items: orderItems,
      address: data,
      amount: getTotalCartAmount() + 2,
      userId: localStorage.getItem("userId")
    }

    try {

      const response = await axios.post(url + "/api/order/place", orderData)

      if(response.data.success){

        const {order, key, orderId} = response.data

        const options = {

          key: key,
          amount: order.amount,
          currency: "INR",
          name: "Food Delivery",
          description: "Order Payment",

          order_id: order.id,   // ✅ FIXED HERE

         handler: async function (response){

  try {

    const verifyRes = await axios.post(url + "/api/order/verify", {
      orderId: orderId,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_signature: response.razorpay_signature
    })

    if(verifyRes.data.success){
      alert("Payment Successful")
    }else{
      alert("Payment Failed")
    }

  } catch (error) {
    console.log(error)
    alert("Verification error")
  }

},

          theme: {
            color: "#3399cc"
          }

        }

        const rzp = new window.Razorpay(options)
        rzp.open()

      } 
      else {
        alert("Order Failed")
      }

    } catch (error) {
      console.log(error)
      alert("Server Error")
    }

  }
const navigate = useNavigate()
  useEffect(() => {
  if (!token) {
    navigate('/login')

  }else if(getTotalCartAmount()===0){
    navigate('/cart')

  }
}, [token]);


  return (

    <form className='place-order' onSubmit={submitHandler}>

      <div className='place-order-left'>

        <p className='title'>Delivery Information</p>

        <div className="multi-fields">
          <input required name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name'/>
          <input required name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name'/>
        </div>

        <input required name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder='Email'/>

        <input required name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder='Street'/>

        <div className="multi-fields">
          <input required name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder='City'/>
          <input required name="state" onChange={onChangeHandler} value={data.state} type="text" placeholder='State'/>
        </div>

        <div className="multi-fields">
          <input required name="zip" onChange={onChangeHandler} value={data.zip} type="text" placeholder='Zip Code'/>
          <input required name="country" onChange={onChangeHandler} value={data.country} type="text" placeholder='Country'/>
        </div>

        <input required name="phone" onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone'/>

      </div>

      <div className='place-order-right'>

        <div className="cart-total">

          <h2>Cart Total</h2>

          <div>

            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>

            <hr />

            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>

            <hr />

            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
            </div>

          </div>

          <button type="submit">PROCEED TO PAYMENT</button>

        </div>

      </div>

    </form>
  )
}

export default PlaceOrder