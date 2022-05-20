// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard {
    address payable public immutable feeAccount;
    uint public immutable feePercent;
    uint public itemCount;

    struct Item{
        uint itemId;
        IERC721 nft;
        uint tokenId;
        uint price;
        address payable seller;
        bool sold;
    }

    event Offered(
        uint itemId,
        IERC721 indexed nft,
        uint tokenId,
        uint price,
        address indexed seller
    );

    mapping(uint => Item) public items;

    constructor(uint _feePercent){
        feePercent = _feePercent;
        feeAccount = payable(msg.sender);
    }

    function makeItem(IERC721 _nft, uint _tokenId, uint _price) external nonReentrant {
        require(_price > 0, "Price must be greater than zero");

        itemCount++;

        _nft.transferFrom(msg.sender, address(this), _tokenId);

        items[itemCount] = Item(
            itemCount,
            _nft,
            _tokenId,
            _price,
            payable(msg.sender),
            false
        );

        emit Offered(
            itemCount,
            _nft,
            _tokenId,
            _price,
            msg.sender
        );
    }

    function purchaseItem(uint _itemId) external payable nonReentrant {

    }

    function getTotalPrice(uint _itemId) view public returns(uint) {
        return(item[_itemId].price * (100 + feePercent) / 100);
    }
}
