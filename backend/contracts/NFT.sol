// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
    uint public tokenCount; // tokenId

    event Minted(
        uint indexed tokenId,
        address indexed creator,
        string tokenURI
    );

    constructor() ERC721("Prototype NFT", "Prototype") {

    }

    function mint(string memory _tokenURI) external returns(uint) {
        tokenCount++;
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);

        emit Minted(
            tokenCount,
            address(msg.sender),
            _tokenURI
        );

        return(tokenCount);
    }
}