const express = require("express");
const fs = require("fs");
const users = require("./MOCK_DATA.json");

const app = express();
const PORT = 8000;

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Custom middleware
app.use((req, res, next) => {
    fs.appendFile("log.txt", `\n${Date.now()}: ${req.method}: ${req.path}`, (err) => {
        if (err) {
            console.error("Failed to write log", err);
        }
        next();
    });
});

app.use((req, res, next) => {
    console.log("Hello from middleware 2");
    res.end("Hello");
    // Note: Do not call next() after res.end()
});

// Routes
app.get("/users", (req, res) => {
    const html = `
    <ul>
        ${users.map((user) => `<li>${user.first_name}</li>`).join('')}
    </ul>
    `;
    res.send(html);
});

// REST API
////////////////GET////////////////
app.get("/api/users", (req, res) => {
    return res.json(users);
});

//////////////////POST////////////////////
app.post("/api/users", (req, res) => {
    const body = req.body;
    users.push({ ...body, id: users.length });
    fs.writeFile("MOCK_DATA.json", JSON.stringify(users), (err) => {
        if (err) {
            return res.status(500).json({ status: "error", message: "Failed to write data" });
        }
        return res.json({ status: "success", id: users.length });
    });
});

app.patch("/api/users/:id", (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const updates = req.body;

    let userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        fs.writeFile("MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ status: "error", message: "Failed to write data" });
            }
            return res.json(users[userIndex]);
        });
    } else {
        res.status(404).json({ status: "error", message: "User not found" });
    }
});

app.put("/api/users/:id", (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const updatedUser = req.body;

    let userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        users[userIndex] = { ...updatedUser, id: userId }; // Ensure the ID remains the same
        fs.writeFile("MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ status: "error", message: "Failed to write data" });
            }
            return res.json(users[userIndex]);
        });
    } else {
        res.status(404).json({ status: "error", message: "User not found" });
    }
});

/////////////////////
// REST API WITH USER ID
app.route("/api/users/:id")
    .get((req, res) => {
        const id = Number(req.params.id);
        const user = users.find(user => user.id === id);
        if (user) {
            return res.json(user);
        } else {
            return res.status(404).json({ status: "error", message: "User not found" });
        }
    })
    .patch((req, res) => {
        const userId = parseInt(req.params.id, 10);
        const updates = req.body;

        let userIndex = users.findIndex(user => user.id === userId);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updates };
            fs.writeFile("MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
                if (err) {
                    return res.status(500).json({ status: "error", message: "Failed to write data" });
                }
                return res.json(users[userIndex]);
            });
        } else {
            res.status(404).json({ status: "error", message: "User not found" });
        }
    })
    .delete((req, res) => {
        const userId = parseInt(req.params.id, 10);
        const userIndex = users.findIndex(user => user.id === userId);

        if (userIndex !== -1) {
            users.splice(userIndex, 1);
            fs.writeFile("MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
                if (err) {
                    return res.status(500).json({ status: "error", message: "Failed to write data" });
                }
                return res.json({ status: "success", message: "User deleted" });
            });
        } else {
            res.status(404).json({ status: "error", message: "User not found" });
        }
    })
    .post((req, res) => {
        return res.status(405).json({ status: "error", message: "Method not allowed" });
    });

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));

// //creating a rest api
// const express=require("express");
// const fs = require("fs");
// const users=require("./MOCK_DATA.json");

// const app=express();
// const PORT=8000;

// // Middleware to parse JSON bodies
// app.use(express.json());
// app.use(express.urlencoded({extended: false}));

// //custom made middleware
// app.use((req, res, next)=>{
//     fs.appendFile("log.txt", 
//     `\n${Date.now()}: ${req.method}: ${req.path}`, (err, data)=>{
//         next();
//     });
//     // console.log("Hello from middleware 1");
//     // return res.json({msg: "Hello from middleware 1"});
//     // next();
// })

// app.use((req, res, next)=>{
//     console.log("Hello from middleware 2");
//     res.end("Hello");
//     // next();
// });



// //ROUTES
// app.get("/users", (req, res) => {
//     const html = `
//     <ul>
//         ${users.map((user) => `<li>${user.first_name}</li>`).join('')}
//     </ul>
//     `;
//     res.send(html);
// });

// //REST API

// ////////////////GET////////////////
// app.get("/api/users", (req, res) => {
//     return res.json(users);
// });

// //////////////////POST////////////////////
// app.post("/api/users", (req, res)=>{
//     //TODO Create new user
//     const body = req.body;
//     users.push({...body, id: users.length});
//     fs.writeFile("MOCK_DATA.json", JSON.stringify(users), (err, data)=>{
//         return res.json({status: "success", id: users.length});
//     })
    
// })

// app.patch("/api/users/:id", (req, res)=>{
//     //TODO: Edit the user
//     const userId=parseInt(req.params.id, 10);
//     const updates= req.body;

//     let userIndex = users.findIndex(user => user.id === userId);
//     if (userIndex !== -1) {
//         users[userIndex] = { ...users[userIndex], ...updates };
//         fs.writeFile("MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
//             if (err) {
//                 return res.status(500).json({ status: "error", message: "Failed to write data" });
//             }
//             return res.json(users[userIndex]);
//         });
//     } else {
//         res.status(404).json({ status: "error", message: "User not found" });
//     }
// });

// app.put("/api/users/:id", (req, res)=>{
//     //TODO: completely update the user
//     const userId = parseInt(req.params.id, 10);
//     const updatedUser = req.body;

//     let userIndex = users.findIndex(user => user.id === userId);
//     if (userIndex !== -1) {
//         users[userIndex] = { ...updatedUser, id: userId }; // Ensure the ID remains the same
//         fs.writeFile("MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
//             if (err) {
//                 return res.status(500).json({ status: "error", message: "Failed to write data" });
//             }
//             return res.json(users[userIndex]);
//         });
//     } else {
//         res.status(404).json({ status: "error", message: "User not found" });
//     }
// });























// /////////////////////
// //REST API WITH USER ID

// app.route("/api/users/:id").get((req, res)=>{//.get
//     const id = Number(req.params.id);
//     const user = users.find((user)=>user.id===id);
//     return res.json(user);
// })
// .patch((req, res)=>{//.patch
//     //TODO:  EDIT user with id
//     return res.json({status: "pending"});
// })
// .delete((req, res)=>{//delete
//     //TODO:  DELETE user with id
//     return res.json({status: "pending"});
// })
// .post((req, res)=>{//.post
//     //TODO Create new user
//     return res.json({status: "pending"});
// })
// // app.get("/api/users/:id", (req, res)=>{
// //     const id = Number(req.params.id);
// //     const user = users.find((user)=>user.id===id);
// //     return res.json(user);
// // })



// app.listen(PORT, ()=> console.log(`Servrer started at PORT: ${PORT}`));