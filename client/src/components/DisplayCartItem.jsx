import React from 'react'
import { IoClose } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { FaCaretRight } from "react-icons/fa";
import { useSelector } from 'react-redux'
import AddToCartButton from './AddToCartButton'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import imageEmpty from '../assets/empty_cart.webp'
import toast from 'react-hot-toast'

const DisplayCartItem = ({close}) => {
    const { notDiscountTotalPrice, totalPrice, totalQty } = useGlobalContext()
    const cartItem = useSelector(state => state.cartItem.cart)
    const user = useSelector(state => state.user)
    const navigate = useNavigate()

    const redirectToCheckoutPage = () => {
        if(user?._id){
            navigate("/checkout")
            if(close){
                close()
            }
            return
        }
        toast("Please Login")
    }

    const hasCartItems = cartItem && Array.isArray(cartItem) && cartItem.length > 0

    return (
        <section className='bg-neutral-900 fixed top-0 bottom-0 right-0 left-0 bg-opacity-70 z-50'>
            <div className='bg-white w-full max-w-sm min-h-screen max-h-screen ml-auto'>
                <div className='flex items-center p-4 shadow-md gap-3 justify-between'>
                    <h2 className='font-semibold'>Cart ({cartItem?.length || 0})</h2>
                    <Link to={"/"} className='lg:hidden'>
                        <IoClose size={25}/>
                    </Link>
                    <button onClick={close} className='hidden lg:block'>
                        <IoClose size={25}/>
                    </button>
                </div>

                <div className='min-h-[75vh] lg:min-h-[80vh] h-full max-h-[calc(100vh-150px)] bg-blue-50 p-2 flex flex-col gap-4'>
                    {hasCartItems ? (
                        <>
                            <div className='flex items-center justify-between px-4 py-2 bg-blue-100 text-blue-500 rounded-full'>
                                <p>Your total savings</p>
                                <p>{DisplayPriceInRupees(notDiscountTotalPrice - totalPrice)}</p>
                            </div>
                            
                            <div className='bg-white rounded-lg p-4 grid gap-5 overflow-auto'>
                                {cartItem.map((item, index) => (
                                    <div key={`cart-item-${index}-${item?._id}`} className='flex w-full gap-4 border-b pb-2 last:border-b-0'>
                                        <div className='w-16 h-16 min-h-16 min-w-16 bg-gray-200 border rounded overflow-hidden'>
                                            {item?.productId?.image?.[0] ? (
                                                <img
                                                    src={item.productId.image[0]}
                                                    alt={item?.productId?.name || 'Product'}
                                                    className='w-full h-full object-cover'
                                                />
                                            ) : (
                                                <div className='w-full h-full flex items-center justify-center text-xs text-gray-500'>
                                                    No Image
                                                </div>
                                            )}
                                        </div>
                                        <div className='flex-1 text-xs'>
                                            <p className='text-sm font-medium line-clamp-2 mb-1'>
                                                {item?.productId?.name || 'Product Name'}
                                            </p>
                                            <p className='text-neutral-400 mb-1'>
                                                {item?.productId?.unit || 'Unit'}
                                            </p>
                                            <p className='font-semibold text-green-600 mb-1'>
                                                {item?.productId?.price ? 
                                                    DisplayPriceInRupees(pricewithDiscount(item.productId.price, item.productId.discount)) 
                                                    : 'Price not available'
                                                }
                                            </p>
                                            <p className='text-xs text-gray-500'>
                                                Qty: {item?.qty || 1}
                                            </p>
                                        </div>
                                        <div className='flex flex-col justify-center'>
                                            <AddToCartButton data={item?.productId}/>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className='bg-white p-4 rounded'>
                                <h3 className='font-semibold mb-2'>Bill details</h3>
                                <div className='space-y-2 text-sm'>
                                    <div className='flex justify-between'>
                                        <p>Items total</p>
                                        <p className='flex items-center gap-2'>
                                            <span className='line-through text-neutral-400'>
                                                {DisplayPriceInRupees(notDiscountTotalPrice)}
                                            </span>
                                            <span>{DisplayPriceInRupees(totalPrice)}</span>
                                        </p>
                                    </div>
                                    <div className='flex justify-between'>
                                        <p>Quantity total</p>
                                        <p>{totalQty} item{totalQty > 1 ? 's' : ''}</p>
                                    </div>
                                    <div className='flex justify-between'>
                                        <p>Delivery Charge</p>
                                        <p>Free</p>
                                    </div>
                                    <div className='flex justify-between font-semibold border-t pt-2'>
                                        <p>Grand total</p>
                                        <p>{DisplayPriceInRupees(totalPrice)}</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className='bg-white flex flex-col justify-center items-center h-full rounded'>
                            <img
                                src={imageEmpty}
                                alt="Empty Cart"
                                className='w-full max-w-xs h-auto object-scale-down' 
                            />
                            <p className='text-neutral-500 mb-4'>Your cart is empty</p>
                            <Link 
                                onClick={close} 
                                to={"/"} 
                                className='block bg-green-600 px-4 py-2 text-white rounded hover:bg-green-700 transition-colors'
                            >
                                Shop Now
                            </Link>
                        </div>
                    )}
                </div>

                {hasCartItems && (
                    <div className='p-2'>
                        <div className='bg-green-700 text-neutral-100 px-4 font-bold text-base py-4 rounded flex items-center justify-between'>
                            <div>
                                {DisplayPriceInRupees(totalPrice)}
                            </div>
                            <button 
                                onClick={redirectToCheckoutPage} 
                                className='flex items-center gap-1 hover:bg-green-800 px-2 py-1 rounded transition-colors'
                            >
                                Proceed
                                <span><FaCaretRight/></span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}

export default DisplayCartItem