import * as Sentry from '@sentry/node';
import Queue from 'bull';
import redisConfig from '../../config/redis';

import * as jobs from '../jobs';

const queues = Object.values(jobs).map(job => ({
  bull: new Queue(job.key, redisConfig),
  name: job.key,
  handle: job.handle,
  options: job.options,
}));

export default {
  queues,
  add(name, data) {
    const queue = this.queues.find(queue => queue.name === name);
    return queue.bull.add(data, queue.options);
  },
  process() {
    return this.queues.forEach(queue => {
      queue.bull.process(queue.handle);

      queue.bull.on('failed', (job, err) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('Job Faild', queue.name, job.data);
          console.log(err);
        }
        Sentry.captureException(err);
      });

      queue.bull.on('completed', (job, result) => {
        console.log('Job completed', queue.name, job.data, result);
      });
    });
  },
};
