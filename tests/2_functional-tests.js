/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
          chai
            .request(server)
            .post('/api/books')
            .send({
                title: "MAHI"
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                bookID = res.body._id;
                assert.equal(res.body.title, "MAHI");
                done();
            });
      });
      
      test('Test POST /api/books with no title given', function(done) {
          chai
            .request(server)
            .post('/api/books')
            .send({})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.text, "missing required field title");
                done();
            })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
          chai
            .request(server)
            .get('/api/books')
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.isArray(res.body, "array");
                done();
            })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
          chai
            .request(server)
            .get('/api/books/invalid')
            .end( (err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.text,"no book exists");
                done();
            })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
          chai
            .request(server)
            .get('/api/books/'+bookID)
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.title, "MAHI");
                done();
            })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
          chai
            .request(server)
            .post('/api/books/'+bookID)
            .send({
                comment: "henloo"
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.comments[0], "henloo");
                done();
            })
      });

      test('Test POST /api/books/[id] without comment field', function(done){
          chai
            .request(server)
            .post('/api/books/'+bookID)
            .send({comment: ""})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.text, "missing required field comment");
                done();
            })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
          chai
            .request(server)
            .post('/api/books/hee')
            .send({comment: "henloo"})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.text, "no book exists");
                done();
            })
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
          chai
            .request(server)
            .delete('/api/books/'+bookID)
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.text, "delete successful");
                done();
            })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
          chai
            .request(server)
            .delete('/api/books/asiof')
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.text, 'no book exists');
                done();
            });
      });

    });

  });

});
