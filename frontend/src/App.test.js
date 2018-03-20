import Nightmare from 'nightmare';

describe('Acceptance Tests', () => {
    it('Passes AT1', () => {
        const nightmare = Nightmare({ show: true });

        return nightmare
            .cookies.clearAll()
            .goto(`http://${process.env.REACT_APP_IP}/`)
            .wait('div.logo')
            .click('div.login-button')
            .wait('div.login-box-container')
            .type('input[name="username"]', 'test')
            .type('input[name="password"]', 'test')
            .click('div.login1-button')
            .wait(500)
            .cookies.get('token')
            .end()  
            .then(token => {       
                expect(token).toBeTruthy();
            });
            
    });
});
