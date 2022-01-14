const express = require('express');
const cors = require('cors');
const { v4: uuid } = require('uuid');
const app = express()
app.use(cors())
app.use(express.json())

const users = []

function verifyUserID(request, response, next) {
    const { id } = request.params;

    const checkUserByID = users.find((user) => user.id === id)
    if (checkUserByID) {
        return response.status(404).json({ error: 'error [ verifyUserID ]' })
    }

    request.user = checkUserByID
    return next()
}

app.post("/users", (request, response) => {
    const { username, name } = request.body;
    const { id } = request.params;

    const checkUserByID = users.find((user) => user.id === id)
    if (checkUserByID) {
        return response.status(404).json({ error: 'error' })
    }

    const veryfiExistsUsername = users.find((user) => user.username === username)

    if (veryfiExistsUsername) {
        return response.status(404).json({ error: 'username already exists' })
    }

    const user = {
        id: uuid(),
        username,
        name,
        todos: []
    }
    users.push(user)

    return response.status(201).send()
})

app.get("/users", (request, response) => {
    const verifyExistsUserInArray = users.find((user) => user.length < 0)

    if (verifyExistsUserInArray) {
        return response.status(400).json({ error: 'error' })
    }

    return response.status(201).json(users)
})
app.get("/users/:id", (request, response) => {
    const { id } = request.params;
    const [user] = users;
    const checkUserID = users.some((user) => user.id === id)

    if (!checkUserID) {
        return response.status(404).json({ error: 'erro' })
    }

    return response.status(200).json(user)
})

app.post("/todos/:id", verifyUserID, (request, response) => {
    const { user } = users;

    const createTodo = {
        id: uuid(),
        todos: []
    }
    user.push(createTodo)
    return response.status(201).json(user)
})
app.delete("/delete/:id", (request, response) => {

    const { id } = request.params;

    const checkUserID = users.some((user) => user.id === id)

    if (!checkUserID) {
        return response.status(404).json({ error: 'erro' })
    }

    const verifyID = users.findIndex((user) => user.id === id)

    if (verifyID === -1) {
        return response.status(404).json({ error: 'error' })
    }

    users.splice(verifyID, 1)
    return response.json({ user: 'deletado' })

})
app.listen(3000, () => {
    console.log('ok');
})