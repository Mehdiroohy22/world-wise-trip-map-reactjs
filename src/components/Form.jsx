// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import Message from './Message'
import Spinner from './Spinner'
import styles from "./Form.module.css";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { useUrlPosition } from "../hooks/useUrlPosition";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../contexts/CitiesContext";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client"

function Form() {

  const { createCity, isLoading } = useCities()
  const [lat, lng] = useUrlPosition()
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [isLoadingUrl, setIsLoadingUrl] = useState(false)
  const [emoji, setEmoji] = useState('')
  const [geoCodeError, setGeoCodeError] = useState('')

  useEffect(function () {
    if (!lat && !lng) return
    async function fetchCityData() {
      try {
        setIsLoadingUrl(true)
        setGeoCodeError('')
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`)
        const data = await res.json()
        if (!data.countryCode) throw new Error("That doesn't seem to be a city. Click somewhere elese")
        setCityName(data.city || data.locality || '')
        setCountry(data.countryName || '')
        setEmoji(convertToEmoji(data.countryCode))
      } catch (err) {
        setGeoCodeError(err.message)
      } finally {
        setIsLoadingUrl(false)
      }
    }
    fetchCityData()
  }, [lat, lng])

  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    const newCity = {
      cityName,
      country,
      date,
      notes,
      emoji,
      position: { lat, lng }
    }
    await createCity(newCity)
    navigate('/app/cities')
  }


  if (!lat && !lng) return <Message message='Start by clicking somewhere on the map!' />
  if (isLoadingUrl) return <Spinner />
  if (geoCodeError) return <Message message={geoCodeError} />
  return (
    <form className={`${styles.form} ${isLoading ? styles.loading : ''}`} onSubmit={(e) => handleSubmit(e)}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker selected={date} onChange={date => setDate(date)} dateFormat='dd/MM/yyyy' id="date" />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type='primary'>Add</Button>
        <Button type='back' onClick={(e) => {
          e.preventDefault()
          navigate(-1)
        }}>&larr; Back</Button>
      </div>
    </form>
  );
}

export default Form;
