$(document).ready(function() {

  /*
   * Elements
   */

  var alertsElement = $('.js-alerts');
  var linkFormElement = $('.js-link-form');
  var linkInputElement = $('.js-link-input');
  var linksHeadingElement = $('.js-links-heading');
  var linksElement = $('.js-links');

  /*
   * Variables
   */

  var linkCache;

  /*
   * Functions
   */

  function addAlert(type, message) {
    alertsElement.append(
      '<div class="alert alert-' + type + '">' +
        message +
      '</div>'
    );
  }

  function clearAlerts() {
    alertsElement.empty();
  }

  function resetLinkForm() {
    linkFormElement.trigger('reset');
  }

  function showLinksHeading() {
    linksHeadingElement.removeClass('hidden');
  }

  function addToLinkCache(originalLink, shortLink) {
    linkCache.push({
      'originalLink': originalLink,
      'shortLink': shortLink
    });
    localStorage.setItem('linkCache', JSON.stringify(linkCache));
  }

  function moveToEndOfLinkCache(index) {
    var item = linkCache[index];
    linkCache.splice(index, 1);
    addToLinkCache(item.originalLink, item.shortLink);
  }

  function isInLinkCache(originalLink) {
    return getLinkCacheIndex(originalLink) >= 0;
  }

  function getLinkCacheIndex(originalLink) {
    return linkCache.map(function(item) {
      return item.originalLink;
    }).indexOf(originalLink);
  }

  function addLinkCard(originalLink, shortLink) {
    linksElement.prepend(
      '<div class="card margin-bottom js-card">' +
        '<div class="card-body">' +
          '<p>Original Link: <a href="' + originalLink + '">' + originalLink + '</a></p>' +
          '<p>Short Link: <a href="' + shortLink + '">' + shortLink + '</a></p>' +
        '</div>' +
      '</div>'
    );
  }

  function moveLinkCardToTop(linkCacheIndex) {
    var cards = linksElement.find('.js-card');
    var cardIndex = cards.length - linkCacheIndex - 1;
    var card = cards[cardIndex];
    card.remove();
    linksElement.prepend(card);
  }

  function handleLinkFormSubmit(e) {
    e.preventDefault();

    var originalLink = linkInputElement.val();
    
    if (isInLinkCache(originalLink)) {
      handleCachedLink(originalLink);
      return;
    }

    $.get('/new/' + originalLink)
      .done(handleShortenLinkSuccess)
      .fail(handleShortenLinkFailure);
  }

  function handleCachedLink(originalLink) {
    var linkCacheIndex = getLinkCacheIndex(originalLink);
    moveLinkCardToTop(linkCacheIndex);
    moveToEndOfLinkCache(linkCacheIndex);
    resetLinkForm();
    clearAlerts();
  }

  function handleShortenLinkSuccess(res) {
    var originalLink = linkInputElement.val();
    var shortLink = res.short_url;
    showLinksHeading();
    addLinkCard(originalLink, shortLink);
    addToLinkCache(originalLink, shortLink);
    resetLinkForm();
    clearAlerts();
  }

  function handleShortenLinkFailure() {
    clearAlerts();
    addAlert('danger', 'Could not shorten this link, please try another one.');
  }

  function loadLinkCache() {
    var parsedLinkCache = JSON.parse(localStorage.getItem('linkCache'));
    return Array.isArray(parsedLinkCache) ? parsedLinkCache : [];
  }

  function showLinksInCache() {
    linkCache.forEach(function(item) {
      showLinksHeading();
      addLinkCard(item.originalLink, item.shortLink);
    });
  }

  /* 
   * Initialise 
   */

  linkFormElement.submit(handleLinkFormSubmit);
  linkCache = loadLinkCache();
  showLinksInCache();
});
