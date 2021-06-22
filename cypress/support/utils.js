Cypress.Commands.add('fillForm', fieldMap => {
    fieldMap.map(({ name, type, value }) => {
        const valueComputed = value || 'I am not has predefined value';

        switch (type) {
            case 'select':
                let randomChildIndex = -1;
                cy.get(`*[name="${name}"] + .options > *`).each((e, i, { length }) => {
                    if (randomChildIndex < 0)
                        randomChildIndex = Math.floor(Math.random() * 100) % length;
                    if (i === randomChildIndex) {
                        console.log('select option ' + randomChildIndex);
                        cy.wrap(e).click({ force: true });
                    }
                });
                break;
        
            default:
                if ( value || (Math.random() > 0.5)) {
                    cy.get(`*[name="${name}"]`).type(valueComputed, { force: true });
                }
                break;
        }
    });
});


Cypress.Commands.add('navigateByHeaderLinks', (destiny) => {
    switch (destiny) {
        case 'home':
            cy.intercept('/merchandise/search').as('getCatalog');
            cy.get('header a img.logo').click({ force: true });
            cy.wait('@getCatalog');
            break;
        case 'cart':
            cy.intercept('/customer/own-profile').as('getProfile');
            cy.get('header .fa-shopping-cart').click({ force: true });
            cy.wait('@getProfile');
            break;
        case 'profile':
            cy.intercept('/customer/own-profile').as('getProfile');
            cy.get('header a, header button').contains(/conta/i).click({ force: true });
            cy.wait('@getProfile');
            break;
        case 'orders':
            cy.intercept('/order').as('getOrders');
            cy.get('header a, header button').contains(/pedidos/i).click({ force: true });
            cy.wait('@getOrders');
            break;
    
        default:
            break;
    }
});

Cypress.Commands.add('selectInTable', ({ sideLabel, index }) => {
    cy.wait(500);
    cy.contains(sideLabel).parent().parent()
    .find(`tbody tr:nth-of-type(${index + 1})`)
    .click();
});

Cypress.Commands.add('selectInTableRandom', ({ sideLabel }) => {
    let randoChildIndex;
    cy.wait(500);
    cy.contains(sideLabel).parent().parent()
    .find(`tbody tr`).each((e, i, { length }) => {
        if (!i)
            randoChildIndex = Math.floor(Math.random() * 100) % length;
        if (i === randoChildIndex)
            cy.wrap(e).click({ force: true });
    });
});

Cypress.Commands.add('programmaticallyLogOut', () => {
    cy.clearLocalStorage();
    cy.then(() => {
        window.sessionStorage.clear();
    });
});
