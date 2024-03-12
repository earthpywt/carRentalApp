describe("Cars", () => {
    it("Should fetch cars and display", () => {
        // cy.log("Before intercept");
        cy.intercept(
            {
                method: "GET",
                url: "http://localhost:5000/api/v1/cars",
            },
            (req) => {
                delete req.headers["if-none-match"];
            }
        ).as("getCars");
        // cy.log("After intercept");

        //visit homepage
        cy.visit("/");
        cy.get('a[href="/car"]').should("exist");
        cy.get('a[href="/car"]').click();

        //at car page
        var cars: string[] = [];
        cy.wait(2000);
        cy.wait("@getCars")
            .should(({ request, response }) => {
                // assert results
                expect(response?.statusCode).equal(200);
                expect(response?.body.data).be.not.null;
                expect(response?.body.data).to.have.length(
                    response?.body.count
                );
                cars = response?.body.data;
            })
            .then(() => {
                console.log(cars);
                cars.forEach((car) => {
                    cy.contains(car.model).should("be.visible");
                });
            });
    });
});
