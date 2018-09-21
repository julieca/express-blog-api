import Post from '../models/post';
import _ from 'lodash';
import cuid from 'cuid';
import slug from 'limax';
import sanitizeHtml from 'sanitize-html';
import response from '../helpers/response';

export default {
  getAll: async (req, res) => {
    try{
      const params = _.pick(req.params, ['title', 'category']);
      let filter = { isDelete: false }
      if(params.category){
        filter.category = params.category;
      }
      if(params.title){
        filter.title = { "$regex": params.title, "$options": "i" } ;
      }
      await Post.find(filter).sort('-editDate').exec((err, posts) => {
        if (err) {
          return response.sendError(res, err);
        }
        return response.sendOK(res, posts);
      });
    }
    catch(err){
      return response.sendError(res, err);
    }
  },

  getById: async (req, res) => {
    const { cuid } = req.params
    try{
      Post.findOne({ cuid }).exec((err, post) => {
        if (err) {
          return response.sendError(res, err);
        }
        if(!post){
          return response.sendNoContent(res);
        }
        return response.sendOK(res, post);
      });
    }
    catch(err){
      return response.sendError(res, err);
    }
  },

  add: async (req, res) => {
    try {
      const keys = Object.keys(Post.schema.paths);
      const body = _.pick(req.body, keys);
      
      if (!body.title || !body.content) {
        return response.sendForbidden(res);
      }

      const newPost = new Post(req.body);

      newPost.title = sanitizeHtml(newPost.title);
      newPost.content = sanitizeHtml(newPost.content);

      newPost.slug = slug(newPost.title.toLowerCase(), { lowercase: true });
      newPost.cuid = cuid();

      newPost.save((err, post) => {
        if (err) {
          return response.sendError(res, err);
        }
        return response.sendCreated(res, post);
      });
    }
    catch (err) {
      return response.sendError(res, err);
    }
  },

  update: async (req, res) => {
    try {
      if (!req.body.post.title || !req.body.post.content) {
        res.status(403).end();
      }
      Post.findOne({ cuid: req.params.cuid }).exec((err, post) => {
        if (err) {
          res.status(500).send(err);
        } else {
          post.title = req.body.post.title || post.title;
          post.content = req.body.post.content || post.content;
          post.editDate = Date.now;

          post.save((err, saved) => {
            if (err) {
              res.status(500).send(err)
            }
            res.json({ post: saved });
          });
        }
      });
    }
    catch (err) {
      return response.sendError(res, err);
    }
  },

  remove: async (req, res) => {
    try {
      const { cuid } = req.params
      Post.findOne({ cuid }).exec((err, post) => {
        if (err) {
          return response.sendForbidden(res);
        }

        post.isDelete = true;
        post.editDate = Date.now;
        
        post.save((err, post) => {
          if (err) {
            return response.sendError(res, err);
          }
          return response.sendOK(res, post);
        });
      });
    }
    catch (err) {
      return response.sendError(res, err);
    }
  }
}