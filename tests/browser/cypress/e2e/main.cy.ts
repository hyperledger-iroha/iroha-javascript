beforeEach(async () => {
  await fetch('/peer-server/kill', { method: 'POST' })
  await fetch('/peer-server/start', { method: 'POST' })
})

it('Register new domain and wait until commitment', () => {
  cy.visit('/')

  // wait for the genesis block
  cy.get('h3').contains('Status').closest('div').contains('Blocks: 2')

  cy.get('button').contains('Listen').click()
  cy.get('li.active-events').contains('Events: true')
  cy.get('li.active-blocks').contains('Blocks: true')

  cy.get('input').type('bob')
  cy.get('button').contains('Register domain').click()

  // Ensure that block count is incremented
  cy.contains('Blocks: 4')

  // tx queued + approved, block approved + committed + applied (+ empty block)
  const EXPECTED_EVENTS = 8

  // And all events are caught
  cy.get('ul.events')
    .children('li')
    .should('have.length', EXPECTED_EVENTS)
    .last()
    .contains('Block (height=4)')
    .contains('Applied')

  // And all blocks too
  cy.get('ul.blocks')
    .children('li')
    .should('have.length', 4)
    .first().contains('1')
    .parent()
    .last().contains('4')

  cy.get('button').contains('Query domains').click()

  // our registered domain appears
  cy.get('ul.domains')
    .children('li')
    .should('have.length', 3)
    .first().contains('bob')
})
