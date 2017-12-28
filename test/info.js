// @flow
'use strict'

const BigNumber = web3.BigNumber;
const expect = require('chai').expect;
const should = require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(web3.BigNumber))
    .should();

import ether from './helpers/ether';
import {advanceBlock} from './helpers/advanceToBlock';
import {increaseTimeTo, duration} from './helpers/increaseTime';
import latestTime from './helpers/latestTime';
import EVMThrow from './helpers/EVMThrow';

const Crowdsale = artifacts.require('./VanityCrowdsale.sol');
const Token = artifacts.require('./VanityToken.sol');

contract('Info', function([_, ownerWallet, wallet, wallet1, wallet2, wallet3, wallet4]) {

    // it.only('xxx', async function() {
    //     const crowdsale = Crowdsale.at("0x111111150b873d4bc367c41f39325c01a7263ac5");

    //     const participantsCount = await crowdsale.participantsCount.call();
    //     for (var i = 0; i < participantsCount; i++) {
    //         const participant = await crowdsale.participants(i);
    //         console.log(participant + ' (' + Math.trunc(web3.eth.getBalance(participant)/(10**15))/1000 + ' ETH)');
    //     }
    // })

})