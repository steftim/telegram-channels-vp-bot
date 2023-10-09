import channel from '../models/channel.js';

const getall = async (bot) => {
    //
    //
    //      Get all channels
    //
    //

    bot.onText(/\/getall(@\w+)?/, async (msg, match) => {
        const channelsRaw = await channel.findAll();
        let channelList = '';

        const channels = new Array();

        channelsRaw.map((item) => {
            console.log('map: ', item);
            const existingItem = channels.find(
                (resultItem) => resultItem.channelId === item.channelId
            );
            if (existingItem) {
                existingItem.username.push(item.username);
            } else {
                channels.push({
                    channelId: item.channelId,
                    username: [item.username],
                    chatId: item.chatId
                });
            }
        });

        const channelsArr = new Array();
        await Promise.all(
            channels.map(async (item) => {
                await bot
                    .getChat(item.channelId)
                    .then(async (chat) => {
                        await bot
                            .getChatMemberCount(item.channelId)
                            .then((members) => {
                                channelsArr.push({
                                    title: chat.title,
                                    username: chat.invite_link
                                        ? chat.invite_link
                                        : 't.me/' + chat.username,
                                    admins: item.username,
                                    members: members
                                });
                            })
                            .catch((err) => null);
                    })
                    .catch((err) => null);
            })
        );

        channelsArr.sort((a, b) => b.members - a.members);

        await Promise.all(
            channelsArr.map(async (item) => {
                console.log(item);
                const mems = item.members / 1000.0;
                const title = item.title.replace(/[\\_+.'"]/g, '\\$&');
                const username = item.username.replace(/[_]/g, '\\$&');
                let admins = '';
                await Promise.all(
                    item.admins.map(async (admin, index) => {
                        console.log(admin);
                        if (index > 0) {
                            admins += ', ';
                        }
                        admins += '@' + admin.replace(/[_]/g, '\\$&');
                    })
                );
                console.log(admins);

                const channel = `\\[${mems.toFixed(
                    1
                )}k] [${title}](${username}) \n>> ${admins}\n\n`;
                channelList += channel;
            })
        );

        bot.sendMessage(msg.chat.id, 'Список каналів: \n' + channelList, {
            reply_to_message_id: msg.message_id,
            parse_mode: 'Markdown'
        });
    });
};

export default getall;
