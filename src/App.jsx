// import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import CityList from "./components/CityList";
import CountryList from './components/CountryList'
import { Suspense, lazy } from "react";
import City from "./components/City";
import Form from "./components/Form"
import { CitiesProvider } from "./contexts/CitiesContext";
import { AutContextProvider } from "./contexts/fakeAuthContext";
import ProtectedRoutes from "./pages/ProtectedRoutes";
import SpinnerFullPage from "./components/SpinnerFullPage";

// import AppLayout from './pages/AppLayout'
// import Homepage from "./pages/Homepage";
// import Product from './pages/Product'
// import Pricing from './pages/Pricing'
// import PageNotFound from "./pages/PageNotFound";
// import Login from "./pages/Login";

const AppLayout = lazy(() => import('./pages/AppLayout'))
const Homepage = lazy(() => import('./pages/Homepage'))
const Product = lazy(() => import('./pages/Product'))
const Pricing = lazy(() => import('./pages/Pricing'))
const PageNotFound = lazy(() => import('./pages/PageNotFound'))
const Login = lazy(() => import('./pages/Login'))




export default function App() {


  return (
    <AutContextProvider>
      <CitiesProvider>
        <BrowserRouter>
          <Suspense fallback={<SpinnerFullPage />}>
            <Routes>
              <Route path="/" element={<Homepage />}></Route>
              <Route path="product" element={<Product />}></Route>
              <Route path="pricing" element={<Pricing />}></Route>
              <Route path="app" element={
                <ProtectedRoutes>
                  <AppLayout />
                </ProtectedRoutes>
              }>
                <Route index element={<Navigate replace to="cities" />} />
                <Route path="cities" element={<CityList />} />
                <Route path="cities/:id" element={<City />} />
                <Route path="countries" element={<CountryList />} />
                <Route path="form" element={<Form />} />
              </Route>
              <Route path="login" element={<Login />} />
              <Route path="*" element={<PageNotFound />}></Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CitiesProvider>
    </AutContextProvider>
  )
}

