/* eslint-disable spaced-comment */
/// <reference types="cypress" />

it("It doesn't fail and outputs the correct hex", () => {
  const PUB_KEY = 'ed012083C85E315776FD2DDC187ECB23E608F800B313A1D614B108078EC048D5013D2D'
  const PRIV_KEY = '8026403895C6FA512EF0C2D73DE2F2F2953C3F385ED636D9579BCC5022531228B8DBAF83C85E315776FD2DDC187ECB23E608F800B313A1D614B108078EC048D5013D2D'

  cy.intercept('/api/config', {body: { privateKey: PRIV_KEY }}).as('get-config')

  cy.visit('/').wait('@get-config')
  
  cy.contains(`Public key multihash: ${PUB_KEY}`)
})
