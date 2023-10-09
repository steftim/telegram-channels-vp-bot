import i from './i.js';
import link from './link.js';
import unlink from './unlink.js';
import getall from './getall.js';
import vp from './vp.js';

const commandsInit = async (bot) => {
    await i(bot);
    await link(bot);
    await unlink(bot);
    await getall(bot);
    await vp(bot);
};
export default commandsInit;
