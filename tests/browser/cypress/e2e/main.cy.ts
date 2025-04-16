beforeEach(async () => {
  await fetch('/peer-server/kill', { method: 'POST' })
  await fetch('/peer-server/start', { method: 'POST' })
})

it('Register new domain and wait until commitment', () => {
  cy.visit('/')

  // wait for the genesis block
  cy.get('h3').contains('Status').closest('div').contains('Blocks: 2')

  cy.get('button').contains('Listen').click().contains('Stop')

  cy.get('input').type('bob')
  cy.get('button').contains('Register domain').click()

  // Ensure that block count is incremented
  cy.contains('Blocks: 4')

  // And all events are caught
  cy.get('ul.events-list').children('li').should('have.length', 10).last().contains('Block').contains('Applied')
})
