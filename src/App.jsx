import { Message } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Container, Typography, Box, TextField } from "@mui/material";
import { useState } from "react";

const API_WEATHER ='https://api.weatherapi.com/v1/current.json?key=4695cd02d9574e2686b193320241106&lang=es&q='

export default function App (){
  
  const [ciudad, setCiudad] = useState("");
  const [loading, setLoading] = useState (false)
  const [error, setError] = useState({
    error: false,
    message: "",
  })
  const [weather, setWeather] = useState({
    city: "",
    country: "",
    temp: "",
    condition: "",
    icon: "",
    conditionText: ""
  })
  
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    setError({
      error: false,
      message: "",
    })
    try{
      if(!ciudad.trim()) throw { message: "Campo obligatorio"}
      const response = await fetch(`${API_WEATHER}${ciudad}`)
      const data = await response.json();

      if(data.error) throw { message: data.error.message }
      const weatherData = {
        city: data.location.name,
        country: data.location.country,
        temp: data.current.temp_c,
        condition: data.current.condition.code,
        icon: data.current.condition.icon,
        conditionText: data.current.condition.text,
      }; 
      setWeather(weatherData)
      await fetch('http://localhost:5000/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(weatherData),
      });
    } catch(error){
      console.log(error);
      setError({
        error: true,
        message: error.message,
      })
    } finally{
      setLoading(false)
    }
      
    
  }

  return (
    <Container
      maxWidth = "xs"
      sx={{mt: 2}}
    >
      <Typography
        variant="h3"
        component="h1"
        align="center"
        gutterBottom
      >
        Aplicacion del Clima
      </Typography>
      <Box
        sx={{display: "grid", gap:2}}
        component="form"
        autoComplete="off"
        onSubmit={onSubmit}
      >
      <TextField
          id="ciudad"
          label="Ciudad"
          variant="outlined"
          size="small"
          required
          fullWidth
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
          error={error.error}
          helperText={error.message}
      />

      <LoadingButton
        type="submit"
        variant="contained"
        loading={loading}
        loadingIndicator="Buscando ciudad. Aguarde"
      >
        Buscar
      </LoadingButton>
      {weather.city &&(<Box
        sx={{
          mt: 2,
          display: "grid",
          gap: 2,
          textAlign:"center"
        }}
      >
        <Typography variant="h4" component="h2">
          {weather.city},{weather.country}
        </Typography>
        <Box
          component="img"
          alt={weather.conditionText}    
          src={weather.icon}
          sx={{margin:"0auto"}}  
        />
        <Typography variant="h5" component="h3">
          {weather.temp} °C
        </Typography>
        <Typography variant="h6" component="h4">
          {weather.conditionText}
        </Typography>
      
      </Box>)}
      
      <Typography
        textAlign="center"
        sx={{ mt: 2, fontSize: "10px" }}
      >
        Powered by:{" "}
        <a
          href="https://www.weatherapi.com/"
          title="Weather API"
        >
          WeatherAPI.com
        </a>
      </Typography>
      </Box>
    </Container>
  );
}