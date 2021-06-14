const street = chance.street();
const neighborhood = `vila ${chance.country()}`;
const city = chance.city(); 

const addressData = { street, neighborhood, city };

describe('Add address to random customer', () => {
    before(() => {
        cy.clearLocalStorage()
        cy.then(() => {
            window.sessionStorage.clear()
        })
    })

    it('should navigate to manager address page inside admin area', () => {
        cy.visit('/admin/clientes');
        cy.wait(500);
    });

    it('Login to Continue', () => {
        cy.intercept('/user/login').as('loginRequest');
        cy.fillLoginForm();
        cy.wait('@loginRequest');
    });

    it('Select random customer in list of active customers', () => {
        cy.selectInTableRandom({ sideLabel: /^ativos/i });
        cy.wait(500);
    });
    
    it('should fill all fields of form 1/1 - address data', () => {
        cy.intercept('/customer').as('addressesReloaded');
        cy.get('a, button').contains(/\+ Endereço/i).click();
        cy.fillAddressform(addressData);
        cy.get(`[type="submit"]`).contains(/enviar/i).click();
        cy.wait('@addressesReloaded');
    });
});
