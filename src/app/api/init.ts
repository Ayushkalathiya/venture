import { rechargeEmailsJob } from '@/lib/cron';

// Start the cron job when the app initializes
rechargeEmailsJob.start(); 