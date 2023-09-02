/* eslint-disable react/prop-types */
import { useCallback, useReducer } from "react";
import { createContext, useEffect, useContext } from "react";

const url = 'http://localhost:9000'
const CitiesContext = createContext()

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {}
}

function reducer(currState, action) {
  switch (action.type) {
    case 'loader':
      return {
        ...currState,
        isLoading: true
      }

    case 'cities/loaded':
      return {
        ...currState,
        cities: action.payload,
        isLoading: false
      }
    case 'city/create':
      return {
        ...currState,
        isLoading: false,
        cities: [...currState.cities, action.payload],
        currentCity: action.payload
      }

    case 'city/delete':
      return {
        ...currState,
        cities: currState.cities.filter(city => city.id !== action.payload),
        isLoading: false
      }
    case 'city/get':
      return {
        ...currState,
        currentCity: action.payload,
        isLoading: false
      }
  }
}

function CitiesProvider({ children }) {

  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(reducer, initialState)

  // const [cities, setCities] = useState([])
  // const [isLoading, setIsLoading] = useState(false)
  // const [currentCity, setCurrentCity] = useState({})
  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: 'loader' })
      try {
        const res = await fetch(`${url}/cities`)
        const data = await res.json()
        dispatch({ type: 'cities/loaded', payload: data })
      }
      catch {
        alert('There was an error loading data!!')
      }
    }
    fetchCities();

  }, [])


  const getCity = useCallback(async function getCity(id) {
    if (Number(id) === currentCity.id) return;
    dispatch({ type: 'loader' })
    try {
      const res = await fetch(`${url}/cities/${id}`)
      const data = await res.json()
      dispatch({ type: 'city/get', payload: data })
    }
    catch {
      alert('There was an error loading data!!')
    }
  }, [currentCity.id])



  async function createCity(city) {
    dispatch({ type: 'loader' })
    try {
      const res = await fetch(`${url}/cities`, {
        method: 'POST',
        body: JSON.stringify(city),
        headers: {
          "Content-Type": 'application/json'
        }
      })
      const data = await res.json()
      dispatch({ type: 'city/create', payload: data })
    }
    catch {
      alert('There was an error loading data!!')
    }
  }


  async function deleteCity(id) {
    dispatch({ type: 'loader' })
    try {
      await fetch(`${url}/cities/${id}`, {
        method: 'DELETE',
      })
      dispatch({ type: 'city/delete', payload: id })
    }
    catch {
      alert('There was an error deleting request!!')
    }
  }






  return <CitiesContext.Provider value={{
    cities,
    isLoading,
    currentCity,
    getCity,
    createCity,
    deleteCity
  }}>
    {children}
  </CitiesContext.Provider>
}

function useCities() {
  const value = useContext(CitiesContext)
  if (value === undefined) throw new Error('CitiesContext was placed outside of CitiesProvider!')
  return value
}

export { CitiesProvider, useCities }