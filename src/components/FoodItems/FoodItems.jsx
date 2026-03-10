import React, { useContext } from 'react'
import './FoodItems.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'

const FoodItems = ({id,name,price,description,image}) => {

   
    const {cartItems,setCartItems,addToCart,removeFromcart ,url} = useContext(StoreContext)
  return (
    <div className='food-items'>
        <div className="food-items-img-container">
            <img className='food-items-image' src={url+"/images/"+image} alt="" />
            {
                !cartItems[id] ? <img  className='add'onClick={() => addToCart(id)} src={assets.add_icon_white} alt="" />: <div className="food-item-counter">
                    <img src={assets.remove_icon_red} alt="" onClick={()=> removeFromcart(id)} />
                    <p>{cartItems[id]}</p>
                    <img src={assets.add_icon_green} alt="" onClick={() => addToCart(id)} />

                </div>
            }

        </div>
        <div className='food-items-info'>
            <div className='food-items-name-rating'>
                <p>{name}</p>
                <img src={assets.rating_starts} alt="" />
            </div>
            <p className='food-items-desc'>{description}</p>
            <p className='food-items-price'>${price}</p>
        </div>
    </div>
  )
}

export default FoodItems