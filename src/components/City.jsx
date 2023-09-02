/* eslint-disable no-unused-vars */
import { useNavigate, useParams } from "react-router-dom";
import styles from "./City.module.css";
import { useContext, useEffect } from "react";
import { useCities } from "../contexts/CitiesContext";
import Spinner from "./Spinner";
import Message from "./Message";
import Button from "./Button";
const url = 'http://localhost:9000'
const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function City() {
  const { id } = useParams()
  const { setIsLoading, isLoading, currentCity, getCity } = useCities()
  const navigate = useNavigate()

  // useEffect(function () {
  //   async function fetchCurrentCity() {
  //     try {
  //       setIsLoading(true)
  //       const res = await fetch(`${url}/cities/${id}`)
  //       const data = await res.json()
  //       setCurrentCity(data)
  //     }
  //     catch {
  //       alert('There was an error loading data!!')
  //     } finally {

  //       setIsLoading(false)
  //     }
  //   }
  //   fetchCurrentCity();

  // }, [id])
  // TEMP DATA

  useEffect(function () {
    getCity(id)
  }, [id, getCity])


  const { cityName, emoji, date, notes } = currentCity;
  // return <h1>city</h1>

  if (isLoading) return <Spinner />
  if (cityName?.length < 1) return <Message message='There was an error loading data!!' />
  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          <span>{emoji}</span> {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{formatDate(date || null)}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>

      <div>
        <Button type="back" onClick={() => navigate(-1)}>&larr; Back</Button>
      </div>
    </div>
  );
}

export default City;
