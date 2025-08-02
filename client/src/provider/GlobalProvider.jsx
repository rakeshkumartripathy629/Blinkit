// import React, { createContext, useContext, useEffect, useState } from "react";
// import Axios from "../utils/Axios";
// import SummaryApi from "../common/SummaryApi";
// import { useDispatch, useSelector } from "react-redux";
// import { handleAddItemCart } from "../store/cartSlice";
// import AxiosToastError from "../utils/AxiosToastError";
// import toast from "react-hot-toast";
// import { pricewithDiscount } from "../utils/PriceWithDiscount";
// import { handleAddAddress } from "../store/addressSlice";
// import { setOrder } from "../store/orderSlice";

// const GlobalContext = createContext(undefined);

// export const useGlobalContext = () => {
//   const ctx = useContext(GlobalContext);
//   if (ctx === undefined) {
//     throw new Error("useGlobalContext must be used within a GlobalProvider");
//   }
//   return ctx;
// };

// export const GlobalProvider = ({ children }) => {
//   const dispatch = useDispatch();
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [notDiscountTotalPrice, setNotDiscountTotalPrice] = useState(0);
//   const [totalQty, setTotalQty] = useState(0);

//   const cartItem = useSelector((state) => state.cartItem?.cart) || [];
//   const user = useSelector((state) => state?.user);

//   const fetchCartItem = async () => {
//     try {
//       const response = await Axios({ ...SummaryApi.getCartItem });
//       const { data: responseData } = response;
//       if (responseData.success) {
//         dispatch(handleAddItemCart(responseData.data));
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const updateCartItem = async (id, qty) => {
//     try {
//       const response = await Axios({
//         ...SummaryApi.updateCartItemQty,
//         data: { _id: id, qty },
//       });
//       const { data: responseData } = response;
//       if (responseData.success) {
//         await fetchCartItem();
//         return responseData;
//       }
//     } catch (error) {
//       AxiosToastError(error);
//       return error;
//     }
//   };

//   const deleteCartItem = async (cartId) => {
//     try {
//       const response = await Axios({
//         ...SummaryApi.deleteCartItem,
//         data: { _id: cartId },
//       });
//       const { data: responseData } = response;
//       if (responseData.success) {
//         toast.success(responseData.message);
//         await fetchCartItem();
//       }
//     } catch (error) {
//       AxiosToastError(error);
//     }
//   };

//   useEffect(() => {
//     const qty = cartItem.reduce((prev, curr) => prev + (curr.quantity || 0), 0);
//     setTotalQty(qty);

//     const tPrice = cartItem.reduce((prev, curr) => {
//       const priceAfterDiscount = pricewithDiscount(
//         curr?.productId?.price,
//         curr?.productId?.discount
//       );
//       return prev + (priceAfterDiscount || 0) * (curr.quantity || 0);
//     }, 0);
//     setTotalPrice(tPrice);

//     const notDiscountPrice = cartItem.reduce(
//       (prev, curr) => prev + (curr?.productId?.price || 0) * (curr.quantity || 0),
//       0
//     );
//     setNotDiscountTotalPrice(notDiscountPrice);
//   }, [cartItem]);

//   const handleLogoutOut = () => {
//     localStorage.clear();
//     dispatch(handleAddItemCart([]));
//   };

//   const fetchAddress = async () => {
//     try {
//       const response = await Axios({ ...SummaryApi.getAddress });
//       const { data: responseData } = response;
//       if (responseData.success) {
//         dispatch(handleAddAddress(responseData.data));
//       }
//     } catch (error) {
//       // silent
//     }
//   };

//   const fetchOrder = async () => {
//     try {
//       const response = await Axios({ ...SummaryApi.getOrderItems });
//       const { data: responseData } = response;
//       if (responseData.success) {
//         dispatch(setOrder(responseData.data));
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     if (!user?._id) {
//       handleLogoutOut();
//       return;
//     }
//     fetchCartItem();
//     fetchAddress();
//     fetchOrder();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user]);

//   return (
//     <GlobalContext.Provider
//       value={{
//         fetchCartItem,
//         updateCartItem,
//         deleteCartItem,
//         fetchAddress,
//         totalPrice,
//         totalQty,
//         notDiscountTotalPrice,
//         fetchOrder,
//       }}
//     >
//       {children}
//     </GlobalContext.Provider>
//   );
// };

// export default GlobalProvider;



// GlobalProvider.jsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { handleAddItemCart, handleIncrementCartQty, handleDecrementCartQty } from '../store/cartSlice'
import { pricewithDiscount } from '../utils/PriceWithDiscount'

const GlobalContext = createContext()

export const useGlobalContext = () => {
    const context = useContext(GlobalContext)
    if (!context) {
        throw new Error('useGlobalContext must be used within GlobalProvider')
    }
    return context
}

const GlobalProvider = ({ children }) => {
    // Get cart data from Redux
    const cartItem = useSelector(state => state.cartItem.cart)
    
    // Local state for calculations
    const [totalPrice, setTotalPrice] = useState(0)
    const [notDiscountTotalPrice, setNotDiscountTotalPrice] = useState(0)
    const [totalQty, setTotalQty] = useState(0)

    // Calculate totals whenever cart changes
    useEffect(() => {
        console.log("=== GLOBAL PROVIDER CALCULATIONS ===")
        console.log("Cart items:", cartItem)
        
        if (!cartItem || cartItem.length === 0) {
            setTotalPrice(0)
            setNotDiscountTotalPrice(0)
            setTotalQty(0)
            return
        }

        let calculatedTotalPrice = 0
        let calculatedNotDiscountTotalPrice = 0
        let calculatedTotalQty = 0

        cartItem.forEach(item => {
            const { productId, qty } = item
            
            if (productId && qty) {
                // Calculate discounted price
                const discountedPrice = pricewithDiscount(productId.price, productId.discount)
                const originalPrice = productId.price

                calculatedTotalPrice += discountedPrice * qty
                calculatedNotDiscountTotalPrice += originalPrice * qty
                calculatedTotalQty += qty

                console.log(`Item: ${productId.name}`)
                console.log(`Qty: ${qty}`)
                console.log(`Original Price: ${originalPrice}`)
                console.log(`Discounted Price: ${discountedPrice}`)
            }
        })

        console.log("Calculated totals:")
        console.log("Total Price:", calculatedTotalPrice)
        console.log("Not Discount Total Price:", calculatedNotDiscountTotalPrice)
        console.log("Total Qty:", calculatedTotalQty)

        setTotalPrice(calculatedTotalPrice)
        setNotDiscountTotalPrice(calculatedNotDiscountTotalPrice)
        setTotalQty(calculatedTotalQty)

    }, [cartItem])

    // Context value
    const value = {
        totalPrice,
        notDiscountTotalPrice,
        totalQty,
        cartItem, // Provide cart items too
        
        // Helper functions (optional)
        getTotalSavings: () => notDiscountTotalPrice - totalPrice,
        getCartItemCount: () => cartItem.length,
        isCartEmpty: () => !cartItem || cartItem.length === 0,
        
        // Action creators (re-export for convenience)
        handleAddItemCart,
        handleIncrementCartQty,
        handleDecrementCartQty
    }

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider