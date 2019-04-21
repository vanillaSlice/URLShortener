var bodyElement = $(document.body);
var alertsElement = $('.js-alerts');
var linkFormElement = $('.js-link-form');
var linkInputElement = $('.js-link-input');
var linksHeadingElement = $('.js-links-heading');
var linksElement = $('.js-links');

var rawLinkCache = JSON.parse(localStorage.getItem('linkCache'));
var linkCache = Array.isArray(rawLinkCache) ? rawLinkCache : [];

var clipboardTimeoutIds = {};

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

    linkFormElement.trigger('reset');
    alertsElement.empty();

    return;
  }

  $.get('/new/' + originalLink)
    .done(function(res) {
      linksHeadingElement.removeClass('hidden');
      addLinkCard(originalLink, res.short_url);
      addToLinkCache(originalLink, res.short_url);
      linkFormElement.trigger('reset');
      alertsElement.empty();
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

linkCache.forEach(function(item) {
  linksHeadingElement.removeClass('hidden');
  addLinkCard(item.originalLink, item.shortLink);
});

new ClipboardJS('.js-copy-btn').on('success', function(e) {
  var text = e.text;
  var copyBtnElement = e.trigger;

  clearTimeout(clipboardTimeoutIds[text]);
  
  copyBtnElement.innerText = 'Copied!';
  copyBtnElement.classList.add('btn-success');

  var timeoutId = setTimeout(function() {
    copyBtnElement.innerText = 'Copy';
    copyBtnElement.classList.remove('btn-success');
  }, 1000);

  clipboardTimeoutIds[text] = timeoutId;
});
