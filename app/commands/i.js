import channel from '../models/channel.js';

const i = async (bot) => {
    bot.onText(/^\/i(@\w+)?(?:\s+(\S+))?$/, async (msg, match) => {
        let chann;
        if (!!match[2]) {
            chann = await channel.findAllAdminChannels(match[2].slice(1));
        } else if (!!msg.reply_to_message) {
            chann = await channel.findAllAdminChannels(msg.reply_to_message.from.username);
        } else {
            bot.sendMessage(
                msg.chat.id,
                'Ви повинні або вказати нік юзера, або відповісти цією командою на повідомлення потрібного вам юзера!',
                { reply_to_message_id: msg.message_id }
            );
            return;
        }

        const chans = new Array();

        await Promise.all(
            await chann.map(async (item) => {
                await bot
                    .getChat(item.channelId)
                    .then((chat) => {
                        if (chat.type == 'channel') {
                            bot.getChatMemberCount(item.channelId)
                                .then((members) => {
                                    chans.push(
                                        `Назва: ${
                                            chat.title
                                        }\nКількість підписників: ${members}\nЛінк: t.me/${
                                            chat.username ? chat.username : chat.invite_link
                                        }`
                                    );
                                })
                                .catch(() => {
                                    chans.push(false);
                                });
                        } else {
                            chans.push(false);
                            bot.sendMessage(msg.chat.id, 'Канал не знайдено!', {
                                reply_to_message_id: msg.message_id
                            });
                        }
                    })
                    .catch(() => {
                        bot.sendMessage(msg.chat.id, 'Канал не знайдено!', {
                            reply_to_message_id: msg.message_id
                        });
                    });
            })
        );
        bot.sendMessage(msg.chat.id, 'Я нічо не знайшов 😭', {
            reply_to_message_id: msg.message_id
        });
    });
};

export default i;
