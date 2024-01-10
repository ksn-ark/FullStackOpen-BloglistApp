describe('Note app', function () {
  beforeEach(function () {
    cy.visit('')
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'groot',
      username: 'root',
      password: 'password',
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
  })

  it('login form is shown & blog-form and blogs-list is not shown', function () {
    cy.get('.login-form').should('exist')
    cy.get('.blog-form').should('not.exist')
    cy.get('.blogs-list').should('not.exist')
    cy.contains('Log in to application')
  })

  describe('Login', function () {
    it('it succeeeds with correct credentials', function () {
      cy.get('#username').type('root')
      cy.get('#password').type('password')
      cy.get('#login-button').click()

      cy.contains('groot logged in')
    })
    it('it fails with wrong credentials', function () {
      cy.get('#username').type('wrong')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('html').should('not.contain', 'groot logged in')
    })
    it('notification displayed upon failing is red', function () {
      cy.get('#username').type('wrong')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('html').should('not.contain', 'groot logged in')
      cy.get('.notification').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('when logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'root', password: 'password' })
    })
    it('a new blog can be created', function () {
      cy.contains('new blog').click()
      cy.get('#title').type('new cypress blog')
      cy.get('#author').type('cypress')
      cy.get('#url').type('cypress.com')
      cy.get('#create-blog-button').click()
      cy.contains('new cypress blog by cypress')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'another cypress blog',
          author: 'cypress',
          url: 'cypress.com',
        })
      })

      it('it can be liked', function () {
        cy.contains('another cypress blog').find('button').click()
        cy.get('.blog-details').contains('likes 0').as('likesCount')
        cy.get('@likesCount').find('button').as('likeButton')
        cy.get('@likeButton').click()
        cy.get('html').contains('likes 1')
      })

      it('it can be deleted by same user', function () {
        cy.contains('another cypress blog').find('button').click()
        cy.get('.blog-details')
          .find('button')
          .contains('remove')
          .as('removeButton')
        cy.get('@removeButton').should('exist')
        cy.get('@removeButton').click()
        cy.get('html').should('not.contain', 'another cypress blog')
      })

      it('it cannot be deleted by a different user', function () {
        const user = {
          name: 'boot',
          username: 'loot',
          password: 'lassword',
        }
        cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
        cy.login({ username: 'loot', password: 'lassword' })
        cy.contains('another cypress blog').find('button').click()
        cy.get('.blog-details')
          .find('button')
          .contains('remove')
          .should('not.exist')
      })
    })

    describe('and multiple blogs exist', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'first blog',
          author: 'cypress',
          url: 'cypress.com',
        })
        cy.createBlog({
          title: 'second blog',
          author: 'cypress',
          url: 'cypress.com',
        })
        cy.createBlog({
          title: 'third blog',
          author: 'cypress',
          url: 'cypress.com',
        })
      })

      it('they are ordered according to likes from top to bottom', function () {
        cy.get('.blog').then((blogs) => {
          for (let i = 0; i < 3; i++) {
            cy.get(blogs[i]).find('button').click()
          }
        })
        cy.blogLiker({ likes: 4, title: 'first blog' })
        cy.blogLiker({ likes: 6, title: 'second blog' })
        cy.blogLiker({ likes: 10, title: 'third blog' })
        cy.get('.blog').eq(0).should('contain', 'third blog')
        cy.get('.blog').eq(1).should('contain', 'second blog')
        cy.get('.blog').eq(2).should('contain', 'first blog')
      })
    })
  })
})
