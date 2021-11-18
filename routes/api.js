/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const Book = require('../model').Book;

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){

      Book.find({}, (err, data) => {
          if(!data){
              res.json([])
          } else {
              const formatData = data.map((book) => {
                  return{
                      _id: book._id,
                      title: book.title,
                      commentcount: book.comments.length
                  };
              });
              res.json(formatData)
          }
      });
    })
    
    .post(function (req, res){
      let title = req.body.title;
      if(!title) {
          res.send("missing required field title");
          return;
      }
      const newBook = new Book({title, comment:[] });
      newBook.save((err, data) => {
          if(err || !data) {
              res.send("there was a error saving");
          } else {
              res.json({ _id: data._id, title: data.title})
          }
      });
    })
    
    .delete(function(req, res){
        Book.remove({}, (err, data) => {
            if(err || !data){
                res.send("error")
            } else {
                res.send("complete delete successful")
            }
        });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
        Book.findById(bookid, (err, data) => {
            if(!data){
                res.send("no book exists")
            } else {
                res.json({
                    comments: data.comments || [],
                    _id: data._id,
                    title: data.title,
                });
            }
        });
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
        if(!comment){
            res.send("missing required field comment")
            return;
        } 
        Book.findById(bookid, (err, bdata) => {
            if(!bdata){
                res.send("no book exists")
            } else {
                bdata.comments.push(comment);
                bdata.save((err, sdata) => {
                    res.json({
                        comments: sdata.comments,
                        _id: sdata._id,
                        title: sdata.title,
                    })
                });
            }
        });
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
        Book.findByIdAndDelete(bookid, (err, data) => {
            if(err || !data){
                res.send('no book exists');
            } else {
                res.send("delete successful")
            }
        });
    });
  
};
