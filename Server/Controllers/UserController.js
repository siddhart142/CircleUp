import UserModel from "../Models/userModel.js";
import bcrypt from 'bcrypt'

// get a User

export const getUser = async (req, res) => {
  const id = req.params.id; //fetching id from url paarmeter

  try {
    const user = await UserModel.findById(id);
    if (user) {
      const { password, ...otherDetails } = user._doc;
      res.status(200).json(otherDetails);
    } else {
      res.status(404).json("No such user exists");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserId, currentUserAdminStatus, password } = req.body;

  if (id === currentUserId || currentUserAdminStatus) {
    try {
        if(password)
        {
            const salt= await bcrypt.genSalt(10);
            req.body.password=await bcrypt.hash(password,salt)
        }
      const user = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json("nahi mila");
    }
  }
  else{
    res.status(403).json("Access denied")
  }
};


// delete user

export const deleteUser= async(req,res) => {
    const id=req.params.id
    const  { currentUserId, currentUserAdminStatus} = req.body;
    if (id === currentUserId || currentUserAdminStatus) {
        try{
            await UserModel.findByIdAndDelete(id)
            res.status(200).json("deleted")
        }
        catch(error)
        {
            res.status(403).json("error aarha")
        }
    }
    else{
        res.status(403).json("Access denied")
      }

};

//follow

export const followUser=async(req,res)=>{
  const id=req.params.id

  const {currentUserId}=req.body

  if(currentUserId===id)
  {
    res.status(403).json("Action forbidden")
  }
  else{
    try{
      const followUser=await UserModel.findById(id)
      const followingUser= await UserModel.findById(currentUserId)

      if(!followUser.followers.includes(currentUserId))
      {
        await followUser.updateOne({$push : {followers: currentUserId}})
        await followingUser.updateOne({$push : {following:id}})
        res.status(200).json("User Followed")

      }
      else{
        res.status(403).json("User is Already followed by you")
      }
    }
    catch(error)
        {
            res.status(403).json("error aarha")
        }
  }


}



// unfollow
export const UnfollowUser=async(req,res)=>{
  const id=req.params.id

  const {currentUserId}=req.body
  console.log(id,currentUserId)
  if(currentUserId===id)
  {
    res.status(403).json("Action forbidden")
  }
  else{
    try{
      const followUser=await UserModel.findById(id)
      const followingUser= await UserModel.findById(currentUserId)

      if(followUser.followers.includes(currentUserId))
      {
        await followUser.updateOne({$pull : {followers: currentUserId}})
        await followingUser.updateOne({$pull : {following:id}})
        res.status(200).json("Userun Followed")

      }
      else{
        res.status(403).json("User is not followed by you")
      }
    }
    catch(error)
        {
            res.status(403).json("error aarha")
        }
  }


}
