const router = require('express').Router();
const { User, Thought } = require('../../models');

// GET all thoughts
router.get('/', async (req, res) => {
  try {
    const thoughts = await Thought.find();
    res.json(thoughts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET to get a single thought by its _id
router.get('/:thoughtId', async (req, res) => {
  try {
    const thought = await Thought.findOne({ _id: req.params.thoughtId }).select('-__v');
    if (!thought) {
      res.status(404).json({message: 'No thought with that ID'});
    }
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST to create a new thought and push the created thought's _id to the associated user's thoughts array field
router.post('/', async (req, res) => {
  try {
    const thought = await Thought.create(req.body);
    const user = await User.findOneAndUpdate(
      { username: req.body.username },
      { $addToSet: { thoughts: thought._id } },
      { runValidators: true, new: true }
    );
    res.json({ thought, user });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// PUT to update a thought by its _id
router.put('/:thoughtId', async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true },
    );
    if (!thought) {
      res.status(404).json({ message: 'No thought with that ID'});
    };
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE to remove a thought by its _id
router.delete('/:thoughtId', async (req, res) => {
  try {
    const thought = await Thought.findOneAndDelete(
      { _id: req.params.thoughtId },
    );
    if (!thought) {
      res.status(404).json({ message: 'No thought with that ID'});
    };
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST to create a reaction stored in a single thought's reactions array field
router.post('/:thoughtId/reactions', async (req, res) => {
  try {
    const thoughtReaction = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    );

    if (!thoughtReaction) {
      res.status(404).json({ message: 'No thought found with that ID' });
    }

    res.json(thoughtReaction);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE to pull and remove a reaction by the reaction's reactionId value
router.delete('/:thoughtId/reactions', async (req, res) => {
  try {

    const thoughtReaction = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { _id: req.body._id } } },
      { runValidators: true, new: true }
    );

    if (!thoughtReaction) {
      res.status(404).json({ message: 'No thought found with that ID' });
    }

    res.json(thoughtReaction);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;