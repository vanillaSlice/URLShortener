/// <reference types="cypress" />

const VISUAL_REGRESSION_THRESHOLD = 0.1

context('Integration', () => {
  it('renders page', () => {
    cy.visit('/')

    cy.get('h1')
      .should('contain.text', 'URL Shortener')

    cy.compareSnapshot('renders page', VISUAL_REGRESSION_THRESHOLD)
  })

  it('shortens links', () => {
    cy.visit('/')

    const url = `https://www.google.com/search?q=${new Date().toISOString()}`

    cy.get('input')
      .type(url)

    cy.get('button')
      .click()

    cy.get('.card-body')
      .first()
      .as('card')

    cy.compareSnapshot('shortens links', VISUAL_REGRESSION_THRESHOLD)

    cy.get('@card')
      .should('contain.text', `Original Link: ${url}`)

    cy.get('@card')
      .should('contain.text', `Short Link: ${Cypress.config('baseUrl')}`)

    cy.get('@card')
      .find('a')
      .last()
      .click()

    cy.url()
      .should('eq', url)
  })

  it('renders a 404 page', () => {
    cy.visit('/does-not-exist', { failOnStatusCode: false })

    cy.get('h1')
      .should('contain.text', 'Where you going bro?')

    cy.compareSnapshot('renders a 404 page', VISUAL_REGRESSION_THRESHOLD)
  })
})
