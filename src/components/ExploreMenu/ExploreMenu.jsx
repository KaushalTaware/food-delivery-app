import React from 'react'
import './ExploreMenu.css'

import {menu_list} from '../../assets/assets'

const ExploreMenu = ({category,setCategory}) => {
  return (
    <div className=' explore-menu ' id='explore-menu'>
        <h1 >Explore our menu</h1>
        <p >Lorem ipsum, dolor sit amet consectetur adipisicing elit. Velit modi, dolor est molestiae eaque cumque?</p>
        <div className='explore-menu-list '>
            {menu_list.map((item,idx)=>
            (
                <div key={idx}
                onClick={()=>{
                  setCategory(prev=> prev===item.menu_name ? "All":item.menu_name)
                }}
                className='explore-menu-list-item'>
                    <img className={`w-[7.5vw] min-w-[80px] rounded-full cursor-pointer transition-all duration-200 ${category===item.menu_name?"p-[4px] border-4 border-red-400 scale-110":""}`} src={item.menu_image} alt="" />
                    <p >{item.menu_name}</p>
                </div>
            )    
            )}
        </div>
        <hr/>
    </div>
  )
}


export default ExploreMenu