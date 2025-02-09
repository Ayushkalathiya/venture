import { CronJob } from 'cron';
import { checkRechargeEmails } from './gmail-service';

// Check for recharge emails every 5 minutes
export const rechargeEmailsJob = new CronJob('*/5 * * * *', async () => {
  console.log('Checking for recharge emails...');
  await checkRechargeEmails();
}); 