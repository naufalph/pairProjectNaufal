const express = require("express");
const app = express();
const route = require("./routes/index.js");
const session =require("express-session");

app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(
  session({
    secret: "Kurita",
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: false ,
      sameSite: true
      },
  })
);

app.use(route);

app.listen(3000,()=>{
  console.log(`horrorstory listening on port 3000`);
})