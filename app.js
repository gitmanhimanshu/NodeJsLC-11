const express = require("express");
const app = express();
const path = require("path");
const usermodel = require("./models/usermodel.js");
app.listen(3000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.render("index");
});
app.post("/create", async (req, res) => {
  const { username, email, image } = req.body;
  const user = await usermodel.create({
    username,
    email,
    image,
  });
  res.send(user);
});
app.get("/getAll",async (req,res)=>{
  const users=await usermodel.find()
  res.render('data',{users})
})
app.get("/delete/:username",async (req,res)=>{
  const user=await usermodel.findOneAndDelete({username:req.params.username})
res.redirect('/getAll')
})
 // Adjust the path as per your project structure

app.get('/edit/:username', async (req, res) => {
  try {
    const user = await usermodel.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.render('editpage', { user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
app.post('/update',async (req,res)=>{
  const {username,email,image}=req.body;
  const user = await usermodel.findOneAndUpdate(
    { username: username }, // Filter criteria
    { email: email, image: image }, // Update fields
    { new: true, runValidators: true } // Options
  );
res.redirect("/getAll")
})
