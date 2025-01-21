import { loadStripe } from "@stripe/stripe-js";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppProvider } from "./store/AppProvider";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import {Home} from "./components/Home";
import { ProductsList } from "./components/ProductsList";
import { ProductDetails } from "./components/ProductDetails";
import { SearchResults } from "./components/SearchResults";
import { Cart } from "./components/Cart";
import { Elements } from "@stripe/react-stripe-js";
import { Checkout } from "./components/Checkout";
import  CheckoutSuccess  from "./components/CheckoutSuccess";
import AboutPage  from "./components/About";
import {HistoryItems} from "./components/Untilities/HistoryItems";
import PageAutoScroll from "./components/Untilities/PageAutoScroll";
import ScrollToTop from "./components/Untilities/ScrollToTop";
import {Orders} from "./components/Orders";
import { SignIn } from "./components/Pages/SignIn";
import { MyAccount } from "./components/MyAccount";
import { CartDrawer} from "./components/CartDrawer";


export default function App(){
    const stripePromise = loadStripe(
        process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
    );

    return(
        <BrowserRouter>
            <PageAutoScroll />
                <AppProvider>
                    <Header />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/:catid" element={<ProductsList />} />
                        <Route path="/:catid/:pid" element={<ProductDetails />} />
                        <Route path="/search" element={<SearchResults />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={
                            <Elements stripe={stripePromise} >
                                <Checkout />
                            </Elements>
                        } />
                        <Route path="/success" element={<CheckoutSuccess />} />
                        <Route path="/profile" element={<MyAccount />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/signin" element={<SignIn />} />
                        <Route path="/favorite" element={<ProductsList title="My Favorites" />} />

                    </Routes>
                    <CartDrawer />
                    <HistoryItems />
                    <Footer />
                </AppProvider>
                <ScrollToTop />
        </BrowserRouter>
    )
}