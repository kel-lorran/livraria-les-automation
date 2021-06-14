const street = chance.street();
const neighborhood = `vila ${chance.country()}`;
const city = chance.city(); 

const addressData = { street, neighborhood, city };

describe('Add address to selected customer', () => {
    before(() => {
        cy.clearLocalStorage()
        cy.then(() => {
            window.sessionStorage.clear()
        })
    })

    it('should navigate to manager address page inside profile area', () => {
        cy.visit('/profile/endereco');
        cy.wait(500);
    });

    it('Login to Continue', () => {
        cy.intercept('/user/login').as('loginRequest');
        cy.fillLoginForm();
        cy.wait('@loginRequest');
    });

    it('should fill all fields of form 1/1 - address data', () => {
        cy.intercept('/customer/own-profile').as('userAddressReload');
        cy.get('button, a').contains(/novo endereço/ig).click()
        cy.fillAddressform(addressData);
        cy.get(`[type="submit"]`).contains(/enviar/i).click();
        cy.wait('@userAddressReload');
    });
});
