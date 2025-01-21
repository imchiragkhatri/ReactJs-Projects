import axios from "axios";
import { createContext, useContext , useEffect, useReducer } from "react";
import { useLocation } from "react-router-dom";
import { AppLoaderPlaceHolder } from "../components/AppLoaderPlaceholder";

const AppContext = createContext();
const MAX_HISTORY = 6;
const initialState = {
    cartItems:JSON.parse(localStorage.getItem('cartItems')) || [],
    wishListItems: JSON.parse(localStorage.getItem('wishLists')) || [],
    historyItems: JSON.parse(localStorage.getItem('historyItems')) || [],
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || null,
    categories:[],
    categoriesLoading: true,
    currentCategory:[],
    showCartDrawer:false,
    isMobile: window.matchMedia('(max-width: 992px)').matches,
    isDesktop: window.matchMedia('(min-width: 992px)').matches,
}

const appReducer = (state,action) => {
   // console.log("Reducer called: ", state, action.type);
    const {type,payload } = action;
    switch(type){
        case 'ADD_TO_CART':            
            return{
                ...state,
                showCartDrawer: false,
                cartItems:[...state.cartItems, payload]
            };
        case 'REMOVE_FROM_CART':
            return{
                ...state,
                cartItems:state.cartItems.filter(item=>item.id !== payload),
            }
        case 'INCREASE_QTY':
           // console.log("Increasing Cart Qty");
            return {
                ...state,
                cartItems: state.cartItems.map((item) => item.id === payload ? {...item, qty: item.qty + 1}:item )
            }
        case 'DECREASE_QTY':
            return {
                ...state,
                cartItems: state.cartItems.map((item) => item.id === payload ? {...item, qty: item.qty - 1}:item )
            }
        case 'ADD_TO_WISHLIST':
            return{
                ...state,
                wishListItems:[...state.wishListItems, payload]
            }
        case 'REMOVE_FROM_WISHLIST':
            return {
                ...state,
                wishListItems: state.wishListItems.filter(item => item.id !== payload)
            }
        case 'ADD_TO_HISTORY':
            const newProduct = payload;
            const isExists = state.historyItems.findIndex((item)=> item.id === newProduct.id);
            let updatedHistory = [...state.historyItems];
            if(isExists === -1 && payload.length !== 0){
                updatedHistory.unshift(newProduct);
                updatedHistory = updatedHistory.slice(0, MAX_HISTORY);
                localStorage.setItem("historyItems", JSON.stringify(updatedHistory));
            }
           // console.log("Dispatch: ", updatedHistory, " PayLoad", payload);
            return {
                ...state,
                historyItems: updatedHistory
            }
        case 'REMOVE_HISTORY':
            let removedHistory = state.historyItems.filter((item)=> item.id !== payload);
            localStorage.setItem("historyItems", JSON.stringify(removedHistory));
            return{
                ...state,
                historyItems: removedHistory
            }
        case 'CLEAR_HISTORY':
            localStorage.removeItem("historyItems");
            return{
                ...state,
                historyItems:payload
            }
        case 'APPLY_COUPON':
            const coupon_discount = Number(action.payload.cartDiscount) || 0;
            const getSubTotal = state.cartSubTotal
            return{
                ...state,
                coupon:payload,
                cartTotal: Number(getSubTotal - coupon_discount).toFixed(2)
            }
        case 'REMOVE_COUPON':
            return {
                ...state,
                coupon:[],
                cartTotal: state.cartSubTotal
            }
        case 'UPDATE_SHIPPING':
            return{
                ...state,
                shipping:payload
            }
        case 'UPDATE_TAX':
            return {
                ...state,
                tax: payload
            }
        case 'UPDATE_CART_SUB_TOTAL':
            return {
                ...state,
                cartSubTotal: payload
            }
        case 'UPDATE_CART_TOTAL':
            return {
                ...state,
                cartTotal: payload
            }
        case 'SET_CATEGORIES':
            return{
                ...state,
                categories: payload
            }
        case 'SET_CATEGORIES_LOADING':
            return{
                ...state,
                categoriesLoading:payload
            }
        case 'CLEAR_CART':
            return{
                ...state,
                cartItems: payload
            }
        case 'UPDATE_CURRENT_CATEGORY':
            return {
                ...state,
                currentCategory: payload
            }
        case 'TOGGLE_CART_DRAWER':
            return{
                ...state,
                showCartDrawer:payload
            }
        case 'SET_IS_MOBILE':
            return{
                ...state,
                isMobile:payload
            }
        case 'USER_SIGN_IN':
            localStorage.setItem('userInfo', JSON.stringify(payload));
            return{
                ...state,
                userInfo:payload
            }
        case 'USER_SIGN_OUT':
            localStorage.removeItem('userInfo');
            return{
                ...state,
                userInfo:payload
            }
        default:
            return state;
    }
}


export const AppProvider = ({children}) => {
    const [state, dispatch] = useReducer(appReducer, initialState);
    const isInCart = (id) => { return state.cartItems.some((item) => item.id === id)};
    const isInHistory = (id) => { return state.historyItems.some((item) => item.id === id)};
    const getCartQty = (id) => {
        const cartItem = state.cartItems.find((item) => item.id === id);
        return cartItem ? cartItem.qty : 0;
    };
    const isInWishlist = (id) => { return state.wishListItems.some((item) => item.id === id)};
    const location = useLocation();
    const formatPrice = (price,dec=2) => {
        return new Intl.NumberFormat("en-US", { // en-IN
          style: "currency",
          currency: "USD", // INR
          minimumFractionDigits: dec,
        }).format(price);
      };
      
    
    useEffect(()=> {
        const fetchCategories = async () => {
            await axios.get('https://dummyjson.com/products/categories')
            .then(response => {
                dispatch({ type: "SET_CATEGORIES", payload: response.data });
                dispatch ({ type: 'SET_CATEGORIES_LOADING', payload:false});
            });
        }
        fetchCategories();
    },[]);

    useEffect(() => {
        const handleResize = () => {
            dispatch({type:'SET_IS_MOBILE', payload:window.matchMedia('(max-width: 992px)').matches})
        };
    
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }, [dispatch]);

    useEffect(() => {
        if(location.pathname ==='/'){
            document.title = "Demo Store - ECommerce Site in ReacJS";
        }
       /*  localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        localStorage.setItem("wishLists", JSON.stringify(state.wishListItems)); */
      }, [location]);
     // console.log("App Reloaded..");

    if(state.categories.length === 0 ){
      //  console.log("Categories not loaded...");
        return <AppLoaderPlaceHolder />
    }

    return(
        <AppContext.Provider value={{state, dispatch, isInCart, isInWishlist, isInHistory, formatPrice, getCartQty, location}}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => { 
    return useContext(AppContext);
}

