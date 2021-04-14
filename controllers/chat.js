const { StatusCodes } = require('http-status-codes');
// const { posts } = require('../services');

const create = async (req, res, next) => {
  try {
    // const { userId, body } = req;
    // const newPost = await posts.create(body, userId);
    // res.status(StatusCodes.CREATED).json(newPost);
    res.status(StatusCodes.CREATED).json('OK');
  } catch (err) {
    return next({ err });
  }
};

const getMessages = async (req, res, next) => {
  try {
    // const { q } = req.query;
    // const filterPosts = await posts.getPosts(q);
    // res.status(StatusCodes.OK).json(filterPosts);
    res.status(StatusCodes.OK).json('OK');
  } catch (err) {
    return next({ err });
  }
};

module.exports = {
  create,
  getMessages,
};