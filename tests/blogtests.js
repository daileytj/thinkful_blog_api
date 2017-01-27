'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const {BlogPosts} = require('../models');

const {
    app,
    runServer,
    closeServer
} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('Blog-Posts', function() {

    // start server before tests run
    before(function() {
        return runServer();
    });
    // close server after tests have run
    after(function() {
        return closeServer();
    });

    // test on GET call to api
    it('Should list blog posts on GET', function() {
        return chai.request(app)
            .get('/blog-posts')
            .then(function(res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.length.should.be.at.least(1);
                const expectedKeys = ['title', 'content', 'author', 'publishDate'];
                res.body.forEach(function(item) {
                    item.should.be.a('object');
                    item.should.include.keys(expectedKeys);
                });
            });
    });

    // test on POST call to api
    it('Should add a blog post on POST', function() {
        const newItem = {
            title: "Blog Post 4",
            content: "content for blog post 4",
            author: "Somebody...",
            publishDate: "some date..."
        };
        return chai.request(app)
            .post('/blog-posts')
            .send(newItem)
            .then(function(res) {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.include.keys('id', 'title', 'content', 'author', 'publishDate');
                res.body.id.should.not.be.null;
                res.body.should.deep.equal(Object.assign(newItem, {
                    id: res.body.id
                }));
            });
    });

    // test on PUT call to api
    it("Should update a blog on PUT", function() {
        const updateData = {
            title: 'an updated title',
            content: 'some updated content'
        };
        return chai.request(app)
            .get('/blog-posts')
            .then(function(res) {
                updateData.id = res.body[0].id;

                return chai.request(app)
                    .put(`/blog-posts/${updateData.id}`)
                    .send(updateData);
            })
            .then(function(res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.deep.equal(updateData);
            });
    });

    // test on DELETE call to api
    it('should delete a blog post on DELETE', function() {
        return chai.request(app)
            .get('/blog-posts')
            .then(function(res) {
                return chai.request(app)
                    .delete(`/blogposts/${res.body[0].id}`);
            })
            .then(function(res) {
                res.should.have.status(204);
            });
    });
});
