function getImagePath(cardItem) {
    if (cardItem.color === "SPECIAL") {
        if (cardItem.aRank === "PIRATE") {
            return cardItem.color.toLowerCase() + '/' + cardItem.aOption.toLowerCase();
        }
        if (cardItem.aRank === "SCARY_MARY") {
            return cardItem.color.toLowerCase() + '/' + cardItem.aRank.toLowerCase() + '_' + cardItem.aOption.toLowerCase();
        }
        return cardItem.color.toLowerCase() + '/' + cardItem.aRank.toLowerCase();
    }
    return cardItem.color.toLowerCase() + '/' + cardItem.color.toLowerCase() + '_' + cardItem.aRank.toLowerCase();
}

export default getImagePath;