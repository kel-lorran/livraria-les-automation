const name = chance.name();
const lastName = chance.last();
const cpf = chance.cpf();
const birth = chance.birthday({ american: false }).toISOString().replace(/T.+/, '');
const phone = chance.phone({ formatted: false });
const email = chance.email();

const street = chance.street();
const neighborhood = `vila ${chance.country()}`;
const city = chance.city(); 

const personData = { name, lastName, cpf, birth, phone, email };
const addressData = { street, neighborhood, city };

describe('Create customer', () => {
    before(() => {
        cy.clearLocalStorage()
        cy.then(() => {
            window.sessionStorage.clear()
        })
    })

    it('should navigate to signin page', () => {
        cy.visit('/admin/clientes');
        cy.wait(1000);
    });

    it('Login to Continue', () => {
        cy.intercept('/user/login').as('loginRequest');
        cy.fillLoginForm();
        cy.wait('@loginRequest');
    });

    it('should fill al fields of form 1/2', () => {
        cy.get('a, button').contains(/novo cliente/i).click();
        cy.fillPersonDataform(personData);
        cy.get(`[type="submit"]`).contains(/enviar/i).click();
    });

    it('should fill al fields of form 2/2 - address data', () => {
        cy.intercept('/customer').as('createCustomer');
        cy.fillAddressform(addressData);
        cy.get(`[type="submit"]`).contains(/enviar/i).click();
        cy.wait('@createCustomer');
    });
});
