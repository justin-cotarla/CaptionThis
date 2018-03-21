import Nightmare from 'nightmare';

describe('Acceptance Tests', () => {
    it('Passes AT1', () => {
        return Nightmare({ show: true })
            .cookies.clearAll()
            .goto(`http://${process.env.REACT_APP_IP}/`)
            .wait('div.logo')
            .click('div.login-button')
            .wait('.user-form-field')
            .type('input[name="username"]', 'test')
            .type('input[name="password"]', 'test')
            .click('div.login2-button')
            .wait(1000)
            .cookies.get('token')
            .end()  
            .then(token => {
                expect(token).toBeTruthy();
            })
    });

    it('Passes AT3', () => {
        return Nightmare({ show: true })
            .goto(`http://${process.env.REACT_APP_IP}/`)
            .wait(500)
            .exists('.Moments-list')
            .end()
            .then(element => {
                expect(element).toBeTruthy();
            })
    });
});
