import { Router } from 'express';
const router = Router();
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';
//import { error } from 'console';
// TODO: POST Request with city name to retrieve weather data
router.post('/', (req, res) => {
    const { cityName } = req.body;
    if (req.body) {
        WeatherService.getWeatherForCity(cityName)
            .then((weatherdata) => {
            res.json(weatherdata);
        })
            .catch((error) => {
            res.status(500)
                .json({ error: `(Jen) Failed to fetch weather data ${error.data}` });
        });
    }
});
// TODO: GET search history
router.get('/history', async (_req, res) => {
    try {
        const savedCities = await HistoryService.getCities();
        res.json(savedCities);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});
// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
    try {
        if (!req.params.id) {
            res.status(400).json({ msg: 'id must have a value' });
        }
        await HistoryService.removeCity(req.params.id);
        res.json({ success: 'City successfully removed from search history' });
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});
export default router;
