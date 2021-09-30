import * as actors from 'comedy';
import bb from 'bluebird';
import { Logger } from '../../logger';

const checkSum = async () => {
  try {
    const core = actors.createSystem({});
    const root = await core.rootActor();
    const myActor = await root.createChild({
      fuckIt: (to) => console.info(`Hello to ${to} from ${process.pid}!`)
    }, { mode: 'forked', clusterSize: 3, balancer: 'random', onCrash: 'respawn' });

    Logger.debug(JSON.stringify(await root.metrics()))
    await bb.each([1,2,3,4,5,6,7,8,9,10], number => myActor.sendAndReceive('fuckIt', process.pid + ' ' + number));
    Logger.debug(JSON.stringify(await root.metrics()))

    await core.destroy();
    Logger.debug(JSON.stringify(await root.metrics()))

  } catch (error) {
    Logger.error(error)
  }
}
