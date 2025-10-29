describe('Teste do Formulário de Contato', () => {
  
  //Caso de teste 6: Formulário de contato
  it('deve enviar formulário de contato com sucesso', () => {
    let email = Cypress.env('registeredEmail')
    
    if (!email) {
      const timestamp = Date.now()
      email = `teste.tati${timestamp}@prova.com`
      Cypress.env('registeredEmail', email)
      cy.log(`Email não encontrado, criando novo: ${email}`)
    }

    cy.log(`Usando email: ${email}`)

    cy.visit('/')
    cy.get('a[href="/contact_us"]').click()
    
    cy.url().should('include', '/contact_us')
    cy.get('h2.title').should('contain', 'Get In Touch')
    
    cy.get('input[data-qa="name"]').type('Teste Tatiane')
    cy.get('input[data-qa="email"]').type(email)
    cy.get('input[data-qa="subject"]').type('Prova final Cypress')
    cy.get('textarea[data-qa="message"]').type('Esta é uma mensagem do teste que está sendo realizado por mim Tatiane.')
    
    cy.fixture('test-file.txt').then(fileContent => {
      cy.get('input[type="file"]').selectFile({
        contents: Cypress.Buffer.from(fileContent),
        fileName: 'test-file.txt',
        mimeType: 'text/plain'
      }, { force: true })
    })
    
    cy.get('input[data-qa="submit-button"]').click()
    
    cy.on('window:confirm', (text) => {
      expect(text).to.contains('OK')
      return true
    })
    
    cy.wait(2000)
    
    cy.get('body').then(($body) => {
      if ($body.find('.alert-success').length) {
        cy.get('.alert-success').should('contain', 'Success')
      } else if ($body.find('.status').length) {
        cy.get('.status').should('contain', 'Success')
      } else {
        cy.contains('Success', { matchCase: false }).should('be.visible')
      }
    })
    
    cy.contains('a', 'Home').click()
    
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })
})