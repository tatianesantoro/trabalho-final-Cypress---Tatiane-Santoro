
Cypress.Commands.add('login', (email, senha) => {
  cy.visit('/')
  
  cy.get('a[href="/login"]').click()
  cy.get('.login-form').should('be.visible')
  
  cy.get('input[data-qa="login-email"]').should('be.visible').type(email)
  cy.get('input[data-qa="login-password"]').should('be.visible').type(senha)
  cy.get('button[data-qa="login-button"]').should('be.visible').click()
  
  cy.get('li a', { timeout: 10000 }).should('include.text', 'Logged in as')
})

Cypress.Commands.add('signup', (nome, email) => {
  cy.get('a[href="/login"]').click()
  cy.get('input[data-qa="signup-name"]').type(nome)
  cy.get('input[data-qa="signup-email"]').type(email)
  cy.get('button[data-qa="signup-button"]').click()
})

Cypress.Commands.add('completeSignupForm', (
  senha,
  nome,
  sobrenome,
  empresa,
  endereco,
  endereco2,
  estado,
  cidade,
  cep,
  telefone
) => {
  cy.get('#password').type(senha)
  cy.get('#first_name').type(nome)
  cy.get('#last_name').type(sobrenome)
  cy.get('#company').type(empresa)
  cy.get('#address1').type(endereco)
  cy.get('#address2').type(endereco2)
  cy.get('#state').type(estado)
  cy.get('#city').type(cidade)
  cy.get('#zipcode').type(cep)
  cy.get('#mobile_number').type(telefone)
  cy.get('button[data-qa="create-account"]').click()
})