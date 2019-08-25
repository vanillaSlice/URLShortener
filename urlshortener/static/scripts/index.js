/*
 * DOM Elements
 */

var alertsElement = $('.js-alerts');
var linkFormElement = $('.js-link-form');
var linkInputElement = $('.js-link-input');
var shortenBtnElement = $('.js-shorten-btn');
var linksHeadingElement = $('.js-links-heading');
var linksElement = $('.js-links');

/*
 * Cached Links
 */

var rawLinkCache = JSON.parse(localStorage.getItem('linkCache'));
var linkCache = Array.isArray(rawLinkCache) ? rawLinkCache : [];

/*
 * Clipboard Timeouts - used when displaying clipboard 'Copied' text for a period of time
 */

var clipboardTimeouts = {};

/*
 * Adds an entry to the link cache
 */

function addToLinkCache(originalLink, shortLink) {
  linkCache.push({ 'originalLink': originalLink, 'shortLink': shortLink });
  localStorage.setItem('linkCache', JSON.stringify(linkCache));
}

/*
 * Adds a new link card to the DOM
 */

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

/*
 * Handles when a link has been successfully shortened
 */

function handleShortenLinkSuccess(shortLink) {
  linksHeadingElement.removeClass('hidden');
  linkFormElement.trigger('reset');
  alertsElement.empty();
  linkInputElement.val(shortLink);
  shortenBtnElement
    .text('Copy')
    .addClass('js-copy-btn')
    .attr('data-clipboard-text', shortLink)
    .attr('type', 'button')
    .attr('disabled', false);
}

/*
 * Display an error when a link can't be shortened
 */

function handleShortenLinkFailure() {
  alertsElement.empty();
  alertsElement.append(
    '<div class="alert alert-danger">' +
      'Could not shorten this link, please try another one.' +
    '</div>'
  );
  shortenBtnElement.attr('disabled', false);
}

linkFormElement.submit(function(e) {
  e.preventDefault();

  shortenBtnElement.attr('disabled', true);

  var originalLink = linkInputElement.val();

  var linkCacheIndex = linkCache.map(function(item) {
    return item.originalLink;
  }).indexOf(originalLink);

  if (linkCacheIndex >= 0) {
    // reorder cards
    var cards = linksElement.find('.js-card');
    var card = cards[cards.length - linkCacheIndex - 1];
    card.remove();
    linksElement.prepend(card);

    // reorder link cache
    var item = linkCache[linkCacheIndex];
    linkCache.splice(linkCacheIndex, 1);
    addToLinkCache(item.originalLink, item.shortLink);

    handleShortenLinkSuccess(item.shortLink);

    return;
  }

  $.get('/new/' + originalLink)
    .done(function(res) {
      addLinkCard(originalLink, res.short_url);
      addToLinkCache(originalLink, res.short_url);
      handleShortenLinkSuccess(res.short_url);
    })
    .fail(handleShortenLinkFailure);
});

/*
 * Update shorten link button when input is changed
 */

linkInputElement.on('input', function() {
  shortenBtnElement
    .text('Shorten')
    .removeClass('btn-success')
    .removeClass('btn-danger')
    .removeClass('js-copy-btn')
    .removeAttr('data-clipboard-text')
    .removeAttr('type');
  clearTimeout(clipboardTimeouts[shortenBtnElement.attr('id')]);
});

/*
 * Display heading if there are cached links
 */

if (linkCache.length > 0) {
  linksHeadingElement.removeClass('hidden');
}

/*
 * Display cached links
 */

linkCache.forEach(function(item) {
  addLinkCard(item.originalLink, item.shortLink);
});

/*
 * Changes clipboard button text and colour for 1 second before changing back
 */

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

/*
 * Add clipboard button event listeners
 */

new ClipboardJS('.js-copy-btn')
  .on('success', handleClipboardEvent({ btnText: 'Copied!', btnClass: 'btn-success' }))
  .on('error', handleClipboardEvent({ btnText: 'Failed!', btnClass: 'btn-danger' }));
