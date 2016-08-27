exports.getPage = getPage;
exports.getOffset = getOffset;

function getPage(page) {
    return page == null ? 0 : page - 1;
}

function getOffset(page, limit) {
    return page * limit;
}