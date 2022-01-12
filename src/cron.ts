import {CronJob} from 'cron'
import {Config} from './config'

const cron = new CronJob(Config.cronJobExpression, () => {
    console.log('Executing cron job once every hour')
})

export {cron}