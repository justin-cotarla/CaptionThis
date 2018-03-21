import Nightmare from 'nightmare';

beforeAll(() => {
  global.Promise = require.requireActual('promise');
});

describe('Acceptance Tests', () => {
    it('Passes AT1', () => {
        return Nightmare({ show: true })
            .cookies.clearAll()
            .goto(`http://${process.env.REACT_APP_IP}/`)
            .wait('div.logo')
            .click('div.login-button')
            .wait('div.user-form-field')
            .type('input[name="username"]', 'test')
            .type('input[name="password"]', 'test')
            .click('div.login2-button')
            .wait(1000)
            .cookies.get('token')
            .end()
            .then(token => {
                expect(token).toBeTruthy();
            })
    }, 10000);

    it('Passes AT3', () => {
        return Nightmare({ show: true })
            .goto(`http://${process.env.REACT_APP_IP}/`)
            .wait(500)
            .exists('.Moments-list')
            .end()
            .then(element => {
                expect(element).toBeTruthy();
            })
    }, 30000);

    it('Passes AT8', () => {
        return Nightmare({ show: true })
            .goto(`http://${process.env.REACT_APP_IP}/`)
            .wait(500)
            .exists('.Moments-list')
            .wait(500)
            .click('div.login-button')
            .wait(500)
            .exists('div.user-form-field')
            .click('div.registration-button')
            .wait(500)
            .exists('div.user-form-field')
            .end()
            .then(element => {
                expect(element).toBeTruthy();
            })
    }, 50000);
});
