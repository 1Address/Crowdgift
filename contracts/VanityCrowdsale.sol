pragma solidity ^0.4.11;

import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./VanityToken.sol";


contract VanityCrowdsale is Ownable {

    using SafeMath for uint256;

    // Constants

    uint256 public constant TOKEN_RATE = 1000; // 1 ETH = 1000 VPL
    uint256 public constant OWNER_TOKENS_PERCENT = 100; // 1:1

    // Variables

    uint256 public startTime;
    uint256 public endTime;
    address public ownerWallet;
    
    mapping(address => uint) public registeredInDay;
    address[] public participants;
    uint256 public totalUsdAmount;
    uint256 public bonusMultiplier;
    
    VanityToken public token;
    bool public finalized;
    bool public distributed;
    uint256 public distributedCount;
    uint256 public distributedTokens;
    
    // Events

    event Finalized();
    event Distributed();
    
    // Constructor and accessors

    function VanityCrowdsale(
        uint256 _startTime,
        uint256 _endTime,
        address _ownerWallet
    ) public
    {
        startTime = _startTime;
        endTime = _endTime;
        ownerWallet = _ownerWallet;
        token = new VanityToken();
        token.pause();
    }

    function registered(address wallet) public constant returns(bool) {
        return registeredInDay[wallet] > 0;
    }

    function participantsCount() public constant returns(uint) {
        return participants.length;
    }

    function setOwnerWallet(address _ownerWallet) public onlyOwner {
        require(_ownerWallet != address(0));
        ownerWallet = _ownerWallet;
    }

    function computeTotalEthAmount() public constant returns(uint256) {
        uint256 total = 0;
        for (uint i = 0; i < participants.length; i++) {
            total += participants[i].balance;
        }
        return total;
    }

    function setTotalUsdAmount(uint256 _totalUsdAmount) public onlyOwner {
        totalUsdAmount = _totalUsdAmount;

        if (totalUsdAmount > 10000000) {
            bonusMultiplier = 20;
        } else if (totalUsdAmount > 5000000) {
            bonusMultiplier = 15;
        } else if (totalUsdAmount > 1000000) {
            bonusMultiplier = 10;
        } else if (totalUsdAmount > 100000) {
            bonusMultiplier = 5;
        } else if (totalUsdAmount > 10000) {
            bonusMultiplier = 2;
        } else if (totalUsdAmount == 0) {
            bonusMultiplier = 0; //TODO: set 1
        }
    }

    // Participants methods

    function () public payable {
        registerParticipant();
    }

    function registerParticipant() public payable {
        require(!finalized);
        require(startTime <= now && now <= endTime);
        require(registeredInDay[msg.sender] == 0);

        registeredInDay[msg.sender] = 1 + now.sub(startTime).div(24*60*60);
        participants.push(msg.sender);
        if (msg.value > 0) {
            // No money => No need to handle recirsive calls
            msg.sender.transfer(msg.value);
        }
    }

    // Owner methods

    function finalize() public onlyOwner {
        require(!finalized);
        require(now > endTime);

        finalized = true;
        Finalized();
    }

    function participantBonus(address participant) public constant returns(uint) {
        uint day = registeredInDay[participant];
        require(day > 0);

        uint bonus = 0;
        if (day <= 1) {
            bonus = 6;
        } else if (day <= 3) {
            bonus = 5;
        } else if (day <= 7) {
            bonus = 4;
        } else if (day <= 10) {
            bonus = 3;
        } else if (day <= 14) {
            bonus = 2;
        } else if (day <= 21) {
            bonus = 1;
        }

        return bonus.mul(bonusMultiplier);
    }

    function distribute(uint count) public onlyOwner {
        require(finalized && !distributed);
        require(count > 0 && distributedCount + count <= participants.length);
        
        for (uint i = 0; i < count; i++) {
            address participant = participants[distributedCount + i];
            uint256 bonus = participantBonus(participant);
            uint256 tokens = participant.balance.mul(TOKEN_RATE).mul(100 + bonus).div(100);
            token.mint(participant, tokens);
            distributedTokens += tokens;
        }
        distributedCount += count;

        if (distributedCount == participants.length) {
            uint256 ownerTokens = distributedTokens.mul(OWNER_TOKENS_PERCENT).div(100);
            token.mint(ownerWallet, ownerTokens);
            token.finishMinting();
            token.unpause();
            distributed = true;
            Distributed();
        }
    }

}