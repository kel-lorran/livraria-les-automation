const returnRandomElmInArr = arr => arr.sort(
    () => Math.random > 0.5 ? 1 : -1
)[0];

Cypress.Commands.add('fillPersonDataform', ({ name, lastName, cpf, birth, email }) => {
    const fieldMap = [
        {
            name: 'name',
            value: name
        },
        {
            name: 'lastName',
            value: lastName
        },
        {
            name: 'gender',
            type: 'select'
        },
        {
            name: 'cpf',
            value: cpf
        },
        {
            name: 'birthDate',
            value: birth
        },
        {
            name: 'phone',
            value: (Math.random() * 100000000000).toFixed().padEnd(10, '1')
        },
        {
            name: 'email',
            value: email
        },
        {
            name: 'password',
            value: 'Psw@1234'
        },
        {
            name: 'passwordRedundancy',
            value: 'Psw@1234'
        }
    ];
    cy.fillForm(fieldMap);
});

Cypress.Commands.add('fillAddressform', ({ street, neighborhood, city }) => {
    const fieldMap = [
        {
            name: 'homeType',
            type: 'select'
        },
        {
            name: 'publicPlaceType',
            type: 'select'
        },
        {
            name: 'publicPlaceName',
            value: street
        },
        {
            name: 'homeNumber',
            value: (Math.random() * 1000).toFixed()
        },
        {
            name: 'cep',
            value: (Math.random() * 100000000).toFixed().padEnd(8, '1')
        },
        {
            name: 'neighborhood',
            value: neighborhood
        },
        {
            name: 'city',
            value: city
        },
        {
            name: 'state',
            type: 'select'
        },
        {
            name: 'country',
            type: 'select'
        },
        {
            name: 'complement'
        },
        {
            name: 'addressLabel',
            value: `end em ${neighborhood}`
        }
    ];
    cy.fillForm(fieldMap);
});

Cypress.Commands.add('fillBookForm', ({ author, title, publishing, year, page, synopsis, height, width, weight, length }, step) => {
    const fieldMap = [
        [
            {
                name: 'author',
                value: author
            },
            {
                name: 'title',
                value: title
            },
            {
                name: 'category',
                type: 'select'
            },
            {
                name: 'publishing',
                value: publishing
            },
            {
                name: 'edition',
                value: `${returnRandomElmInArr([1, 2, 3, 4])}ª Ed.`
            },
            {
                name: 'isbn',
                value: (Math.random() * 10000000000000).toFixed()
            }
        ],
        [
            { 
                name: 'year',
                value: year
            },
            { 
                name: 'pageNumber',
                value: page
            },
            {
                name: 'synopsis',
                value: synopsis
            },
            { 
                name: 'height',
                value: height

            },
            { 
                name: 'width',
                value: width
            },
            { 
                name: 'weight',
                value: weight
            },
            { 
                name: 'length',
                value: length
            },
            { 
                name: 'pricingGroup',
                type: 'select'
            },
            { 
                name: 'codeBar',
                value: (Math.random() * 10000000000000).toFixed()
            },
       ]
    ]
    cy.fillForm(fieldMap[step]);
});

Cypress.Commands.add('newCreditCard', ({ numero, validity, label }) => {
    const fieldMap = [
        {
            name: 'creditCardCompany',
            type: 'select'
        },
        {
            name: 'cardNumber',
            value: numero
        },
        {
            name: 'validity',
            value: validity
        },
        {
            name: 'label',
            value: label
        }
    ]
    cy.get('a, button').contains(/novo cartão/ig).click();
    cy.fillForm(fieldMap);
    cy.get(`button[type="submit"]`).click();
});

Cypress.Commands.add('fillMerchandiseForm', () => {
    const fieldMap = [
        {
            name: 'price',
            value: returnRandomElmInArr([50.99, 70.99, 130.99])
        },
        {
            name: 'priceSeller',
            value: returnRandomElmInArr([230.99, 240, 260, 280])
        },
        {
            name: 'quantity',
            value: returnRandomElmInArr([30, 60, 200, 60])
        },
        {
            name: 'bookId',
            type: 'select'
        }
    ];
    cy.fillForm(fieldMap);
    cy.get(`[type="submit"]`).contains(/enviar/i).click();
});

