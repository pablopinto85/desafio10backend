const expect = require('chai').expect;
const { errorHandlerMiddleware } = require('./errorHandlerMiddleware');


describe('errorHandlerMiddleware', () => {
    it('debe manejar un error conocido', (done) => {
                const req = {};
        const res = {
           status: (code) => {
             expect(code).to.equal(500);
             return res;
           },
           json: (obj) => {
             expect(obj).to.have.property('error');
             expect(obj.error).to.equal(true);
             expect(obj).to.have.property('code');
             expect(obj.code).to.equal('UNKNOWN_ERROR');
             expect(obj).to.have.property('message');
             expect(obj.message).to.equal('Error desconocido');
             done();
           },
        };
        const next = (err) => {
           errorHandlerMiddleware(err, req, res, next);
        };
       
        next(new Error('Esto es un error conocido'));
       });})