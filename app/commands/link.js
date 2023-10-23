import channel from '../models/channel.js';

const link = async (bot) => {
    //
    //
    //      Link admin to channel
    //
    //

    //
    // reply to message >>  /link @channel
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
                            const resp = await channel.link(
                                chat.id,
                                msg.reply_to_message.from.username,
                                msg.chat.id
                            );
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
                                return;
                            }
                            if (resp == true) {
                                bot.sendMessage(msg.chat.id, 'Успішно додано.', {
                                    reply_to_message_id: msg.message_id
                                });
                                return;
                            }
                        })
                        .catch(() => {
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
            .catch(() => {});
    });
};

export default link;
