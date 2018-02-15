pragma solidity ^0.4.0;

import "zeppelin-solidity/contracts/token/ERC20/MintableToken.sol";
import "zeppelin-solidity/contracts/token/ERC20/PausableToken.sol";
import "zeppelin-solidity/contracts/token/ERC827/ERC827Token.sol";


contract VanityToken_v3 is MintableToken, PausableToken, ERC827Token {

    // Metadata
    string public constant symbol = "VIP";
    string public constant name = "VipCoin";
    uint8 public constant decimals = 18;
    string public constant version = "1.3";

    function VanityToken_v3() public {
        pause();
    }

    function recoverLost(ERC20Basic token, address loser) public onlyOwner {
        token.transfer(loser, token.balanceOf(this));
    }

    function mintToMany(address[] patricipants, uint[] amounts) public onlyOwner {
        require(paused);
        require(patricipants.length == amounts.length);

        for (uint i = 0; i < patricipants.length; i++) {
            mint(patricipants[i], amounts[i]);
        }
    }

}