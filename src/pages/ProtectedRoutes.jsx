/* eslint-disable react/prop-types */
// import React from 'react'

import { useNavigate } from "react-router-dom"
import { useAut } from "../contexts/fakeAuthContext"
import { useEffect } from "react"

export default function ProtectedRoutes({ children }) {
  const { isAuthenticated } = useAut()
  const navigate = useNavigate()
  useEffect(function () {
    if (!isAuthenticated) navigate('/')

  }, [isAuthenticated, navigate])

  return isAuthenticated ? children : null
}
