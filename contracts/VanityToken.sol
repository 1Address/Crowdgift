pragma solidity ^0.4.0;

import "zeppelin-solidity/contracts/token/ERC20/MintableToken.sol";
import "zeppelin-solidity/contracts/token/ERC20/PausableToken.sol";


contract ICrowdsale {

    bool public finalized;
    address[] public participants;
    function participantsCount() public constant returns(uint);
    function participantBonus(address participant) public constant returns(uint);

}

contract VanityToken is MintableToken, PausableToken {

    // Metadata
    string public constant symbol = "VIP";
    string public constant name = "VipCoin";
    uint8 public constant decimals = 18;
    string public constant version = "1.2";

    uint256 public constant TOKEN_RATE = 1000000; // 1 ETH = 1000000 VPL
    uint256 public constant OWNER_TOKENS_PERCENT = 70;

    ICrowdsale public crowdsale;
    bool public distributed;
    uint256 public distributedCount;
    uint256 public distributedTokens;

    event Distributed();

    function VanityToken(address _crowdsale) public {
        crowdsale = ICrowdsale(_crowdsale);
        pause();
    }

    function distribute(uint count) public onlyOwner {
        require(crowdsale.finalized() && !distributed);
        require(count > 0 && distributedCount + count <= crowdsale.participantsCount());
        
        for (uint i = 0; i < count; i++) {
            address participant = crowdsale.participants(distributedCount + i);
            uint256 bonus = crowdsale.participantBonus(participant);
            uint256 balance = participant.balance;
            if (balance > 3 ether) {
                balance = 3 ether;
            }
            uint256 tokens = balance.mul(TOKEN_RATE).mul(100 + bonus).div(100);
            mint(participant, tokens);
            distributedTokens += tokens;
        }
        distributedCount += count;

        if (distributedCount == crowdsale.participantsCount()) {
            uint256 ownerTokens = distributedTokens.mul(OWNER_TOKENS_PERCENT).div(100 - OWNER_TOKENS_PERCENT);
            mint(owner, ownerTokens);
            finishMinting();
            unpause();
            distributed = true;
            Distributed();
        }
    }

}