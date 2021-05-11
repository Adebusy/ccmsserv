const mongoose = require("mongoose");

const {validateUser, userModel} = require("./model/usermodel")
mongoose.connect("mongodb://localhost/ccmsdb")
    .then(()=> console.log('i am connected...'))
    .catch(err => console.error('could not connect',err));
//first create a schema
//compile schema into a model ,create the expected model in the collection model/userModel
//create object from model



//search records
async function getUser(){
    const user = await userModel.find({userName:"alaonrs"}).select({password: 1, homeAddress:1});//add .limit(10) to select top
    console.log(user);
    //to use greater than or less than
    //const user = await  User.find({userName:{$gt: 10}}).select({password: 1, homeAddress:1});//add .limit(10) to select top
    //geting values between records
    //const user = await  User.find({userName:{$gt: 10 , $lte: 20}}).select({password: 1, homeAddress:1});//add .limit(10) to select top
    //.find({userName: {$in:['alao','adegun','akanni']}})
}

async function updateUser(id){
    const getUser =await userModel.findById(id);
    if(!getUser) return;
    getUser.firstName= "testupdated";
    getUser.userName= "testupdate";
    const retUpdate = await getUser.save();
    console.log(retUpdate);
}
async function deleteUser(EmailRes){
    const delRec = await userModel.deleteOne({email:EmailRes});
    console.log(delRec);
}
//updateUser("603422d6efb3a320b5997ff5");
//deleteUser("alal@gmai");
//getUser();//d
//createUser();
