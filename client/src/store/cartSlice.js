// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//     cart : []
// }

// const cartSlice = createSlice({
//     name : "cartItem",
//     initialState : initialState,
//     reducers : {
//         handleAddItemCart : (state,action)=>{
//            state.cart = [...action.payload]
//         },
//     }
// })

// export const { handleAddItemCart } = cartSlice.actions

// export default cartSlice.reducer



// cartSlice.js - Complete version with all possible exports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Initial state
const initialState = {
    cart: [],
    loading: false,
    error: null
}

// Async thunk for fetching cart items (if you have API)
export const fetchCartItems = createAsyncThunk(
    'cartItem/fetchCartItems',
    async (userId, { rejectWithValue }) => {
        try {
            console.log("=== FETCHING CART ITEMS ===")
            console.log("User ID:", userId)
            
            // If you have API endpoint
            // const response = await fetch(`/api/cart/${userId}`)
            // const data = await response.json()
            // return data
            
            // For now, return empty array or get from localStorage
            const savedCart = localStorage.getItem('cart')
            const cartData = savedCart ? JSON.parse(savedCart) : []
            
            console.log("Fetched cart data:", cartData)
            return cartData
            
        } catch (error) {
            console.error("Error fetching cart:", error)
            return rejectWithValue(error.message)
        }
    }
)

// Async thunk for saving cart to server
export const saveCartToServer = createAsyncThunk(
    'cartItem/saveCartToServer',
    async (cartData, { rejectWithValue }) => {
        try {
            console.log("=== SAVING CART TO SERVER ===")
            console.log("Cart data:", cartData)
            
            // If you have API endpoint
            // const response = await fetch('/api/cart', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(cartData)
            // })
            // return await response.json()
            
            // For now, save to localStorage
            localStorage.setItem('cart', JSON.stringify(cartData))
            return cartData
            
        } catch (error) {
            console.error("Error saving cart:", error)
            return rejectWithValue(error.message)
        }
    }
)

// Cart slice
const cartSlice = createSlice({
    name: 'cartItem',
    initialState,
    reducers: {
        // Add item to cart
        handleAddItemCart: (state, action) => {
            console.log("=== ADDING TO CART ===")
            console.log("Action payload:", action.payload)
            
            const { productId, qty = 1 } = action.payload
            
            if (!productId || !productId._id) {
                console.error("Invalid product data!")
                return
            }
            
            // Check if item already exists
            const existingItemIndex = state.cart.findIndex(item => 
                item.productId._id === productId._id
            )
            
            if (existingItemIndex >= 0) {
                // Item exists, update quantity
                console.log("Item exists, updating quantity")
                state.cart[existingItemIndex].qty += qty
            } else {
                // New item, add to cart
                console.log("New item, adding to cart")
                const newCartItem = {
                    _id: `cart_${productId._id}_${Date.now()}`, // Unique cart item ID
                    productId: productId,
                    qty: qty
                }
                state.cart.push(newCartItem)
            }
            
            console.log("Updated cart:", state.cart)
        },
        
        // Increase quantity
        handleIncrementCartQty: (state, action) => {
            console.log("=== INCREMENT QTY ===")
            const productId = action.payload
            
            const item = state.cart.find(item => 
                item.productId._id === productId
            )
            
            if (item) {
                item.qty += 1
                console.log("Quantity increased to:", item.qty)
            }
        },
        
        // Decrease quantity
        handleDecrementCartQty: (state, action) => {
            console.log("=== DECREMENT QTY ===")
            const productId = action.payload
            
            const itemIndex = state.cart.findIndex(item => 
                item.productId._id === productId
            )
            
            if (itemIndex >= 0) {
                if (state.cart[itemIndex].qty > 1) {
                    state.cart[itemIndex].qty -= 1
                    console.log("Quantity decreased to:", state.cart[itemIndex].qty)
                } else {
                    // Remove item if quantity becomes 0
                    state.cart.splice(itemIndex, 1)
                    console.log("Item removed from cart")
                }
            }
        },
        
        // Remove item from cart
        handleRemoveCartItem: (state, action) => {
            console.log("=== REMOVE FROM CART ===")
            const productId = action.payload
            
            state.cart = state.cart.filter(item => 
                item.productId._id !== productId
            )
            
            console.log("Item removed, updated cart:", state.cart)
        },
        
        // Update cart item quantity
        updateCartItem: (state, action) => {
            console.log("=== UPDATE CART ITEM ===")
            const { productId, qty } = action.payload
            
            const itemIndex = state.cart.findIndex(item => 
                item.productId._id === productId
            )
            
            if (itemIndex >= 0) {
                if (qty > 0) {
                    state.cart[itemIndex].qty = qty
                    console.log("Item quantity updated to:", qty)
                } else {
                    state.cart.splice(itemIndex, 1)
                    console.log("Item removed due to zero quantity")
                }
            }
        },
        
        // Clear entire cart
        handleClearCart: (state) => {
            console.log("=== CLEAR CART ===")
            state.cart = []
        },
        
        // Set cart (for loading from storage/API)
        setCart: (state, action) => {
            console.log("=== SET CART ===")
            state.cart = action.payload || []
        },
        
        // Reset error state
        clearError: (state) => {
            state.error = null
        },
        
        // Set loading state
        setLoading: (state, action) => {
            state.loading = action.payload
        }
    },
    
    // Handle async thunk cases
    extraReducers: (builder) => {
        builder
            // Fetch cart items
            .addCase(fetchCartItems.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchCartItems.fulfilled, (state, action) => {
                state.loading = false
                state.cart = action.payload || []
            })
            .addCase(fetchCartItems.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            
            // Save cart to server
            .addCase(saveCartToServer.pending, (state) => {
                state.loading = true
            })
            .addCase(saveCartToServer.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(saveCartToServer.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

// Export actions
export const {
    handleAddItemCart,
    handleIncrementCartQty,
    handleDecrementCartQty,
    handleRemoveCartItem,
    updateCartItem,
    handleClearCart,
    setCart,
    clearError,
    setLoading
} = cartSlice.actions

// Export reducer
export default cartSlice.reducer

// Alternative action names (for compatibility)
export const addToCart = handleAddItemCart
export const incrementQty = handleIncrementCartQty
export const decrementQty = handleDecrementCartQty
export const removeFromCart = handleRemoveCartItem
export const clearCart = handleClearCart

// Helper functions
export const getCartTotal = (cart) => {
    return cart.reduce((total, item) => {
        const price = item.productId?.price || 0
        const discount = item.productId?.discount || 0
        const discountedPrice = price - (price * discount / 100)
        return total + (discountedPrice * item.qty)
    }, 0)
}

export const getCartQtyTotal = (cart) => {
    return cart.reduce((total, item) => total + (item.qty || 0), 0)
}

export const getCartItemCount = (cart) => {
    return cart.length
}

export const findCartItem = (cart, productId) => {
    return cart.find(item => item.productId._id === productId)
}

// Selector functions (use with useSelector)
export const selectCart = (state) => state.cartItem.cart
export const selectCartLoading = (state) => state.cartItem.loading
export const selectCartError = (state) => state.cartItem.error
export const selectCartTotal = (state) => getCartTotal(state.cartItem.cart)
export const selectCartQtyTotal = (state) => getCartQtyTotal(state.cartItem.cart)
export const selectCartItemCount = (state) => getCartItemCount(state.cartItem.cart)