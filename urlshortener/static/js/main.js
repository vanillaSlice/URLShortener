$(document).ready(function() {

  /*
   * Elements
   */

  var alertsElement = $('#alerts');
  var linkFormElement = $('#link-form');
  var linkInputElement = $('#link-input');
  var linksHeadingElement = $('#links-heading');
  var linksElement = $('#links');

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
    linkCache[originalLink] = shortLink;
    localStorage.setItem('linkCache', JSON.stringify(linkCache));
  }

  function isInLinkCache(originalLink) {
    return linkCache.hasOwnProperty(originalLink);
  }

  function addLinkCard(originalLink, shortLink) {
    linksElement.prepend(
      '<div class="card margin-bottom">' +
        '<div class="card-body">' +
          '<p>Original Link: <a href="' + originalLink + '">' + originalLink + '</a></p>' +
          '<p>Short Link: <a href="' + shortLink + '">' + shortLink + '</a></p>' +
        '</div>' +
      '</div>'
    );
  }

  function handleLinkFormSubmit(e) {
    e.preventDefault();
    $.get('/new/' + linkInputElement.val())
      .done(handleShortenLinkSuccess)
      .fail(handleShortenLinkFailure);
  }

  function handleShortenLinkSuccess(res) {
    var originalLink = linkInputElement.val();
    var shortLink = res.short_url;
    if (!isInLinkCache(originalLink)) {
      showLinksHeading();
      addLinkCard(originalLink, shortLink);
      addToLinkCache(originalLink, shortLink);
    }
    resetLinkForm();
    clearAlerts();
  }

  function handleShortenLinkFailure() {
    clearAlerts();
    addAlert('danger', 'Could not shorten this link, please try another one.');
  }

  function loadLinkCache() {
    return JSON.parse(localStorage.getItem('linkCache')) || {};
  }

  function showLinksInCache() {
    for (var originalLink in linkCache) {
      if (linkCache.hasOwnProperty(originalLink)) {
        showLinksHeading();
        addLinkCard(originalLink, linkCache[originalLink]);
      }
    }
  }

  /* 
   * Initialise 
   */

  linkFormElement.submit(handleLinkFormSubmit);
  linkCache = loadLinkCache();
  showLinksInCache();

});
