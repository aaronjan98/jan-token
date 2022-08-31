//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Token {
    string public name = "Jan Token";
    string public symbol = "JAN";
    uint256 public decimals = 18;
    uint256 public totalSupply = 1000000 * (10**decimals);
}

