var alertsElement = $('.js-alerts');
var linkFormElement = $('.js-link-form');
var linkInputElement = $('.js-link-input');
var shortenBtnElement = $('.js-shorten-btn');
var linksHeadingElement = $('.js-links-heading');
var linksElement = $('.js-links');

var rawLinkCache = JSON.parse(localStorage.getItem('linkCache'));
var linkCache = Array.isArray(rawLinkCache) ? rawLinkCache : [];

var clipboardTimeouts = {};

function addToLinkCache(originalLink, shortLink) {
  linkCache.push({ 'originalLink': originalLink, 'shortLink': shortLink });
  localStorage.setItem('linkCache', JSON.stringify(linkCache));
}

function addLinkCard(originalLink, shortLink) {
  linksElement.prepend(
    '<div class="card margin-bottom js-card">' +
      '<div class="card-body">' +
        '<p>Original Link: <a href="' + originalLink + '">' + originalLink + '</a></p>' +
        '<p>Short Link: <a href="' + shortLink + '">' + shortLink + '</a></p>' +
        '<button class="btn-block btn-secondary margin-bottom-none js-copy-btn" data-clipboard-text="' + shortLink + '">' +
          'Copy' +
        '</button>' +
      '</div>' +
    '</div>'
  );
}

function handleLinkShortenSuccess(shortLink) {
  linksHeadingElement.removeClass('hidden');
  linkFormElement.trigger('reset');
  alertsElement.empty();
  linkInputElement.val(shortLink);
  shortenBtnElement
    .text('Copy')
    .addClass('js-copy-btn')
    .attr('data-clipboard-text', shortLink)
    .attr('type', 'button');
}

linkFormElement.submit(function(e) {
  e.preventDefault();

  var originalLink = linkInputElement.val();
  
  var linkCacheIndex = linkCache.map(function(item) {
    return item.originalLink;
  }).indexOf(originalLink);

  if (linkCacheIndex >= 0) {
    var cards = linksElement.find('.js-card');
    var card = cards[cards.length - linkCacheIndex - 1];
    card.remove();
    linksElement.prepend(card);

    var item = linkCache[linkCacheIndex];
    linkCache.splice(linkCacheIndex, 1);
    addToLinkCache(item.originalLink, item.shortLink);

    handleLinkShortenSuccess(item.shortLink);

    return;
  }

  $.get('/new/' + originalLink)
    .done(function(res) {
      addLinkCard(originalLink, res.short_url);
      addToLinkCache(originalLink, res.short_url);
      handleLinkShortenSuccess(res.short_url);
    })
    .fail(function() {
      alertsElement.empty();
      alertsElement.append(
        '<div class="alert alert-danger">' +
          'Could not shorten this link, please try another one.' +
        '</div>'
      );
    });
});

linkInputElement.on('input', function() {
  shortenBtnElement
    .text('Shorten')
    .removeClass('js-copy-btn')
    .removeAttr('data-clipboard-text')
    .removeAttr('type');
});

if (linkCache.length > 0) {
  linksHeadingElement.removeClass('hidden');
}

linkCache.forEach(function(item) {
  addLinkCard(item.originalLink, item.shortLink);
});

function handleClipboardEvent(options) {
  return function(e) {
    var copyBtnElement = e.trigger;
    var timeoutKey = copyBtnElement.id || e.text;

    clearTimeout(clipboardTimeouts[timeoutKey]);

    copyBtnElement.innerText = options.btnText;
    copyBtnElement.classList.add(options.btnClass);

    var timeoutId = setTimeout(function() {
      copyBtnElement.innerText = 'Copy';
      copyBtnElement.classList.remove(options.btnClass);
    }, 1000);

    clipboardTimeouts[timeoutKey] = timeoutId;
  }
}

new ClipboardJS('.js-copy-btn')
  .on('success', handleClipboardEvent({ btnText: 'Copied!', btnClass: 'btn-success' }))
  .on('error', handleClipboardEvent({ btnText: 'Failed!', btnClass: 'btn-danger' }));
