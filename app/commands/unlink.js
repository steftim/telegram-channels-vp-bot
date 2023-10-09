import channel from '../models/channel.js';

const unlink = async (bot) => {
    //
    //
    //      Unlink admin from channel
    //
    //

    //
    //  /unlink @channel @username
    //  /unlink@botname @channel @username
    //
    //  match[1] = @botname
    //  match[2] = @channel
    //  match[3] = @username
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
                            const resp = await channel.unlink(
                                chat.id,
                                match[3].slice(1),
                                msg.chat.id
                            );
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
};

export default unlink;
