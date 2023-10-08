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
        userId: {
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

channel.findAllAdminChannels = async (userId) => {
    if (!channel.isId(userId)) {
        return false;
    }
    return await ChannelModel.findAll({
        where: {
            userId: userId
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

channel.link = async (channelId, userId) => {
    return await ChannelModel.findOne({
        where: {
            channelId,
            userId
        }
    })
        .then(async (rows) => {
            console.log('rows ', rows);
            if (rows == null) {
                return await ChannelModel.create({
                    userId: userId,
                    channelId: channelId
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

// author.create = async (options) => {
//     if (!options.uaName && !options.enName && !options.jpName) {
//         return false;
//     }
//     const description = options.description ? options.description : null;
//     const photo = options.photo ? options.photo : '/images/noimage.jpg';
//     const birdthday = options.birdthday ? options.birdthday : null;
//     return await AuthorModel.create({
//         uaName: options.uaName,
//         enName: options.enName,
//         jpName: options.jpName,
//         description: description,
//         photo: photo,
//         birthday: birdthday,
//         createdBy: User.user.id
//     })
//         .then((record) => {
//             if (record) {
//                 return record;
//             } else {
//                 return false;
//             }
//         })
//         .catch((err) => {
//             console.log(err);
//             return false;
//         });
// };

// author.assignAuthor = async (authorId, titleId, options) => {
//     const description = options && options.description ? options.description : null;
//     const role = options && options.role ? options.role : null;
//     return await AuthorsBind.create({
//         authorId: authorId,
//         ranobeId: titleId,
//         description: description,
//         role: role,
//         createdBy: User.user.id
//     })
//         .then((record) => {
//             if (record) {
//                 return record;
//             } else {
//                 return false;
//             }
//         })
//         .catch((err) => {
//             console.log(err);
//             return false;
//         });
// };

export default channel;
