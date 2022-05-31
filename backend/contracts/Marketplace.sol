// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

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
        bool removed;
    }

    event Offered(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller
    );

    event Bought(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller,
        address indexed buyer
    );

    event Removed(
        uint itemId,
        address indexed nft,
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
            false,
            false
        );

        emit Offered(
            itemCount,
            address(_nft),
            _tokenId,
            _price,
            msg.sender
        );
    }

    function purchaseItem(uint _itemId) external payable nonReentrant {
        uint _totalPrice = getTotalPrice(_itemId);
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "Item doesn't exist");

        require(msg.value >= _totalPrice, "Insufficient funds");
        require(!item.sold, "Item already sold");
        require(!item.removed, "Item removed");

        item.seller.transfer(items[_itemId].price);
        feeAccount.transfer(_totalPrice - item.price);

        item.sold = true;

        item.nft.transferFrom(address(this), msg.sender, item.tokenId);

        emit Bought(
            _itemId,
            address(item.nft),
            item.tokenId,
            item.price,
            item.seller,
            msg.sender
        );
    }

    function removeItem(uint _itemId) external nonReentrant {
        Item storage item = items[_itemId];
        require(!item.sold, "Item already sold");
        require(msg.sender == item.seller, "Item not owned");

        item.removed = true;

        item.nft.transferFrom(address(this), msg.sender, item.tokenId);

        emit Removed(
            _itemId,
            address(item.nft),
            item.tokenId,
            item.price,
            item.seller
        );
    }

    function getTotalPrice(uint _itemId) view public returns(uint) {
        return(items[_itemId].price * (100 + feePercent) / 100);
    }

    function getPrice(uint _itemId) view public returns(uint) {
        return(items[_itemId].price);
    }
}
