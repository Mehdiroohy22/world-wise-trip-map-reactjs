/* eslint-disable react/prop-types */
// import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvent } from 'react-leaflet'
import styles from './Map.module.css'
import { useState, useEffect } from 'react'
import { useCities } from '../contexts/CitiesContext'
import { useGeolocation } from '../hooks/geoLocation'
import Button from '../components/Button'
import { useUrlPosition } from '../hooks/useUrlPosition'
export default function Map() {

  const { cities } = useCities()
  const [mapPosition, setMapPosition] = useState([40, 0])

  const { isLoading: isLoadingPosition,
    position: geoLocationPosition,
    getPosition } = useGeolocation()
  const [lat, lng] = useUrlPosition()

  useEffect(function () {
    if (lat && lng) setMapPosition([lat, lng])
  }, [lat, lng])

  useEffect(function () {
    if (geoLocationPosition.lat) setMapPosition([geoLocationPosition.lat, geoLocationPosition.lng])
  }, [geoLocationPosition])


  return (
    <div className={styles.mapContainer}>
      {!geoLocationPosition.lat && <Button type="position" onClick={getPosition}>{isLoadingPosition ? 'Loading...' : "use your position"}</Button>}
      <MapContainer center={mapPosition} zoom={7} scrollWheelZoom={true} className={styles.map}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => {
          return (
            <>
              <Marker key={city.id} position={[city.position.lat, city.position.lng]}>
                <Popup>
                  <span>{city.emoji} {city.cityName}</span>
                </Popup>
              </Marker>
            </>
          )
        })}
        <MapViewCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div >
  )
}

function MapViewCenter({ position }) {
  const map = useMap()
  map.setView(position)
  return null
}

function DetectClick() {
  const navigate = useNavigate()
  useMapEvent({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
  })
}