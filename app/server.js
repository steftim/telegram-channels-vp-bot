import TelegramBot from 'node-telegram-bot-api';
import channel from './models/channel.js';

// replace the value below with the Telegram token you receive from @BotFather
const token = '';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/i( .+)?/, (msg, match) => {
    if (!msg.reply_to_message && !match[1]) {
        bot.sendMessage(
            msg.chat.id,
            'Ви повинні або вказати нік юзера, або відповісти цією командою на повідомлення потрібного вам юзера!',
            { reply_to_message_id: msg.message_id }
        );
        return;
    }

    if (match[1]) {
        bot.getChat(`${match[1].slice(1)}`)
            .then((chat) => {
                console.log(chat);
                if (chat.type == 'channel') {
                    bot.getChatMemberCount(`${match[1].slice(1)}`)
                        .then((members) => {
                            bot.sendMessage(
                                msg.chat.id,
                                `Назва: ${chat.title}\nКількість підписників: ${members}\nЛінк: t.me/${chat.username}`,
                                {
                                    reply_to_message_id: msg.message_id
                                }
                            );
                        })
                        .catch((err) => {
                            bot.sendMessage(msg.chat.id, 'Канал не знайдено!', {
                                reply_to_message_id: msg.message_id
                            });
                        });
                } else {
                    bot.sendMessage(msg.chat.id, 'Канал не знайдено!', {
                        reply_to_message_id: msg.message_id
                    });
                }
            })
            .catch((error) => {
                bot.sendMessage(msg.chat.id, 'Канал не знайдено!', {
                    reply_to_message_id: msg.message_id
                });
            });
    }
});

bot.onText(/\/register( .+)?/, async (msg, match) => {
    console.log(!msg.reply_to_message || !match[1]);
    if (!msg.reply_to_message || !match[1]) {
        bot.sendMessage(
            msg.chat.id,
            'Відправ команду /register @channel у відповідь на повідомлення потрібного юзера.',
            {
                reply_to_message_id: msg.message_id
            }
        );

        return;
    }

    await bot
        .getChat(`${match[1].slice(1)}`)
        .then(async (chat) => {
            const resp = await channel.link(chat.id, msg.reply_to_message.from.id);
            console.log(resp);
            if (resp == false) {
                bot.sendMessage(msg.chat.id, 'Канал та адміна вже додано.', {
                    reply_to_message_id: msg.message_id
                });
                return;
            }
            if (resp == null) {
                bot.sendMessage(msg.chat.id, 'Помилка при додаванні.', {
                    reply_to_message_id: msg.message_id
                });
            }
            if (resp == true) {
                bot.sendMessage(msg.chat.id, 'Успішно додано.', {
                    reply_to_message_id: msg.message_id
                });
            }
            // return chat.id;
        })
        .catch((err) => {
            bot.sendMessage(msg.chat.id, 'Канал не знайдено.', {
                reply_to_message_id: msg.message_id
            });
        });
});

bot.onText(/\/getall/, async (msg, match) => {
    const channels = await channel.findAll();
    console.log(channels);
    let channelList = '';
    await Promise.all(
        channels.map(async (item) => {
            await bot.getChat(item.channelId).then(async (chat) => {
                await bot.getChatMemberCount(item.channelId).then((members) => {
                    const mems = members / 1000.0;
                    const channel =
                        `[${mems.toFixed(1)} k] [${chat.title}](t.me/` +
                        `${chat.username}` +
                        `) | ${item.userId}\n`;
                    console.log(channel);
                    channelList += channel;
                });
            });
        })
    );
    console.log(channelList);
    bot.sendMessage(msg.chat.id, 'Список каналів: \n' + channelList, {
        reply_to_message_id: msg.message_id,
        parse_mode: 'Markdown'
    });
});
