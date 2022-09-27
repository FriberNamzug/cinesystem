import app from './app.js'
import { PORT } from './config/config.js'
//import logger from './config/logger.js'

app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT)
    //logger.info('Server is running on port ' + PORT)
})

