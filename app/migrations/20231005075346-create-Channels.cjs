'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Channels', {
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
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Channels');
    }
};
