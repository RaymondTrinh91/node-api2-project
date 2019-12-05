const express = require('express')
const Posts = require('./blogPost-model.js')

const router = express.Router()

router.use(express.json());

router.get('/', (req, res) => {
    Posts
        .find()
        .then(post => res.status(200).json(post))
        .catch(err => {
            console.log('GET all Posts', err)
            res.status(500).json({ message: 'Server was unable to retreive Posts' })
        })
})

router.get('/:id', (req, res) => {
    Posts
        .findById(req.params.id)
        .then(post => {
            if (!post.length > 0) {
                res.status(404).json({ message: 'Unable to find Post' })
            } else {
                res.status(200).json(post)
            }
        })
        .catch(err => {
            console.log('GET Posts by ID', err)
            res.status(500).json({ message: 'Server was unable to retreive Post' })
        })
})

router.get('/:id/comments', (req, res) => {
    Posts
        .findPostComments(req.params.id)
        .then(comment => {
            if (!comment) {
                res.status(404).json({ message: 'Unable to find Post' })
            } else {
                res.status(200).json(comment)
            }
        })
        .catch(err => {
            console.log('GET Comments by Post ID', err)
            res.status(500).json({ message: 'Server was unable to retreive Comments' })
        })
})

router.post('/', (req, res) => {
    const { title, contents } = req.body

    if (!title || !contents) {
        res.status(400).json({ message: 'Please add a Title and Content' })
    } else {
        Posts
            .insert(req.body)
            .then(newPost => res.status(201).json(newPost))
            .catch(err => {
                console.log('POST new Post', err)
                res.status(500).json({ message: 'Server was unable to create new Post' })
            })
    }
})

router.post('/:id/comments', (req, res) => {
    const { text } = req.body

    Posts
        .findById(req.params.id)
        .then(post => {
            if (!post.length > 0) {
                res.status(404).json({ message: 'Unable to find Post' })
            } else if (!text) {
                res.status(400).json({ message: 'Please add a comment' })
            } else {
                Posts
                    .insertComment({post_id: req.params.id, text})
                    .then(newComment => res.status(201).json(newComment))
                    .catch(err => {
                        console.log('Post new Comment', err)
                        res.status(500).json({ message: 'Server was unable to create new Comment' })
                    })
            }
        })
        .catch(err => {
            console.log('GET Posts by ID', err)
            res.status(500).json({ message: 'Server was unable to retreive Post for comments' })
        })
})

router.delete('/:id', (req, res) => {
    Posts
        .findById(req.params.id)
        .then(post => {
            if (!post.length > 0) {
                res.status(404).json({ message: 'Unable to find Post' })
            } else {
                Posts.remove(req.params.id).then(() => res.status(200).json({ message: 'Post was deleted' }))
            }
        })
        .catch(err => {
            console.log('DELETE Posts by ID', err)
            res.status(500).json({ message: 'Server was unable to delete Post' })
        })
})

router.put('/:id', (req, res) => {
    const { title, contents } = req.body
    Posts
        .findById(req.params.id)
        .then(post => {
            if (!post.length > 0) {
                res.status(404).json({ message: 'Unable to find Post' })
            } else if (!title || !contents) {
                res.status(400).json({ message: 'Please add a new title or new content' })
            } else {
                Posts
                    .update(req.params.id, req.body)
                    .then(updatePost => res.status(201).json(updatePost))
                    .catch(err => {
                        console.log('PUT post', err)
                        res.status(500).json({ message: 'Server was unable to update Post' })
                    })
            }
        })
        .catch(err => {
            console.log('GET Posts by ID', err)
            res.status(500).json({ message: 'Server was unable to retreive Post for Update' })
        })
})

module.exports = router