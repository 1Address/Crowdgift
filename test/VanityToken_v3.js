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
import EVMRevert from './helpers/EVMRevert';

const Token = artifacts.require('./VanityToken_v3.sol');

contract('VanityToken_v3', function([_, ownerWallet, wallet, wallet1, wallet2, wallet3, wallet4]) {

    it('should recover tokens sent to contract directly', async function() {
        const token = await Token.new();
        await token.mintToMany([_, wallet1], [100, 100]);
        await token.finishMinting();
        await token.unpause();

        (await token.balanceOf.call(_)).should.be.bignumber.equal(100);
        (await token.balanceOf.call(wallet1)).should.be.bignumber.equal(100);
        (await token.balanceOf.call(token.address)).should.be.bignumber.equal(0);

        // Lose
        await token.transfer(token.address, 50, {from: wallet1});
        (await token.balanceOf.call(_)).should.be.bignumber.equal(100);
        (await token.balanceOf.call(wallet1)).should.be.bignumber.equal(50);
        (await token.balanceOf.call(token.address)).should.be.bignumber.equal(50);

        // Recover
        await token.recoverLost(token.address, wallet1);
        (await token.balanceOf.call(_)).should.be.bignumber.equal(100);
        (await token.balanceOf.call(wallet1)).should.be.bignumber.equal(100);
        (await token.balanceOf.call(token.address)).should.be.bignumber.equal(0);
    })

    // it.only('xxx', async function() {
    //     const token = Token.at("0x7777777189c4E413Bbe6Ea9DF6C2B4f34f53cdD3");
    //     const participants = [
    //         "0x42b778ad2fff64640aa8507fec8045b31bdce9ce",
    //         "0xbb363ae2c41a1fa0998356ddc196cf452001d919",
    //         "0x4dd25badc91907d97e2154789cce130b45df0562",
    //         "0x398646e26814c67edd6f49da25c121be0cf96c40",
    //         "0xffffc5b8ba913ad9a2373c4d0694256c99e4a061",
    //         "0x25273b8c601c6545d574496d3d3478fa7dc2f57d",
    //         "0x7309e1582d611d3ef9dba6fce709f177240e0fd9",
    //         "0x40cb4cca8330e0d89db370e51c865fbbf40f57e3",
    //         "0x6c0f58ad4eb24da5769412bf34ddee698c4d185b",
    //         "0xedfc8b4d5e243e9e797b1292a6e0c4ec600dac26",
    //         "0x6eb1c25290bed5835fd320b42df5fb021009b78e",
    //         "0x967db9dd888ffe87480ce68d4b33301126fc783b",
    //         "0x61b724aa89f4c8813815f484bc8b0b8c2dab093f",
    //         "0xf78e198188c10c666cc71a6456e0d7d26cdfb29b",
    //         "0x82542ce2a25eb8996b76f685023532b2367701ec",
    //         "0xfa071dcf1fa4e777a9fabfb6383fb54e73b9d545",
    //         "0x00e1d1e5902737a922d275b4fdd924178be63278",
    //         "0x5b810bacf246609e6ceec7427995e6fb8bd62496",
    //         "0x8298e8a3cc1a18ef22b8fbc7bdf90d30dbbe7d88",
    //         "0x81cd2b96a2a7625fe76f5f8c5e3032843268cc82",
    //         "0x4ae33a93527dd7cdfcb987cfb1c8581657c4d533",
    //         "0x8b35594f89643c8ecf07a26f248a603a8ccfef0d",
    //         "0xd05a46a902ea29f1cc9d7d331b614084cf645cda",
    //         "0x6bed1c0f1ab1d99b3958d68768384fb550d01cb6",
    //         "0x5c7285baf636b40a4b1f91fdc647c8f13a357533",
    //         "0xf5ff12b77601b7a4efd6b3b0c5dd8b3ec87c3b8f",
    //         "0xb70dda3baeea91461c52fe432f889f8cdf30c6ea",
    //         "0xe6f1c592867e927cd0e7b560752414abc95be4bb",
    //         "0x782b805f789d3596f2ca9a45d8f005facad79fa2",
    //         "0xcd592395ac8782ed5669a5118ff73d286a5e9192",
    //         "0x8df252da894db4ab205c1b4b8769eec0522f49af",
    //         "0x40469b319db6c79b55c94f4276cdb5e8a31c0442",
    //         "0xee3bffc6d83d8a547df4f6edb93079d486ae6c20",
    //         "0x2b9d22382980276052456509ad2009b9eb7b6521",
    //         "0x10bd9a61cfbf5c046dcf01e2b0abed577fee7bc8",
    //         "0x6377bf4cbce21a5997db0c3b749d6daf961cb00d",
    //         "0xab45233b06b1d1f452901661f6a931c9da663cc0",
    //         "0xcb416ee0d4ff14680d6ad3d8bb19cc28219034ba",
    //         "0x4ad153ff30d3f908d7f00da4f2b1b0e5f2165201",
    //         "0x64edf4228e9aae1d3e9bfa9ea3a92a59c8f487bb",
    //         "0x3af65a96035822a1ad0f131e66b38df53477e82f",
    //         "0x9ba5d789197d78073e1933bd905d1ea43ea4d3df",
    //         "0x6821b62f2a11b20fa3697d056844c83658184a8b",
    //         "0x5c10c47b2d848e06a5dffa45b3bc10860797cdad",
    //         "0xe30a80fc2f4f97a6a7d9e030cd9369634fe1045b",
    //         "0x25e05ececdc91e6d2c73c3af5a685021e3eb63c4",
    //         "0x5de0207fab8d47d64acc9c9cb5ce3417b6116949",
    //         "0xc19b6dfff1aaddd08ac5458a37857d4775ea01ae",
    //         "0xf6d7451b848986ef088f487e96e5892e71f124a8",
    //         "0x97444e3d279a6b6d5d38afa038eca90320f97b83",
    //         "0xd3bd2c069f2b9b2206878c0e5dafe19eb319bceb",
    //         "0x7f2beb938e3cc917780d3a8bc709941f023e79cd",
    //         "0x567a965250a94a9cd93e76bd4e985fdda7e06efb",
    //         "0x9caee22457808995abfc1d8e674f692ee3149c3e",
    //         "0xb5a0b9e6beb76a644076213cb34922754648e89c",
    //         "0x8874d7d80009b9b9fb7aa75de99555f4d2c396eb",
    //         "0x75996dc2857485504fa780cf54b5d430786e6e54",
    //         "0x2c420d5e763965e39b20b733015f2bee7683b194",
    //         "0x90702a5432f97d01770365d52c312f96dc108e90",
    //         "0xd9bafe5421a35cc93cd3e02826521b595b973392",
    //         "0x93843c248a882d8c24db4e9786eb1c68f0a2ff02",
    //         "0x775dba5b860b8ad8cdb23437fcc45cba2d5701d4",
    //         "0x68e2d6bbf936256a3b47fdf715c27ce722829c2a",
    //         "0x12bdd97d398cae99d7b4170b6bac813b8bf97f9e",
    //         "0x28df321d9885a28cfd8a4cdbd249604c30e5ff05",
    //         "0xba95b4a5b130c4c1d27dc9e8adcf7f087cdb4c52",
    //         "0xbfe2032313ade60e707dff437f41767e073ba639",
    //         "0xaa53075b1092dcd19cc09121a8a84e708ac4534d",
    //         "0x7aef52968df538c916321f02751fc793aacc66cc",
    //         "0x9409f1d35727c20c2837d1249b9affc4debebc1a",
    //         "0x2fe5c7d71fa6edee4ad1eeb6acbda52978158dce",
    //         "0x2312673a94e0748b08362ab6e5a4f919991e80c8",
    //         "0x9686543c7f8a418839e8de2cc8a4cd92b7dbef57",
    //         "0xfae996ec464845328a8def208034825694272300",
    //         "0x5ba0c74f2ac79366263d4aa7177bab27291b6867",
    //         "0x55d68d0ecb9cdb816fd1405c6a96bdcc7b79ed05",
    //         "0x6b0435496dde4293a3b302f5024d69732816cf6e",
    //         "0xb0531b90390551c52990056393024930c34e7dbd",
    //         "0xe4e1ee550a086ab55a3c015e9dcba71bc84d5138",
    //         "0x8194aa3a595d717ab70b1d476a013f2d998de541",
    //         "0x9446a86f179da56f7c5fb1133c6054b876a9cb9f",
    //         "0xb9b65361c4da42b14b935bc778f141afa5d71558",
    //         "0x880d04f48290b442a43b36bab914fe9b2c72c385",
    //         "0xffa8d6f6f1812c9a5441323c1addf5fcbaf734cc",
    //         "0x1c2eeb977060fd11a36214a6ce5fdc410c1936c5",
    //         "0x09e544b124eb6d84854d8059878208de4c4aea15",
    //         "0xe51a00982ba030db3fd449462c1aea73f1b16aca",
    //         "0x133e9693907a85230f997dadf3ff219e4946b1ce",
    //         "0x965d999087d95aec535b0ddd7fec0af921a4aee3",
    //         "0xf189b859f0e8e683467efda2b48be8e80e7cdf7d",
    //         "0x6db238932f538092cdb3df13223c65119f3bc927",
    //         "0x64eee4479bad0fa23310994bc73be4517a0fc425",
    //         "0x70c3f5c1a94d7a3aedb10709cdeb491f52057b81",
    //         "0x08f05b2c7e6e045f061253d2d4d973503292c49d"
    //     ];

    //     for (var i = 0; i < participants.length; i++) {
    //         const balance = await token.balanceOf(participants[i]);
    //         console.log(participants[i] + ' : ' + balance.toFixed());
    //     }
    // })

})