Cypress.Commands.add('fillLoginForm', () => {
    const fieldMap = [
        {
            name: 'email',
            value: 'kelvinlorran_2010@hotmail.com'
        },
        {
            name: 'password',
            value: '123'
        }
    ];
    cy.fillForm(fieldMap);
    cy.get(`[type="submit"]`).contains(/entrar/i).click();
});

Cypress.Commands.add('getBook', ({ indexInBookList, quantity }) => {
    cy.get(`.book-display>div`)
        .each((e, i) => {
            if (i === indexInBookList) {
                cy.wrap(e).find('a').click();
                cy.get('button').contains(/comprar/ig).click()
                cy.get(`td i.fa-plus`).each((e, i) => {
                    if ( i === indexInBookList) {
                        for(let i = 1; i < quantity; i++){
                            cy.wrap(e).click();
                        }
                    }
                })
            }
        })
    cy.wait(6000)
})

Cypress.Commands.add('useCupons', ({ promocionalCoupon }) => {
    const coupons = promocionalCoupon ? [...promocionalCoupon] : [];
    cy.get('.cupom-item').contains(/valido/gi).parent()
        .find('.code')
        .then(e => {
            coupons.push(e.text());
            // cy.get(`a[href="/cesta-produtos"]`).click()
            cy.navigateByHeaderLinks('cart');
            coupons.forEach(code => cy.get(`input[placeholder="+ cupon"]`).type(code).type('{enter}'));
        });
});

Cypress.Commands.add('finishOrder', () => {
    cy.intercept('/order').as('managerOrder');
    cy.get('button').contains(/finalizar/i).click();
    cy.wait('@managerOrder')
    cy.get('button').contains(/confirmar/i).click();
    cy.wait('@managerOrder')
});

Cypress.Commands.add('managerOrderStatus', (targetStatus) => {
    const updateStatus = (regExp) => {
        cy.get('a, button').contains(/alterar status/i).click();
        cy.get(`[name="status"]`).click();
        cy.get(`[name="status"] ~ .options span`).contains(regExp).click({ force: true });
        cy.get(`button[type="submit"]`).contains(/alterar/i).click();
    };

    const orderExchanged = ()  => {
        cy.get('a, button').contains(/solicitar troca/i).click();
        cy.get('[data-merchandiseide]').each((e, i) => {
            if(!i || Math.random() > 0.73)
                cy.wrap(e).click();
        }).then(() => cy.get('a, button').contains(/confirmar/i).click());
    }

    const approveExchange = () => {
        cy.get('a, button').contains(/aprovar troca/i).click();
    }

    const receiveMerchandise = () => {
        updateStatus(/mercadoria devolvida/i);
        cy.wait(500);
        const regExpYesOrNo = Math.random() > 0.5 ? /sim/i : /não/i
        cy.get('a, button').contains(regExpYesOrNo).click();
    }

    const findAndUpdade = (updateFunc, possibleNextStatus = [], qtd = 1) => {
        let qtdToIncrement = qtd;
        cy.get(`tbody td:last-of-type`).each(([e], i) => {
            if ((new RegExp(targetStatus, 'i')).test(e.textContent) && 0 < qtdToIncrement--) {
                cy.wrap(e).parent().click();
                cy.wait(500);
                if (possibleNextStatus.length) {
                    updateFunc(possibleNextStatus[i % possibleNextStatus.length]);
                } else {
                    updateFunc();
                }
                cy.wait(500);
            }
        });
    }

    switch (targetStatus) {
        case 'em processamento':
            findAndUpdade(updateStatus, [/entregue/i, /compra aprovada/i, /compra recusada/i, /em transporte/i], 10);
            break;
        case 'entregue':
            findAndUpdade(orderExchanged);
            break;
        case 'em troca':
            findAndUpdade(approveExchange);
            break;
        case 'troca autorizada':
            findAndUpdade(receiveMerchandise);
            break;
        default:
            break;
    }
});
