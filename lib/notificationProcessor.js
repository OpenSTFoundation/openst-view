"use strict";
/**
 * Notification Processor
 *
 * @module lib/notificationProcessor
 */
const rootPrefix = ".."
  , logger = require(rootPrefix + "/helpers/custom_console_logger")
  , constants = require(rootPrefix + "/config/core_constants")
  , config = require(rootPrefix + "/config")
  , DbInteract = require(rootPrefix + "/lib/storage/interact")
  ;

/**
 * Constructor to create object of NotificationProcessor

 * @constructor
 */
var NotificationProcessor = function () {

};

NotificationProcessor.prototype.processTransaction = function (msgPayload) {
  if (undefined == config.getChainDbConfig(parseInt(msgPayload.chain_id))) {
    logger.log("Not able to retrieve db config for chain Id", parseInt(msgPayload.chain_id));
    return;
  }

  var dbInteract = DbInteract.getInstance(config.getChainDbConfig(parseInt(msgPayload.chain_id)));
  var contractAddress = msgPayload.erc20_contract_address;
  var transactionHash = msgPayload.transaction_hash;
  var tag = msgPayload.tag;
  if (undefined === contractAddress) {
    logger.log("NotificationProcessor#processTransaction :: contractAddress is not defined");
    return;
  }
  if (undefined === tag){
    logger.log("NotificationProcessor#processTransaction :: Tag not defined for transaction hash", transactionHash);
    return;
  }
  dbInteract.insertIntoTransactionType({contract_address: contractAddress, transaction_hash: transactionHash, tag: tag})
    .then(function () {
      logger.log("NotificationProcessor#processTransaction :: Transaction type inserted successfully");
    }).catch(function (err) {
      logger.error("NotificationProcessor#processTransaction :: Transaction type insertion error", err);
    });
};

module.exports = new NotificationProcessor();