import TelegramBot from 'node-telegram-bot-api';
import channel from './models/channel.js';

// replace the value below with the Telegram token you receive from @BotFather
const token = '';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

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
    Promise.all(
        await chann.map(async (item) => {
            await bot
                .getChat(item.channelId)
                .then((chat) => {
                    if (chat.type == 'channel') {
                        bot.getChatMemberCount(item.channelId)
                            .then((members) => {
                                bot.sendMessage(
                                    msg.chat.id,
                                    `Назва: ${
                                        chat.title
                                    }\nКількість підписників: ${members}\nЛінк: t.me/${
                                        chat.username ? chat.username : chat.invite_link
                                    }`,
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
        })
    );
    bot.sendMessage(msg.chat.id, 'Я нічо не знайшов 😭', {
        reply_to_message_id: msg.message_id
    });
});

//
//
//      Link admin to channel
//
//

bot.onText(/\/link(@\w+)?(?:\s+(\S+))?/, async (msg, match) => {
    await bot
        .getChatMember(msg.chat.id, msg.from.id)
        .then(async (chatMember) => {
            const isChatAdmin =
                chatMember.status === 'administrator' || chatMember.status === 'creator';

            if (isChatAdmin) {
                if (!msg.reply_to_message || !match[2]) {
                    bot.sendMessage(
                        msg.chat.id,
                        'Відправ команду /link @ channel у відповідь на повідомлення потрібного юзера.',
                        {
                            reply_to_message_id: msg.message_id
                        }
                    );

                    return;
                }

                await bot
                    .getChat(`${match[2]}`)
                    .then(async (chat) => {
                        // console.log(msg);
                        const resp = await channel.link(
                            chat.id,
                            msg.reply_to_message.from.username,
                            msg.chat.id
                        );
                        // console.log(resp);
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
            } else {
                bot.sendMessage(msg.chat.id, 'Ця команда доступна лише адміністраторам чату.', {
                    reply_to_message_id: msg.message_id
                });
            }
        })
        .catch((error) => {
            console.error(error);
        });
});

//
//
//      Unlink admin from channel
//
//

bot.onText(/^\/unlink(@\w+)?(?:\s+(\S+))?(?:\s+(\S+))?$/, async (msg, match) => {
    await bot
        .getChatMember(msg.chat.id, msg.from.id)
        .then(async (chatMember) => {
            const isChatAdmin =
                chatMember.status === 'administrator' || chatMember.status === 'creator';

            if (isChatAdmin) {
                if (!match[2] || !match[3]) {
                    bot.sendMessage(msg.chat.id, '/unlink @ channel @ username', {
                        reply_to_message_id: msg.message_id
                    });

                    return;
                }

                await bot
                    .getChat(`${match[2]}`)
                    .then(async (chat) => {
                        const resp = await channel.unlink(chat.id, match[3].slice(1), msg.chat.id);
                        // console.log(resp);
                        if (resp == false) {
                            bot.sendMessage(msg.chat.id, 'Адміна не знайдено.', {
                                reply_to_message_id: msg.message_id
                            });
                            return;
                        }
                        if (resp == null) {
                            bot.sendMessage(msg.chat.id, 'Помилка при видалянні.', {
                                reply_to_message_id: msg.message_id
                            });
                        }
                        if (resp == true) {
                            bot.sendMessage(msg.chat.id, 'Успішно видалено.', {
                                reply_to_message_id: msg.message_id
                            });
                        }
                        // return chat.id;
                    })
                    .catch((err) => {
                        console.log(err);
                        bot.sendMessage(msg.chat.id, 'Канал не знайдено.', {
                            reply_to_message_id: msg.message_id
                        });
                    });
            } else {
                bot.sendMessage(msg.chat.id, 'Ця команда доступна лише адміністраторам чату.', {
                    reply_to_message_id: msg.message_id
                });
            }
        })
        .catch((error) => {
            console.error(error);
        });
});

//
//
//      Get all channels
//
//

bot.onText(/\/getall(@\w+)?/, async (msg, match) => {
    const channelsRaw = await channel.findAll();
    // console.log(channels);
    let channelList = '';

    const channels = new Array();

    channelsRaw.map((item) => {
        console.log('map: ', item);
        const existingItem = channels.find((resultItem) => resultItem.channelId === item.channelId);
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

            const channel = `\\[${mems.toFixed(1)}k] [${title}](${username}) \n>> ${admins}\n\n`;
            channelList += channel;
        })
    );

    bot.sendMessage(msg.chat.id, 'Список каналів: \n' + channelList, {
        reply_to_message_id: msg.message_id,
        parse_mode: 'Markdown'
    });
});

// const generateChatInvite = async (chatId) => {
//     const exp = Math.floor(new Date().getTime() / 1000);
//     bot.createChatInviteLink(chatId, '', exp, 0, false);
// };

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
    // const replay = msg.reply_to_message.from.username;

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
