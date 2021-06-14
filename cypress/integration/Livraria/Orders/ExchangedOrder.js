describe('order exchange merchadises', () => {
    before(() => {
        cy.programmaticallyLogOut();
    })

    // manager actions
    it('should navigate to admin home page', () => {
        cy.visit('/admin');
        cy.intercept('/user/login').as('loginRequest');
        cy.fillLoginForm();
        cy.wait('@loginRequest');
    });

    it('should navigate to orders page', () => {
        cy.navigateByHeaderLinks('orders');
    });

    it('should select and update status', () => {
        cy.managerOrderStatus('em processamento');
    });
    // end manager actions
    // customer actions
    it('should navitate to profile page', () => {
        cy.programmaticallyLogOut();

        cy.visit('/profile');
        cy.intercept('/user/login').as('loginRequest');
        cy.fillLoginForm();
        cy.wait('@loginRequest');
        cy.navigateByHeaderLinks('orders');
    });
    it('should request a exchange merchandises', () => {
        cy.managerOrderStatus('entregue');
    });
    // end customer actions
    // manager actions
    it('should do login and navigate to admin orders page', () => {
        cy.programmaticallyLogOut();

        cy.visit('/admin/pedidos');
        cy.intercept('/user/login').as('loginRequest');
        cy.fillLoginForm();
        cy.wait('@loginRequest');
    });
    it('should select and update status of order with status=em troca', () => {
        cy.managerOrderStatus('em troca');
        cy.wait(500);
        cy.managerOrderStatus('troca autorizada');
    });
});
