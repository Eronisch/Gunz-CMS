var Sanitize = require('sanitize-html');

function saniteze(unsafeHtml) {
    return Sanitize(unsafeHtml, {
        allowedTags: [
            'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
            'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
            'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'sup', 'sub', 'code'
        ],
        allowedAttributes: false
    });
}

module.exports = saniteze;