/// <reference types="cypress" />

context('URLShortener', () => {
  beforeEach(() => {
    cy.visit('http://url.mikelowe.xyz/')
  })

  it('renders page', () => {
    cy.get('h1')
      .should('contain.text', 'URL Shortener')
  })
})
