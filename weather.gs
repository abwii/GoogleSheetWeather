async function getWeather(villeInput) {
  const apiKey = '913514966f21283d80aff33eed48bc90'; // Remplacez par votre clé API OpenWeatherMap
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${villeInput}&appid=${apiKey}&units=metric`;

  try {
    const response = await UrlFetchApp.fetch(apiUrl);
    const data = JSON.parse(response.getContentText());
    const cityName = data.name;
    const temperature = data.main.temp;
    const description = data.weather[0].description;

    return `${temperature} / ${description}`;
  } catch (error) {
    Logger.log('Erreur lors de la récupération des données météo:', error);
    return 'Erreur lors de la récupération des données météo';
  }
}

function getCityValue() {
  var feuilleDeCalcul = SpreadsheetApp.getActiveSpreadsheet();
  var feuille = feuilleDeCalcul.getSheets()[0];
  var celluleA2 = feuille.getRange("A2");
  var valeurA2 = celluleA2.getValue();

  return valeurA2;
}

function printCityWeather() {
  var ville = getCityValue();
  getWeather(ville)
    .then((meteo) => {
      var feuilleDeCalcul = SpreadsheetApp.getActiveSpreadsheet();
      var feuille = feuilleDeCalcul.getSheets()[0];
      var celluleB2 = feuille.getRange("B2");
      celluleB2.setValue(meteo);
    })
    .catch((error) => {
      Logger.log("Erreur lors de l'impression des données météo :", error);
    });
}

function printCityForecast() {
  const apiKey = '913514966f21283d80aff33eed48bc90';
  const villeInput = getCityValue();
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${villeInput}&appid=${apiKey}&units=metric`;

  try {
    const response = UrlFetchApp.fetch(apiUrl);
    const data = JSON.parse(response.getContentText());

    const forecasts = data.list.slice(0, 7); // Prendre les 7 premières prévisions
    const forecastData = forecasts.map((forecast) => {
      const dateTime = forecast.dt_txt;
      const temperature = forecast.main.temp;
      const description = forecast.weather[0].description;
      return `${temperature.toFixed(2)} / ${description}`;
    });

    // Ouvrir la feuille de calcul active
    var feuilleDeCalcul = SpreadsheetApp.getActiveSpreadsheet();
    var feuille = feuilleDeCalcul.getSheets()[0];

    // Spécifier les cellules C2 à I2 pour les prévisions
    var cellules = feuille.getRange("C2:I2");

    // Écrire les prévisions dans les cases C2 à I2
    cellules.setValues([forecastData.map((item) => [item])]);

    return forecastData;
  } catch (error) {
    Logger.log('Erreur lors de la récupération des prévisions météo:', error);
    return ['Erreur lors de la récupération des prévisions météo'];
  }
}


// Appeler la fonction pour imprimer les données météo dans la cellule B2
printCityWeather();
printCityForecast();