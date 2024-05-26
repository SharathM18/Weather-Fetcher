import React, { useEffect, useRef, useState } from "react";
import "./App.css";

const App = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cityName, setCityName] = useState(null);
  const inputCityNameRef = useRef(null);

  useEffect(() => {
    if (cityName === null) {
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      setData(null);

      try {
        const response = await fetch(
          `http://api.weatherapi.com/v1/current.json?key=3775fe69ee0a4d9ebbf163205241704&q=${cityName}&aqi=yes`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const res = await response.json();
        setData(res);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [cityName]);

  const handleFetch = () => {
    const getCityName = inputCityNameRef.current.value.trim();
    if (getCityName) {
      setCityName(getCityName);
      inputCityNameRef.current.value = "";
    }
  };

  return (
    <div className="weather-container">
      <header>
        <h1>Weather API</h1>
      </header>
      <section className="ip-get-data">
        <input
          type="text"
          placeholder="Enter the city name"
          ref={inputCityNameRef}
        />
        <button onClick={handleFetch}>Get Data</button>
      </section>
      <section>
        {isLoading && <h1 className="loading">Loading...</h1>}
        {error && <h1 className="error">Error: {error}</h1>}
      </section>
      {data && (
        <section className="response-data">
          <h2>
            {data.location.name}, {data.location.region},{" "}
            {data.location.country}
          </h2>
          <div className="more-data">
            <p>Local Time: {data.location.localtime}</p>
            <p>Temperature: {data.current.temp_c}°C</p>
            <p>Condition: {data.current.condition.text}</p>
            <p>Wind Speed: {data.current.wind_kph} kph</p>
            <p>Humidity: {data.current.humidity}%</p>
            <p>Feels Like: {data.current.feelslike_c}°C</p>
          </div>
          <img
            src={`https:${data.current.condition.icon}`}
            alt={data.current.condition.text}
          />
        </section>
      )}
    </div>
  );
};

export default App;
