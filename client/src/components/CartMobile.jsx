// import React from 'react'
// import { useGlobalContext } from '../provider/GlobalProvider'
// import { FaCartShopping } from 'react-icons/fa6'
// import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
// import { Link } from 'react-router-dom'
// import { FaCaretRight } from "react-icons/fa";
// import { useSelector } from 'react-redux'

// const CartMobileLink = () => {
//     const { totalPrice, totalQty } = useGlobalContext()
//     const cartItem = useSelector(state => state.cartItem.cart)

//   return (
//     <>
//         {
//             cartItem[0] && (
//             <div className='sticky bottom-4 p-2'>
//             <div className='bg-green-600 px-2 py-1 rounded text-neutral-100 text-sm  flex items-center justify-between gap-3 lg:hidden'>
//                     <div className='flex items-center gap-2'>
//                         <div className='p-2 bg-green-500 rounded w-fit'>
//                             <FaCartShopping/>
//                         </div>
//                         <div className='text-xs'>
//                                 <p>{totalQty} items</p>
//                                 <p>{DisplayPriceInRupees(totalPrice)}</p>
//                         </div>
//                     </div>

//                     <Link to={"/cart"} className='flex items-center gap-1'>
//                         <span className='text-sm'>View Cart</span>
//                         <FaCaretRight/>
//                     </Link>
//                 </div>
//             </div>
//             )
//         }
//     </>
    
//   )
// }

// export default CartMobileLink





// components/CartMobileLink.jsx
import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaCartShopping } from "react-icons/fa6";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { Link } from "react-router-dom";
import { FaCaretRight } from "react-icons/fa";
import { fetchCartItems } from "../store/cartSlice";

const CartMobileLink = () => {
  const dispatch = useDispatch();
  const cartItem = useSelector((state) => state.cartItem.cart);

  useEffect(() => {
    if (!cartItem.length) dispatch(fetchCartItems());
  }, [dispatch, cartItem.length]);

  const { totalPrice, totalQty } = useMemo(() => {
    let tp = 0;
    let qtySum = 0;
    cartItem.forEach((item) => {
      const price = item.productId?.price || 0;
      const discount = item.productId?.discount || 0;
      const quantity = item.quantity || 0;
      const discounted =
        price - (price * (item.productId?.discount || 0)) / 100; // or use your helper
      tp += discounted * quantity;
      qtySum += quantity;
    });
    return { totalPrice: tp, totalQty: qtySum };
  }, [cartItem]);

  return (
    <>
      {cartItem[0] && (
        <div className="sticky bottom-4 p-2">
          <div className="bg-green-600 px-2 py-1 rounded text-neutral-100 text-sm flex items-center justify-between gap-3 lg:hidden">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-500 rounded w-fit">
                <FaCartShopping />
              </div>
              <div className="text-xs">
                <p>{totalQty} items</p>
                <p>{DisplayPriceInRupees(totalPrice)}</p>
              </div>
            </div>

            <Link to={"/cart"} className="flex items-center gap-1">
              <span className="text-sm">View Cart</span>
              <FaCaretRight />
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default CartMobileLink;
