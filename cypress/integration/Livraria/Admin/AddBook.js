const author = chance.name();
const title = chance.sentence({ words: 3 });
const publishing = chance.sentence({ words: 1 });
const year = chance.year({min: 1990, max: 2010});
const page = chance.integer({min: 100, max: 600});
const synopsis = chance.paragraph({ sentences: 2 });
const height = chance.integer({min: 5, max: 30});
const width = chance.integer({min: 170, max: 250});
const weight = chance.integer({min: 200, max: 1000});
const length = chance.integer({min: 250, max: 300});

const bookData = { author, title, publishing, year, page, synopsis, height, width, weight, length };

describe('Add book', () => {
    before(() => {
        cy.programmaticallyLogOut();
    })

    it('should navigate to manager book page inside admin area', () => {
        cy.visit('/admin/livros');
        cy.wait(500);
    });

    it('Login to Continue', () => {
        cy.intercept('/user/login').as('loginRequest');
        cy.fillLoginForm();
        cy.wait('@loginRequest');
    });

    it('should fill all fields of form 1/2', () => {
        cy.intercept('/domain-items/category').as('getCategoryOptions');
        cy.intercept('/domain-items/price-group').as('getPriceGroupOptions');
        cy.get('button, a').contains(/novo livro/ig).click()
        cy.wait('@getCategoryOptions');
        cy.fillBookForm(bookData, 0);
        cy.get(`[type="submit"]`).contains(/continuar/i).click();
        cy.wait('@getPriceGroupOptions');
    });

    it('should fill all fields of form 2/2', () => {
        cy.intercept('/product').as('createBook');
        cy.fillBookForm(bookData, 1);
        cy.get(`[type="submit"]`).contains(/enviar/i).click();
        cy.wait('@createBook');
    });
});
