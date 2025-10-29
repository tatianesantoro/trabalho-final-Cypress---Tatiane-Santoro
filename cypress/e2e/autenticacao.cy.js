describe('Testes de Autenticação', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  // Caso de Teste 1: Registrar usuário
it('deve registrar um novo usuário com sucesso', () => {
    const timestamp = Date.now()
    const email = `teste.tati${timestamp}@prova.com`
    const nome = 'Testetatiane'

    Cypress.env('registeredEmail', email)

    cy.signup(nome, email)

    cy.get('div.login-form').should('be.visible')
    cy.get('input#password').should('be.visible')
    
    cy.completeSignupForm(
      'teste6543@',
      'Tatiane',
      'Sandos',
      'Ti Testes',
      'Rua Amalfi, 111',
      'Apto 2A',
      'RJ',
      'Rio de Janeiro',
      '22756349',
      '98737543'
    )

    cy.get('h2.title').should('contain', 'Account Created!')
    cy.get('a[data-qa="continue-button"]').click()

    cy.get('a[href="/logout"]').click()
})

  // Caso de Teste 2: Faça login no usuário com e-mail e senha corretos
it('deve fazer login com email e senha corretos', () => {
    const email = Cypress.env('registeredEmail')
    const senha = 'teste6543@'

    if (!email) {
        const timestamp = Date.now()
        Cypress.env('registeredEmail', `teste.tati${timestamp}@prova.com`)
    }

    cy.login(email, senha)
    cy.get('li a').should('include.text', 'Logged in as')
})

  // Caso de Teste 3: Fazer login no usuário com e-mail e senha incorretos
it('deve mostrar erro com email e senha incorretos', () => {
    const email = 'tatierro_@exemplo.com'
    const senha = '34543@gh'

    cy.visit('/login')
    
    cy.get('input[data-qa="login-email"]').type(email)
    cy.get('input[data-qa="login-password"]').type(senha)
    cy.get('button[data-qa="login-button"]').click()

    cy.wait(2000)
    
    cy.url().should('include', '/login')
    
    cy.get('body').then(($body) => {
        if ($body.text().includes('Your email or password is incorrect')) {
            cy.contains('Your email or password is incorrect').should('be.visible')
        } 
        else if ($body.text().includes('incorrect')) {
            cy.contains('incorrect', { matchCase: false }).should('be.visible')
        }
        else if ($body.text().includes('Invalid')) {
            cy.contains('Invalid', { matchCase: false }).should('be.visible')
        }
        else if ($body.text().includes('error')) {
            cy.contains('error', { matchCase: false }).should('be.visible')
        }
        else {
            cy.get('li a').should('not.contain', 'Logged in as')
            cy.log('Login falhou como esperado - usuário não está logado')
        }
    })
})

  // Caso de Teste 4: Fazer logout do usuário
it('deve fazer logout com sucesso', () => {
    const email = Cypress.env('registeredEmail')
    const senha = 'teste6543@'

    if (!email) {
        const timestamp = Date.now()
        const newEmail = `teste.tati${timestamp}@prova.com`
        Cypress.env('registeredEmail', newEmail)
        cy.log(`Email não encontrado, criando novo: ${newEmail}`)
    }

    cy.login(email, senha)
    
    cy.get('li a', { timeout: 10000 }).should('include.text', 'Logged in as')
    
    cy.get('a[href="/logout"]', { timeout: 10000 })
      .should('be.visible')
      .click()
      
    cy.url().should('include', '/login')
})
})