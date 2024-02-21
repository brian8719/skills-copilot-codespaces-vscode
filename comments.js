// Create new server
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const User = require('../models/User');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

// Create new comment
router.post('/:postId', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        const user = await User.findById(req.user.id).select('-password');
        const newComment = new Comment({
            text: req.body.text,
            user: req.user.id,
            post: req.params.postId,
            name: user.name,
            avatar: user.avatar
        });
        const comment = await newComment.save();
        post.comments.unshift(comment.id);
        await post.save();
        res.json(comment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete comment