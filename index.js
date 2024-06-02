//creating a rest api
const express=require("express");
const fs = require("fs");
const users=require("./MOCK_DATA.json");


const app=express();
const PORT=8000;

// Middleware to parse JSON bodies
app.use(express.urlencoded({extended: false}));


//ROUTES
app.get("/users", (req, res) => {
    const html = `
    <ul>
        ${users.map((user) => `<li>${user.first_name}</li>`).join('')}
    </ul>
    `;
    res.send(html);
});

//REST API
app.get("/api/users", (req, res) => {
    return res.json(users);
});

//REST API WITH USER ID
app.route("/api/users/:id").get((req, res)=>{//.get
    const id = Number(req.params.id);
    const user = users.find((user)=>user.id===id);
    return res.json(user);
})
.patch((req, res)=>{//.patch
    //TODO:  EDIT user with id
    return res.json({status: "pending"});
})
.delete((req, res)=>{//delete
    //TODO:  DELETE user with id
    return res.json({status: "pending"});
})
.post((req, res)=>{//.post
    //TODO Create new user
    return res.json({status: "pending"});
})
// app.get("/api/users/:id", (req, res)=>{
//     const id = Number(req.params.id);
//     const user = users.find((user)=>user.id===id);
//     return res.json(user);
// })


app.post("/api/users", (req, res)=>{
    //TODO Create new user
    const body = req.body;
    users.push({...body, id: users.length});
    fs.writeFile("MOCK_DATA.json", JSON.stringify(users), (err, data)=>{
        return res.json({status: "success", id: users.length});
    })
    
})

app.patch("/api/users", (req, res)=>{
    //TODO: Edit the user
    return res.json({status: "pending"});
})

app.put("/api/users", (req, res)=>{
    //TODO: Edit the user
    return res.json({status: "pending"});
})

app.listen(PORT, ()=> console.log(`Servrer started at PORT: ${PORT}`));