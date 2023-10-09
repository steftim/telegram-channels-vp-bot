import channel from '../models/channel.js';

const vp = async (bot) => {
    //
    //
    //      Do a vp
    //
    //
    bot.onText(/^\/vp(@\w+)?(?:\s+(\S+))?$/, async (msg, match) => {
        let replay;
        if (!!match[2]) {
            replay = match[2].slice(1);
        } else if (!!msg.reply_to_message) {
            replay = msg.reply_to_message.from.username;
        } else {
            bot.sendMessage(
                msg.chat.id,
                'Ви повинні або вказати нік юзера, або відповісти цією командою на повідомлення потрібного вам юзера!',
                { reply_to_message_id: msg.message_id }
            );
            return;
        }

        const own = msg.from.username;

        const ownChannels = await channel.findAllAdminChannels(own);
        const replayChannels = await channel.findAllAdminChannels(replay);

        let ownList = '';
        let replayList = '';

        await Promise.all(
            await ownChannels.map(async (item) => {
                await bot
                    .getChat(item.channelId)
                    .then(async (chat) => {
                        if (chat.type == 'channel') {
                            console.log(chat);
                            ownList += `Назва: ${chat.title}\nЛінк: t.me/${
                                chat.username ? chat.username : chat.invite_link
                            }\n\n`;
                        }
                    })
                    .catch((error) => {
                        bot.sendMessage(msg.chat.id, 'Помилка!', {
                            reply_to_message_id: msg.message_id
                        });
                    });
            })
        );

        await Promise.all(
            await replayChannels.map(async (item) => {
                await bot
                    .getChat(item.channelId)
                    .then(async (chat) => {
                        if (chat.type == 'channel') {
                            replayList += `Назва: ${chat.title}\nЛінк: t.me/${
                                chat.username ? chat.username : chat.invite_link
                            }\n\n`;
                        }
                    })
                    .catch((error) => {
                        bot.sendMessage(msg.chat.id, 'Помилка!', {
                            reply_to_message_id: msg.message_id
                        });
                    });
            })
        );

        if (ownList == '' || replayList == '') {
            return bot.sendMessage(msg.chat.id, 'Я нічо не знайшов 😭', {
                reply_to_message_id: msg.message_id
            });
        }
        bot.sendMessage(msg.chat.id, `${ownList}============\n\n${replayList}`, {
            reply_to_message_id: msg.message_id
        });
    });
};

export default vp;
