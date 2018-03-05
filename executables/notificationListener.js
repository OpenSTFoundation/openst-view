#!/usr/bin/env node
"use strict";

/**
 * Job to listen notification from notification service.
 *
 * @example
 * ./executables/notificationListener.js -c 1141
 *
 * @module executables/notificationListener.js
 */

const openSTNotification = require('@openstfoundation/openst-notification');

const rootPrefix = ".."
    , logger = require(rootPrefix + '/helpers/custom_console_logger')
    , notificationProcessor = require(rootPrefix + '/lib/notificationProcessor')
    ;


function subscribe(){
    openSTNotification.subscribeEvent.rabbit(
        ['transfer.#'],
        {queue: 'OpenST-Explorer-Notification-Listener'},
        function(msgContent){
            logger.info('[RECEIVED]', msgContent, '\n');
            processNotification(JSON.parse(msgContent)['message']);
        }
    ).catch(function (err) {logger.error(err);});
}

// Start
logger.step("* Started the OpenST Notifications");
subscribe();

/**
 *
 * @param msgContent
 */
var processNotification = function (msgContent) {
    console.log("processNotification" ,msgContent);
    if (msgContent['kind'] =='transaction_mined') {
        logger.info("New Transaction mined", msgContent['payload']);
        notificationProcessor.processTransaction(msgContent.payload);
    }
};