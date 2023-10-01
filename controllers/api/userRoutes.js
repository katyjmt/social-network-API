const router = require('express').Router();
const { User } = require('../../models');

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET a single user by its _id and populated thought and friend data
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId }).select('-__v');
    if (!user) {
      res.status(404).json({message: 'No user with that ID'});
    }
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST a new user
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// PUT to update a user by its _id
router.put('/:userId', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true },
    );
    if (!user) {
      res.status(404).json({ message: 'No user with that ID'});
    };
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE to remove user by its _id
router.delete('/:userId', async (req, res) => {
  try {
    const user = await User.findOneAndDelete(
      { _id: req.params.userId },
    );
    if (!user) {
      res.status(404).json({ message: 'No user with that ID'});
    };
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST to add a new friend to a user's friend list
router.post('/:userId/friends/:friendId', async (req, res) => {
  try {
    const friend = await User.find({ _id: req.params.friendId });

    if ( !friend ) {
      res.status(404).json({ message: 'No friend found with that ID '});
    }

    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    );

    if (!user) {
      res.status(404).json({ message: 'No user found with that ID' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE to remove a friend from a user's friend list
router.delete('/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    );

    if (!user) {
      res.status(404).json({ message: 'No user found with that ID' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;