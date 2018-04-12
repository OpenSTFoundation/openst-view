"use strict";

const rootPrefix = '../..'
  , baseCache = require(rootPrefix + '/lib/cache_management/base')
  , responseHelper = require(rootPrefix + '/lib/formatter/response')
  , GraphDataKlass = require(rootPrefix +'/app/models/graph_data')
  , GraphConst = require(rootPrefix + '/lib/global_constant/graph_data')
  , logger = require(rootPrefix+'/helpers/custom_console_logger')
  , GraphUtils = require(rootPrefix + '/lib/graphTimeUtils')
  , CronDetailsModelKlass = require(rootPrefix + '/app/models/cron_detail')
  , cronDetailConst = require(rootPrefix + '/lib/global_constant/cron_details')
  , constants = require(rootPrefix + '/config/core_constants')
;

/**
 * @constructor
 *
 * @param {Object} params - cache key generation & expiry related params
 *                 block_number -  Block number to fetch data for
 *                 chain_id - Chain id
 *
 */
const TransactionTypeGraphData = function(params) {

  const oThis = this;

  oThis.chainId = params.chain_id;
  oThis.contractAddressId = params.contract_address_id;
  oThis.duration = params.duration.toLowerCase();

  baseCache.call(this, params);

  oThis.useObject = true;

};

TransactionTypeGraphData.prototype = Object.create(baseCache.prototype);

const TokenTransferGraphDataPrototype = {

  /**
   * set cache key
   *
   * @return {String}
   */
  setCacheKey: function() {

    const oThis = this;

    oThis.cacheKey = oThis._cacheKeyPrefix() + "trtgd_" + 'cid_' + oThis.contractAddressId + 'd_' + oThis.duration ;

    return oThis.cacheKey;

  },

  /**
   * set cache expiry in oThis.cacheExpiry and return it
   *
   * @return {Number}
   */
  setCacheExpiry: function() {

    const oThis = this;

    oThis.cacheExpiry = 86400; // 24 hours ;
    // oThis.cacheExpiry = 1; // 1 second ;

    return oThis.cacheExpiry;

  },
  /**
   * fetch data from source
   *
   * @return {Result}
   */
  fetchDataFromSource: async function() {

    const oThis = this
      , limitTime = await oThis.getLimitTime()
    ;


    let graphDataObject;
    let graphDataObjectResponse;

    graphDataObject = new GraphDataKlass(oThis.chainId);
    graphDataObjectResponse = await graphDataObject.select('timestamp, SUM(total_transfers) as token_transfers, SUM(token_ost_volume) as token_ost_volume')
      .where(['contract_address_id=? AND time_frame=? AND timestamp>=?', oThis.contractAddressId, graphDataObject.invertedTimeFrames[oThis.getTimeFrame()], limitTime])
      .group_by('branded_token_transaction_type_id')
      .fire();

    let data = [];
    if (graphDataObjectResponse) {
      logger.log('GraphResponse', graphDataObjectResponse);
      data = await oThis.processResponse(graphDataObjectResponse);
    } else {
      logger.error('TokenTransferGraphData :: fetchDataFromSource :: graphDataObjectResponse is null');
      return Promise.resolve(responseHelper.error('l_cm_ttg_1', 'graphDataObjectResponse is null'))
    }
    return Promise.resolve(responseHelper.successWithData({graph_data: data}));
  },

  processResponse: async function (graphDataObjectResponse) {
    const oThis = this
    ;

    let dpArray = [];
    if (graphDataObjectResponse instanceof Array && graphDataObjectResponse.length > 0) {

    }

    return dpArray;
  },

  getLimitTime : async function(){
    const oThis = this
      , duration = String(oThis.duration)
      , cronDetailsRow = await (new CronDetailsModelKlass(oThis.chainId)).select('*').where(["cron_name = ?", CronDetailsModelKlass.aggregator_cron]).order_by('id DESC').limit(1).fire()
      , cronRow = cronDetailsRow[0]
    ;

    //todo: dont use aggregator time for dummy 0 val rows??

    let latestTimestamp = 0;
    let startTimestamp = 0;
    if (cronRow) {
      let blockData = JSON.parse(cronRow.data);
      if (blockData.block_timestamp) {
        if (Number(cronRow.status) === Number(new CronDetailsModelKlass(oThis.chainId).invertedStatuses[cronDetailConst.completeStatus])) {
          latestTimestamp = blockData.block_timestamp + constants.AGGREGATE_CONSTANT;
        } else {
          latestTimestamp = blockData.block_timestamp;
        }

        const graphUtils = GraphUtils.newInstance(latestTimestamp, oThis.duration);
        startTimestamp = graphUtils.setGraphStartTime();
      }
    }
    return startTimestamp;
  },

  getTimeFrame : function() {
    const oThis = this;
    let duration = String(oThis.duration);
    if (duration === 'day') {
      return GraphConst.hour;
    }
    if (duration === 'month') {
      return GraphConst.day;
    }
    if (duration === 'week') {
      return GraphConst.day;
    }
    if (duration === 'year') {
      return GraphConst.month;
    }
    if (duration === 'all') {
      return GraphConst.month;
    }
    if (duration === 'hour'){
      return 'fiveMin';
    }

  }
};

Object.assign(TransactionTypeGraphData.prototype, TokenTransferGraphDataPrototype);

module.exports = TransactionTypeGraphData;

/*
 TokenTransfer = require('./lib/cache_management/token_transfer_graph_data')
 new TokenTransfer({chain_id : 1409, contract_address_id: 35, duration: 'hour'}).fetchDataFromSource().then(console.log);
*/