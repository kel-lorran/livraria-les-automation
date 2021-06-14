const nCartao = chance.cc({type: 'mc'});
const vCartao = chance.exp();
const label = `my ${chance.word()}`;

describe('Make order with two credit cards and coupons', () => {
    before(() => {
        cy.clearLocalStorage();
        cy.then(() => {
            window.sessionStorage.clear();
        });

    });

    it('Go to home', () => {
        cy.visit('/');
    });

    it('Select products and quantities, go to cart', () => {
        cy.getBook({ indexInBookList: 0, quantity: 2 });
        cy.navigateByHeaderLinks('home');
        cy.getBook({ indexInBookList: 1, quantity: 3 });
    });

    it('Login to Continue', () => {
        cy.intercept('/user/login').as('loginRequest');
        cy.get('button').contains(/logar para continuar/ig).click()
        cy.fillLoginForm();
        cy.wait('@loginRequest');
    })
    
    it('Add credit card', () => {
        cy.wait(1000);
        cy.get('a, button').contains(/Gerenciar Cartões/i).click();
        cy.newCreditCard({ numero: nCartao, validity: vCartao, label });
        cy.navigateByHeaderLinks('cart');
    });

    it('Insert cupons', () => {
        cy.navigateByHeaderLinks('profile');
        cy.useCupons({ promocionalCoupon: [] });
    });

    it('Should be in /cesta-produtos page', () => {
        cy.window().then(({ location: { pathname } }) => {
            if (pathname !== '/cesta-produtos')
            cy.navigateByHeaderLinks('cart');
        });
    });

    it('Select credit card', () => {
        cy.selectInTable({ sideLabel: /^cartões/i, index: 0})
    })

    it('Select credit card', () => {
        cy.selectInTable({ sideLabel: /^cartões/i, index: 1})
    })
    
    it('Select address', () => {
        cy.selectInTable({ sideLabel: /^endereço/i, index: 0});
    });

    it('Finish order and review', () => {
        cy.finishOrder();
        cy.location().should(loc => expect(loc.pathname).to.eq('/'));
    });
})
