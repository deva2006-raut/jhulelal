import React, { useState, useEffect, useCallback } from 'react';
import { CloudRain, Wind, Droplets, ThermometerSun, AlertTriangle, RefreshCw, MapPin, Search, Calendar } from 'lucide-react';

export default function LiveWeather() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationName, setLocationName] = useState('Nagpur, Maharashtra, India');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const NAGPUR_COORDS = { lat: 21.1458, lon: 79.0882 };

  const fetchWeatherData = async (lat, lon, locName) => {
    setLoading(true);
    setError(null);
    try {
      // Current Weather & Forecast
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m,wind_direction_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code&timezone=auto`
      );

      if (!response.ok) throw new Error('Failed to fetch weather data');
      const data = await response.json();

      const current = data.current;
      setWeatherData({
        temp: current.temperature_2m,
        feelsLike: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        windDirection: current.wind_direction_10m,
        precipitation: current.precipitation,
        lastUpdated: new Date().toLocaleTimeString(),
      });

      const daily = data.daily;
      const forecast = daily.time.slice(1, 8).map((time, index) => ({
        date: new Date(time).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        maxTemp: daily.temperature_2m_max[index + 1],
        minTemp: daily.temperature_2m_min[index + 1],
        rainProb: daily.precipitation_probability_max[index + 1],
      }));
      setForecastData(forecast);
      setLocationName(locName);

      // Cache data
      localStorage.setItem('orange_weather_cache', JSON.stringify({
        data: current,
        forecast,
        locationName: locName,
        timestamp: new Date().getTime()
      }));

    } catch (err) {
      console.error(err);
      setError('Unable to fetch live weather. Please check your connection or try again.');
      // Attempt to load cache
      const cached = localStorage.getItem('orange_weather_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        setWeatherData({
          temp: parsed.data.temperature_2m,
          feelsLike: parsed.data.apparent_temperature,
          humidity: parsed.data.relative_humidity_2m,
          windSpeed: parsed.data.wind_speed_10m,
          windDirection: parsed.data.wind_direction_10m,
          precipitation: parsed.data.precipitation,
          lastUpdated: new Date(parsed.timestamp).toLocaleTimeString() + ' (Cached)',
        });
        setForecastData(parsed.forecast);
        setLocationName(parsed.locationName);
        setError('Displaying cached data. Unable to reach weather service.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=5&language=en&format=json`);
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const selectLocation = (location) => {
    const locName = `${location.name}, ${location.admin1 || ''} ${location.country || ''}`.trim().replace(/,\s*$/, '');
    setSearchResults([]);
    setSearchQuery('');
    fetchWeatherData(location.latitude, location.longitude, locName);
  };

  const getUserLocation = useCallback(() => {
    setLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherData(position.coords.latitude, position.coords.longitude, 'My Current Location');
        },
        (error) => {
          console.warn('Geolocation denied or unavailable, using default.');
          fetchWeatherData(NAGPUR_COORDS.lat, NAGPUR_COORDS.lon, 'Nagpur, Maharashtra, India');
        },
        { timeout: 10000 }
      );
    } else {
      fetchWeatherData(NAGPUR_COORDS.lat, NAGPUR_COORDS.lon, 'Nagpur, Maharashtra, India');
    }
  }, []);

  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-forest-950 tracking-tight">Live Weather & Advisory</h1>
          <div className="flex items-center gap-2 mt-2 text-gray-600 font-medium bg-gray-100 px-3 py-1.5 rounded-lg inline-flex">
            <MapPin className="w-4 h-4 text-orange-500" /> 
            {locationName}
          </div>
        </div>
        
        <form onSubmit={handleLocationSearch} className="relative w-full md:w-auto">
          <div className="flex items-center">
            <input 
              type="text" 
              placeholder="Search city..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 pl-10 pr-4 py-2.5 border border-gray-300 rounded-l-xl focus:ring-2 focus:ring-forest-500 outline-none shadow-sm"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3" />
            <button type="submit" className="bg-forest-900 text-white px-4 py-2.5 rounded-r-xl font-bold hover:bg-forest-800 transition-colors shadow-sm">
              {isSearching ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Search'}
            </button>
          </div>
          
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
              {searchResults.map((loc) => (
                <button 
                  key={loc.id}
                  type="button"
                  onClick={() => selectLocation(loc)}
                  className="w-full text-left px-4 py-3 hover:bg-forest-50 border-b border-gray-50 last:border-0 font-medium text-gray-700"
                >
                  {loc.name}{loc.admin1 ? `, ${loc.admin1}` : ''}, {loc.country}
                </button>
              ))}
            </div>
          )}
        </form>
      </div>

      {error && (
        <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl flex gap-3 text-orange-800">
          <AlertTriangle className="w-6 h-6 shrink-0" />
          <div>
            <p className="font-bold">{error}</p>
            <button onClick={getUserLocation} className="text-sm underline mt-1 font-bold">Try again using location</button>
          </div>
        </div>
      )}

      {loading && !weatherData ? (
        <div className="bg-white p-16 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <RefreshCw className="w-12 h-12 text-forest-500 animate-spin mb-4" />
          <p className="text-lg font-bold text-forest-950">Fetching Live Weather Data...</p>
        </div>
      ) : weatherData && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-orange-400 to-orange-500 p-6 rounded-2xl shadow-md text-white flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <ThermometerSun className="w-8 h-8 opacity-80" />
                <span className="text-sm font-bold bg-white/20 px-2 py-1 rounded-md">Current</span>
              </div>
              <div>
                <p className="text-sm font-medium text-orange-100 mb-1">Temperature</p>
                <div className="flex items-end gap-2">
                  <h3 className="text-5xl font-extrabold">{Math.round(weatherData.temp)}°C</h3>
                </div>
                <p className="text-sm text-orange-100 mt-2 font-medium">Feels like {Math.round(weatherData.feelsLike)}°C</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl inline-block mb-4">
                  <Droplets className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Humidity & Rain</p>
                <h3 className="text-2xl font-extrabold text-forest-950">{weatherData.humidity}% Humidity</h3>
                <p className="text-sm text-gray-600 mt-2 font-medium">{weatherData.precipitation} mm precipitation</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="p-3 bg-gray-100 text-gray-600 rounded-xl inline-block mb-4">
                  <Wind className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Wind Conditions</p>
                <h3 className="text-2xl font-extrabold text-forest-950">{weatherData.windSpeed} km/h</h3>
                <p className="text-sm text-gray-600 mt-2 font-medium">Direction: {weatherData.windDirection}°</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Data Source</p>
                <p className="text-forest-900 font-bold">Open-Meteo API</p>
                <p className="text-xs text-gray-500 mt-2">Last Updated: {weatherData.lastUpdated}</p>
                <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline mt-1 block">Weather data by Open-Meteo.com</a>
              </div>
              <button 
                onClick={getUserLocation}
                disabled={loading}
                className="text-sm font-bold text-forest-700 bg-forest-50 hover:bg-forest-100 py-2 rounded-lg transition-colors mt-4 flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Refresh Data'}
              </button>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-extrabold text-forest-950 mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-forest-600" /> 7-Day Forecast
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {forecastData.map((day, idx) => (
                <div key={idx} className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                  <p className="font-bold text-forest-900 mb-2">{day.date}</p>
                  <div className="flex justify-center gap-2 text-sm mb-2">
                    <span className="text-orange-600 font-bold">{Math.round(day.maxTemp)}°</span>
                    <span className="text-blue-600 font-bold">{Math.round(day.minTemp)}°</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-xs text-gray-500 font-medium">
                    <CloudRain className="w-3 h-3 text-blue-400" /> {day.rainProb}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-extrabold text-forest-950 mb-6 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-orange-500" /> Weather-Based Advisory
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-blue-50 border border-blue-100 rounded-xl">
                <h4 className="font-bold text-blue-900 mb-2">Irrigation Advisory</h4>
                <p className="text-sm text-blue-800">
                  {weatherData.precipitation > 0 || forecastData[0]?.rainProb > 40 
                    ? "Rain is expected. Delay extensive irrigation and ensure proper drainage in the orchard." 
                    : "No significant rain expected soon. Monitor soil moisture and irrigate according to standard schedule."}
                </p>
              </div>
              <div className="p-5 bg-yellow-50 border border-yellow-100 rounded-xl">
                <h4 className="font-bold text-yellow-900 mb-2">Spraying Advisory</h4>
                <p className="text-sm text-yellow-800">
                  {weatherData.windSpeed > 15 
                    ? `High wind speeds (${weatherData.windSpeed} km/h). Postpone spraying activities to avoid chemical drift.` 
                    : "Wind speeds are favorable. Spraying operations can proceed following safety guidelines."}
                </p>
              </div>
              <div className="p-5 bg-green-50 border border-green-100 rounded-xl">
                <h4 className="font-bold text-green-900 mb-2">Heat Stress</h4>
                <p className="text-sm text-green-800">
                  {weatherData.temp > 35 
                    ? `High temperatures detected (${Math.round(weatherData.temp)}°C). Schedule manual labor during cooler morning or evening hours.` 
                    : "Temperatures are moderate. Normal field activities can be carried out."}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center font-medium">* Advisories are generated automatically based on current weather data and should be verified by agricultural experts.</p>
          </div>
        </div>
      )}
    </div>
  );
}
