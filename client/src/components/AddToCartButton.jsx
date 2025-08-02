// import React, { useEffect, useState } from 'react'
// import { useGlobalContext } from '../provider/GlobalProvider'
// import Axios from '../utils/Axios'
// import SummaryApi from '../common/SummaryApi'
// import toast from 'react-hot-toast'
// import AxiosToastError from '../utils/AxiosToastError'
// import Loading from './Loading'
// import { useSelector } from 'react-redux'
// import { FaMinus, FaPlus } from "react-icons/fa6";

// const AddToCartButton = ({ data }) => {
//     const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext()
//     const [loading, setLoading] = useState(false)
//     const cartItem = useSelector(state => state.cartItem.cart)
//     const [isAvailableCart, setIsAvailableCart] = useState(false)
//     const [qty, setQty] = useState(0)
//     const [cartItemDetails,setCartItemsDetails] = useState()

//     const handleADDTocart = async (e) => {
//         e.preventDefault()
//         e.stopPropagation()

//         try {
//             setLoading(true)

//             const response = await Axios({
//                 ...SummaryApi.addTocart,
//                 data: {
//                     productId: data?._id
//                 }
//             })

//             const { data: responseData } = response

//             if (responseData.success) {
//                 toast.success(responseData.message)
//                 if (fetchCartItem) {
//                     fetchCartItem()
//                 }
//             }
//         } catch (error) {
//             AxiosToastError(error)
//         } finally {
//             setLoading(false)
//         }

//     }

//     //checking this item in cart or not
//     useEffect(() => {
//         const checkingitem = cartItem.some(item => item.productId._id === data._id)
//         setIsAvailableCart(checkingitem)

//         const product = cartItem.find(item => item.productId._id === data._id)
//         setQty(product?.quantity)
//         setCartItemsDetails(product)
//     }, [data, cartItem])


//     const increaseQty = async(e) => {
//         e.preventDefault()
//         e.stopPropagation()
    
//        const response = await  updateCartItem(cartItemDetails?._id,qty+1)
        
//        if(response.success){
//         toast.success("Item added")
//        }
//     }

//     const decreaseQty = async(e) => {
//         e.preventDefault()
//         e.stopPropagation()
//         if(qty === 1){
//             deleteCartItem(cartItemDetails?._id)
//         }else{
//             const response = await updateCartItem(cartItemDetails?._id,qty-1)

//             if(response.success){
//                 toast.success("Item remove")
//             }
//         }
//     }
//     return (
//         <div className='w-full max-w-[150px]'>
//             {
//                 isAvailableCart ? (
//                     <div className='flex w-full h-full'>
//                         <button onClick={decreaseQty} className='bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 rounded flex items-center justify-center'><FaMinus /></button>

//                         <p className='flex-1 w-full font-semibold px-1 flex items-center justify-center'>{qty}</p>

//                         <button onClick={increaseQty} className='bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 rounded flex items-center justify-center'><FaPlus /></button>
//                     </div>
//                 ) : (
//                     <button onClick={handleADDTocart} className='bg-green-600 hover:bg-green-700 text-white px-2 lg:px-4 py-1 rounded'>
//                         {loading ? <Loading /> : "Add"}
//                     </button>
//                 )
//             }

//         </div>
//     )
//  }

//  export default AddToCartButton


// AddToCartButton.jsx
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaMinus, FaPlus } from 'react-icons/fa6'
import { 
    handleAddItemCart, 
    handleIncrementCartQty, 
    handleDecrementCartQty 
} from '../store/cartSlice'
import toast from 'react-hot-toast'

const AddToCartButton = ({ data }) => {
    const dispatch = useDispatch()
    const cartItem = useSelector(state => state.cartItem.cart)
    
    // Debug logging
    console.log("=== ADD TO CART BUTTON ===")
    console.log("Product data:", data)
    console.log("Current cart:", cartItem)
    
    // Check if product is valid
    if (!data || !data._id) {
        console.error("Invalid product data!")
        return (
            <div className='w-full max-w-[150px] bg-gray-300 text-gray-500 px-2 py-2 rounded text-center'>
                Invalid Product
            </div>
        )
    }

    // Find if this product is already in cart
    const isAvailableCart = cartItem.find(item => 
        item?.productId?._id === data._id
    )
    
    console.log("Is in cart:", isAvailableCart)
    console.log("Cart quantity:", isAvailableCart?.qty || 0)

    const handleAddToCart = (e) => {
        e.preventDefault()
        e.stopPropagation()
        
        console.log("=== ADDING TO CART ===")
        console.log("Adding product:", data)
        
        try {
            const cartData = {
                productId: data,
                qty: 1
            }
            
            console.log("Dispatching handleAddItemCart with:", cartData)
            dispatch(handleAddItemCart(cartData))
            
            toast.success(`${data.name} added to cart!`)
            console.log("Item added successfully!")
            
        } catch (error) {
            console.error("Error adding to cart:", error)
            toast.error("Failed to add item to cart")
        }
    }

    const handleIncrementQty = (e) => {
        e.preventDefault()
        e.stopPropagation()
        
        console.log("=== INCREMENT QTY ===")
        console.log("Incrementing for product:", data._id)
        
        try {
            dispatch(handleIncrementCartQty(data._id))
            toast.success("Quantity increased!")
        } catch (error) {
            console.error("Error incrementing quantity:", error)
            toast.error("Failed to update quantity")
        }
    }

    const handleDecrementQty = (e) => {
        e.preventDefault()
        e.stopPropagation()
        
        console.log("=== DECREMENT QTY ===")
        console.log("Decrementing for product:", data._id)
        
        try {
            dispatch(handleDecrementCartQty(data._id))
            
            if (isAvailableCart?.qty === 1) {
                toast.success("Item removed from cart!")
            } else {
                toast.success("Quantity decreased!")
            }
        } catch (error) {
            console.error("Error decrementing quantity:", error)
            toast.error("Failed to update quantity")
        }
    }

    return (
        <div className='w-full max-w-[150px]'>
            {/* Debug info (remove in production) */}
            {process.env.NODE_ENV === 'development' && (
                <div className='text-xs bg-gray-100 p-1 mb-1 rounded'>
                    <p>ID: {data._id.slice(-4)}</p>
                    <p>In Cart: {isAvailableCart ? 'Yes' : 'No'}</p>
                    <p>Qty: {isAvailableCart?.qty || 0}</p>
                </div>
            )}

            {isAvailableCart?.qty > 0 ? (
                <div className='flex w-full h-10 lg:h-12 border border-green-600 rounded overflow-hidden'>
                    <button 
                        onClick={handleDecrementQty}
                        className='bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 flex items-center justify-center transition-colors'
                        disabled={!isAvailableCart?.qty}
                    >
                        <FaMinus size={12} />
                    </button>
                    <div className='flex-1 w-full font-semibold text-base flex items-center justify-center bg-white text-green-600 border-x border-green-600'>
                        {isAvailableCart?.qty}
                    </div>
                    <button 
                        onClick={handleIncrementQty}
                        className='bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 flex items-center justify-center transition-colors'
                    >
                        <FaPlus size={12} />
                    </button>
                </div>
            ) : (
                <button 
                    onClick={handleAddToCart}
                    className='bg-green-600 hover:bg-green-700 text-white px-2 py-2 lg:py-3 rounded w-full font-semibold transition-colors active:bg-green-800'
                >
                    Add to Cart
                </button>
            )}
        </div>
    )
}

export default AddToCartButton