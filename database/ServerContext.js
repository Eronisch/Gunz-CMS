function ServerContext(){
    this.DonatorShopSetModel = require('./server/DonatorShopSetModel.js');
    this.DonatorShopSetItemModel = require('./server/DonatorShopSetItemModel.js');
    this.DonatorShopItemModel = require('./server/DonatorShopItemModel.js');
    this.DonatorShopCategoryModel = require('./server/DonatorShopCategoryModel.js');
    this.DonatorDailyItemModel = require('./server/DonatorDailyItemModel.js');
    this.DonateShopLogModel = require('./server/DonateShopLogModel.js');
    this.DonatorDailyItemLogModel = require('./server/DonatorDailyItemLogModel.js');
    this.PaySafeCardModel = require('./server/PaySafeCardModel.js');
    this.PaySafeCardPaymentOptionsModel = require('./server/PaySafeCardPaymentOptionsModel.js');
    this.AccountModel = require('./server/AccountModel.js');
    this.EmailTemplateModel = require('./server/EmailTemplateModel.js');
    this.AccountMobileLoginToken = require('./server/AccountMobileLoginToken.js');
    this.MobileChatModel = require('./server/MobileChatModel.js');
    this.MobileChatContactModel = require('./server/MobileChatContactModel.js');
    this.PaypalPaymentOptionsModel = require('./server/PaypalPaymentOptionsModel.js');
    this.PaypalModel = require('./server/PaypalModel.js');
    this.ItemRotationModel = require('./server/ItemRotationModel.js');
    this.CharacterModel = require('./server/CharacterModel.js');
    this.ForumTopicModel = require('./server/ForumTopicModel.js');
    this.MatchServerStatusModel = require('./server/MatchServerStatusModel.js');
    this.MobileChatMessageModel = require('./server/MobileChatMessageModel.js');
    this.MobileChatTextModel = require('./server/MobileChatTextModel.js');

    this.DonatorShopSetModel.belongsTo(this.DonatorShopItemModel, { foreignKey: 'DonatorShopItemId'});
    this.DonatorShopSetModel.hasMany(this.DonatorShopSetItemModel, { foreignKey: 'SetId' });
    this.DonatorShopItemModel.belongsTo(this.DonatorShopSetItemModel, { foreignKey: 'Id' });
    this.DonatorShopSetItemModel.belongsTo(this.DonatorShopItemModel, { foreignKey: 'SetItemId' });
    this.DonatorShopItemModel.belongsTo(this.DonatorShopCategoryModel, { foreignKey: 'CategoryId' });
    this.DonatorShopItemModel.hasOne(this.DonatorShopSetModel, { foreignKey: 'DonatorShopItemId' });

    this.PaySafeCardModel.belongsTo(this.PaySafeCardPaymentOptionsModel, { foreignKey: 'PaymentOptionId' });
    this.PaySafeCardModel.belongsTo(this.AccountModel, { foreignKey: 'AccountId' });

    this.MobileChatModel.hasMany(this.MobileChatContactModel, { foreignKey: 'ChatId', as : 'Contacts'});
    this.MobileChatContactModel.belongsTo(this.MobileChatModel, { foreignKey: 'ChatId', as : 'Chat'});

    this.PaypalModel.belongsTo(this.PaypalPaymentOptionsModel, { foreignKey: 'PaymentOptionId' });
    this.PaypalModel.belongsTo(this.AccountModel, { foreignKey: 'AccountId', as : 'Account' });

    this.MobileChatTextModel.belongsTo(this.MobileChatMessageModel, { foreignKey: 'MessageId', as : 'TextMessage' });
    this.MobileChatMessageModel.belongsTo(this.AccountModel, { foreignKey: 'AccountId', as : 'Account' });

}

module.exports = new ServerContext();