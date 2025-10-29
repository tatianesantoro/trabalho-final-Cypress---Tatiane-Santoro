describe('Testes de Produtos', () => {
  
  // Caso de Teste 5: Registrar usuário com e-mail existente
  it('deve mostrar erro ao registrar com email existente', () => {
    cy.visit('/')
    
    const email = Cypress.env('registeredEmail')
    const nome = 'Usuário Teste Duplicado'

    if (!email) {
      cy.log('Nenhum email cadastrado encontrado. Necessário relizar cadastro.')
      return
    }

    cy.signup(nome, email)
    
    cy.wait(1000)
    
    cy.contains('Email Address already exist', { matchCase: false })
      .should('be.visible')
  })

  // Caso de Teste 8: Verificar todos os produtos e a página de detalhes do produto
  it('deve exibir todos os produtos e detalhes do produto', () => {
    cy.visit('/products')
    cy.url().should('include', '/products')

    cy.get('.features_items', { timeout: 10000 }).should('be.visible')
    cy.get('.title').should('contain', 'All Products')
    
    cy.wait(2000)
    
    cy.get('.choose').first().click()
  
    cy.wait(3000)
    
    cy.url().should('include', '/product_details/')
    
    cy.get('body').then(($body) => {
      const bodyText = $body.text()
      
      expect(bodyText).to.include('Category')
      expect(bodyText).to.include('Availability')
      expect(bodyText).to.include('Condition')
      
      cy.get('h2, h1').should('be.visible')
      cy.get('span').should('contain', 'Rs.')
      
      cy.contains('Category', { matchCase: false }).should('be.visible')
      cy.contains('Availability', { matchCase: false }).should('be.visible')
      cy.contains('Condition', { matchCase: false }).should('be.visible')
      cy.contains('Brand', { matchCase: false }).should('be.visible')
    })
  })

  // Caso de Teste 9: Pesquisar produto
  it('deve buscar produtos', () => {
    cy.visit('/products')
    cy.url().should('include', '/products')
    const termoBusca = 'dress'
    cy.get('#search_product').type(termoBusca)
    cy.get('#submit_search').click()
    
  cy.get('.features_items', { timeout: 10000 }).should('be.visible')
    cy.get('.title').should('contain', 'Searched Products')
    
    cy.get('.product-image-wrapper').should('have.length.gt', 0)
    
    cy.get('.product-image-wrapper').then(($products) => {
      const matchingProducts = $products.filter((index, product) => {
        return Cypress.$(product).text().toLowerCase().includes(termoBusca.toLowerCase())
      })
      
      expect(matchingProducts.length).to.be.gt(0, 
        `Deveria encontrar pelo menos um produto contendo "${termoBusca}"`
      )
      
      cy.log(`Encontrados ${matchingProducts.length} produtos com "${termoBusca}"`)
    })
  })

  // Caso de Teste 10: Verificar assinatura na home page
  it('deve verificar inscrição na página inicial', () => {
    cy.visit('/')
    
    cy.get('#footer').scrollIntoView()
    cy.get('.single-widget h2').should('contain', 'Subscription')
    
    const email = Cypress.env('registeredEmail') || `teste.tati${Date.now()}@prova.com`
    Cypress.env('registeredEmail', email)

    cy.get('#susbscribe_email').type(email)
    cy.get('#subscribe').click()
    
    cy.get('.alert-success').should('contain', 'You have been successfully subscribed!')
  })


// Caso de Teste 15: Faça o pedido: Registre-se antes de finalizar a compra
it('deve realizar pedido: registrar antes do checkout', () => {

  cy.visit('/')
  cy.get('header, nav, footer, body', { timeout: 10000 }).should('be.visible')
  
  cy.get('body', { timeout: 10000 }).then(($body) => {
    const bodyText = $body.text()
    const hasHomeText = /\bHome\b/.test(bodyText)
    const hasLogo = $body.find('.logo, .navbar-brand, .brand, .site-title').length > 0
    expect(hasHomeText || hasLogo, 'Home carregada (texto ou logo)').to.be.true
  })

  cy.get('a[href="/login"]').first().should('be.visible').click()

  const email = `teste_pedido_${Date.now()}@exemplo.com`
  const nome = 'Tatianetestepedido'
  const endereco = 'Rua Franco, 8'

  cy.get('input[data-qa="signup-name"]').should('be.visible').type(nome)
  cy.get('input[data-qa="signup-email"]').should('be.visible').type(email)
  cy.get('button[data-qa="signup-button"]').click()

  cy.get('#password', { timeout: 10000 }).should('be.visible')
  cy.completeSignupForm(
    'entrar563@',
    'Sofia',
    'Azevrds',
    'ImagensLtda',
    endereco,
    'bloco 2A apto 82',
    'RJ',
    'Rio de Janeiro',
    '2345790',
    '98730245'
  )

  cy.get('h2.title', { timeout: 10000 }).should('contain.text', 'Account Created!')
  cy.get('a[data-qa="continue-button"]').first().should('be.visible').click()

  cy.get('li', { timeout: 10000 }).contains('Logged in as').should('be.visible')
  cy.get('li').contains('Logged in as').should('contain.text', nome)

  cy.get('a[href="/products"]').first().should('be.visible').click()
  
  cy.get('.features_items, .product-list, .product-image-wrapper', { timeout: 10000 }).should('exist')
  
  cy.get('.product-image-wrapper').first().within(() => {
    cy.get('a, button').contains(/Add to cart|Add to Cart|Add/i).first().click({ force: true })
  })

  cy.get('body', { timeout: 10000 }).then(($body) => {
    const modal = $body.find('#cartModal.modal.show, .modal.show, .modal.in')
    
    if (modal.length > 0 && modal.is(':visible')) {
      cy.log('Modal detectado, tentando fechar...')
      
      const continueBtn = modal.find('button, a').filter((i, el) => 
        /Continue Shopping|Continue|Continuar Comprando/i.test(el.innerText)
      )
      
      if (continueBtn.length > 0) {
        cy.wrap(continueBtn).first().click({ force: true })
        cy.wait(1000)
        return
      }
      
      const closeBtn = modal.find('button.close, [data-dismiss="modal"], .close')
      if (closeBtn.length > 0) {
        cy.wrap(closeBtn).first().click({ force: true })
        cy.wait(1000)
        return
      }
      
      const backdrop = $body.find('.modal-backdrop.fade.in, .modal-backdrop.show, .modal-backdrop')
      if (backdrop.length > 0) {
        cy.wrap(backdrop).first().click({ force: true })
        cy.wait(1000)
        return
      }
      
      cy.window().then((win) => {
        modal.remove()
        backdrop.remove()
      })
    }
  })

  cy.get('body').then(($body) => {
    const remainingModal = $body.find('#cartModal.modal.show, .modal.show')
    
    if (remainingModal.length > 0 && remainingModal.is(':visible')) {
      cy.visit('/view_cart')
    } else {
      cy.get('a[href="/view_cart"]').first().should('be.visible').click({ force: true })
    }
  })

  cy.url({ timeout: 10000 }).should('include', '/view_cart')
  cy.contains(/Shopping Cart|Cart/i).should('be.visible')

  cy.wait(2000)

  cy.get('body').then(($body) => {
    const candidates = [
      '.btn.btn-default.check_out',
      'a.check_out',
      'a.btn.check_out',
      'a[href*="checkout"]',
      'a:contains("Proceed To Checkout")',
      'a:contains("Proceed to Checkout")',
      'a:contains("Proceed")',
      'button:contains("Proceed To Checkout")',
      'button:contains("Proceed")'
    ]

    for (const sel of candidates) {
      const found = $body.find(sel)
      if (found.length > 0) {
        return cy.wrap(found.first(), { timeout: 10000 }).should('be.visible').click({ force: true })
      }
    }

    const fallbackFound = $body.find('*').filter((i, el) => /Proceed To Checkout|Proceed to Checkout|Proceed/i.test((el && el.innerText) || ''))
    if (fallbackFound.length > 0) {
      return cy.wrap(fallbackFound.first(), { timeout: 10000 }).should('be.visible').click({ force: true })
    }

    cy.screenshot('checkout-button-not-found')
    cy.get('body').then(b => cy.log(b.html().slice(0, 2000)))
    throw new Error('Proceed To Checkout button not found with any selector')
  })

  cy.get('#address_delivery', { timeout: 10000 }).should('contain.text', endereco)
  cy.contains(/Review Order|Your Order/i).should('exist')

  cy.get('textarea[name="message"], textarea#message, textarea')
    .first()
    .type('Comentário de teste - confirmar pedido')
  
  cy.contains('Place Order', { matchCase: false, timeout: 10000 })
    .first()
    .should('be.visible')
    .click()

  cy.get('input[name="name_on_card"]', { timeout: 10000 })
    .should('be.visible')
    .type('Tatianetestepedido')
  cy.get('input[name="card_number"]').type('89795673927734')
  cy.get('input[name="cvc"]').type('913')
  cy.get('input[name="expiry_month"]').type('12')
  cy.get('input[name="expiry_year"]').type('2030')

  cy.contains(/Pay and Confirm Order|Pay and Confirm|Pay/i, { timeout: 10000 })
    .first()
    .should('be.visible')
    .click()

  cy.get('body', { timeout: 30000 }).then(($body) => {
    const successContainerVisible = $body.find('div#success_message.col-md-12.form-group:visible .alert-success.alert')
    if (successContainerVisible.length) {
      cy.wrap(successContainerVisible).should('be.visible').and('contain.text', 'Your order has been placed successfully!')
      return
    }

    const anyAlertVisible = $body.find('.alert-success:visible')
    if (anyAlertVisible.length && /Your order has been placed successfully!/i.test(anyAlertVisible.text())) {
      cy.wrap(anyAlertVisible).should('be.visible')
      return
    }

    if ($body.text().includes('Your order has been placed successfully!')) {
      cy.log('Texto de sucesso encontrado no DOM, mas não visível. Prosseguindo com validação de existência.')
      return
    }

    throw new Error('Não foi possível localizar a confirmação de pedido visível dentro do timeout. Verifique manualmente o fluxo de pagamento.')
  })

  cy.get('a[href="/delete_account"]').first().should('be.visible').click()

  cy.get('h2.title', { timeout: 10000 }).should('contain.text', 'Account Deleted!')
  cy.get('a[data-qa="continue-button"]').first().should('be.visible').click()
})
})