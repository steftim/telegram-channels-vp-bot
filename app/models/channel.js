'use strict';
import Sequelize from 'sequelize';
import sequelize from './connection.js';

class ChannelModel extends Sequelize.Model {}

ChannelModel.init(
    {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        channelId: {
            type: Sequelize.BIGINT,
            allowNull: false
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false
        },
        chatId: {
            type: Sequelize.BIGINT,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'Channel',
        timestamps: false,
        tableName: 'Channels',
        paranoid: true
    }
);

const channel = () => {};

channel.isId = async (title) => {
    if (typeof title !== 'number') {
        return true;
    }

    if (typeof title === 'string' && title.match(/^[0-9]+$/) != null) {
        return true;
    }
    return false;
};

channel.findAllChannelAdmins = async (channelId) => {
    if (!channel.isId(channelId)) {
        return false;
    }
    return await ChannelModel.findAll({
        where: {
            channelId: channelId
        }
    })
        .then((record) => {
            if (record) {
                return record;
            } else {
                return false;
            }
        })
        .catch((err) => {
            console.log(err);
            return false;
        });
};

channel.findAllAdminChannels = async (username) => {
    return await ChannelModel.findAll({
        where: {
            username: username
        }
    })
        .then((record) => {
            if (record) {
                return record;
            } else {
                return false;
            }
        })
        .catch((err) => {
            console.log(err);
            return false;
        });
};

channel.findAll = async () => {
    return await ChannelModel.findAll()
        .then((rows) => {
            if (rows) {
                return rows;
            } else {
                return false;
            }
        })
        .catch((err) => {
            console.log(err);
            return false;
        });
};

channel.link = async (channelId, username, chatId) => {
    return await ChannelModel.findOne({
        where: {
            channelId,
            username,
            chatId
        }
    })
        .then(async (rows) => {
            if (rows == null) {
                return await ChannelModel.create({
                    username: username,
                    channelId: channelId,
                    chatId
                })
                    .then((rows) => {
                        console.log(rows);
                        return true;
                    })
                    .catch((err) => {
                        console.log(err);
                        return null;
                    });
            }
            return false;
        })
        .catch((err) => {
            console.log(err);
            return null;
        });
};

channel.unlink = async (channelId, username, chatId) => {
    return await ChannelModel.findOne({
        where: {
            channelId,
            username,
            chatId
        }
    })
        .then(async (rows) => {
            if (rows != null) {
                return await ChannelModel.destroy({
                    where: {
                        username,
                        channelId,
                        chatId
                    }
                })
                    .then((rows) => {
                        console.log(rows);
                        return true;
                    })
                    .catch((err) => {
                        console.log(err);
                        return null;
                    });
            }
            return false;
        })
        .catch((err) => null);
};

export default channel;
