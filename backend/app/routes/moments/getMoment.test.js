import databaseUtil from '../../utility/DatabaseUtil';
import getMoment from './getMoment.js';

<<<<<<< HEAD

=======
>>>>>>> 647bce1383c2726e3ea71dcadbb26977604716d5
const request = {
    params: {
        momentid: 1,
    },
};

<<<<<<< HEAD
/* const emptyRequest = {
    params: {
        momentid: 1,
    },
}; */

=======
>>>>>>> 647bce1383c2726e3ea71dcadbb26977604716d5
const reply = {
    response: jest.fn().mockImplementation(() => ({
        code: () => {},
    })),
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe('/api/getMoments endpoint', () => {
    it('Successfully get a moment', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise((resolve) => {
            resolve({
                rows: [{
                    ID: 1,
                    IMG_URL: 'test',
<<<<<<< HEAD
                    DESCRIPTION: 'testDescription',
                    DATA_ADDED: 0,
                    USER_ID: 1,
=======
                    DESCRIPTON: 'test',
                    DATE_ADDED: 1,
                    USER_ID: 1,
                    USERNAME: 'test',
>>>>>>> 647bce1383c2726e3ea71dcadbb26977604716d5
                }],
                fields: {},
            });
        }));
<<<<<<< HEAD

        return getMoment.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(1);
            });
    });

=======
        return getMoment.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0]).toEqual({
                    code: 1,
                    moment: {
                        moment_id: 1,
                        img_url: 'test',
                        description: 'test',
                        date_added: 1,
                        user: {
                            username: 'test',
                            user_id: 1,
                        },
                    },
                });
            });
    });
>>>>>>> 647bce1383c2726e3ea71dcadbb26977604716d5
    it('Nothing is returned', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise((resolve) => {
            resolve({
                rows: {},
                fields: {},
            });
        }));
<<<<<<< HEAD

=======
>>>>>>> 647bce1383c2726e3ea71dcadbb26977604716d5
        return getMoment.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(3);
            });
    });
<<<<<<< HEAD
    /*  it('empty request', () => {
        momentsRoute.handler(emptyRequest, reply);
        expect(reply.response.mock.calls[0][0].code).toBe(3);
    }); */

=======
>>>>>>> 647bce1383c2726e3ea71dcadbb26977604716d5
    it('Handle unknown error', () => {
        databaseUtil.sendQuery = jest.fn(() => new Promise(() => {
            throw new Error();
        }));
        return getMoment.handler(request, reply)
            .then(() => {
                expect(reply.response.mock.calls[0][0].code).toBe(4);
            });
    });
});
