import PostModel from "../Models/PostModel.js";
import UserModel from "../Models/userModel.js";
import mongoose from "mongoose";

// create new post

export const createPost = async (req, res) => {
  const newPost = new PostModel(req.body);

  try {
    await newPost.save();
    res.status(200).json("Post Created");
  } catch (error) {
    res.status(500).json(error);
  }
};

// get a post

export const getPost = async (req, res) => {
  const id = req.params.id;

  try {
    const post = await PostModel.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
};

// updaate a post

export const updatePost = async (req, res) => {
  const id = req.params.id; // id url id of post we want to update
  const { userId } = req.body; // id of user who want to update

  try {
    const post = await PostModel.findById(id);
    // console.log(post.userId)
    if (post.userId === userId) {
      // console.log(userId,desc)
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post Updated");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// delete a post

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;
  try {
    const post = await PostModel.findById(id);
    if (post.userId === userId) {
      await post.deleteOne();
      res.status(200).json("Post deleted successfully");
    } else res.status(403).json("forbidden");
  } catch (error) {
    res.status(500).json(error);
  }
};

// like and dislike a post
export const likePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;
  try {
    const post = await PostModel.findById(id);
    if (!post.likes.includes(userId)) {
      await post.updateOne({ $push: { likes: userId } });
      res.status(200).json("Post Liked");
    } else {
      await post.updateOne({ $pull: { likes: userId } });
      res.status(200).json("Post unLiked");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// get Timeline post

export const getTimelinePost = async (req, res) => {
  const userId = req.params.id;

  try {
    const currentUserPosts = await PostModel.find({ userId: userId });
    const followingPosts = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $lookup: {
            from : "posts",
            localField : "following",
            foreignField : "userId",
            as : "followingPosts"
        }
    }, 
        {
            $project :{
                followingPosts : 1,
                _id : 0
            }
        }
    ]);
    res.status(200).json([...currentUserPosts, ...followingPosts[0].followingPosts].sort((a,b)=>{
        return b.createdAt-a.createdAt; 
    }));
  } catch (error) {
    res.status(500).json(error);
  }
};
