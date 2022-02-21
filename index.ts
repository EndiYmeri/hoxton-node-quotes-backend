import express, { json } from 'express'
import cors from 'cors'

import Database from 'better-sqlite3'

const db = new Database('./data.db', {
  verbose: console.log
})

const app = express()

app.use(cors())
app.use(express.json())
const PORT = 5000



app.get('/', (req, res)=>{
res.send(`
    <h1>QUOTES API</h1>
    <p>If wanna see all quotes please click this link <a href="/quotes">all quotes</a>
    <p>If wanna see all authors please click this link <a href="/authors">all authors</a>
    <p>If wanna see a random quote please click this link <a href="/random-quote">random quote</a>
    `)
})

// app.get('/quotes', (req, res)=>{
//     res.send(quotes)
// })

// Quotes Stuff

const getQuotes = db.prepare(`SELECT * FROM quotes;`)
const getQuoteWithID = db.prepare(`SELECT * FROM quotes WHERE id=?;`)
const getQuotewithSearch = db.prepare(`SELECT * FROM quotes WHERE quote LIKE ?;`)
const createQuote = db.prepare('INSERT INTO quotes (quote, authorId) VALUES(?,?)')
const deleteQuoteWithID = db.prepare('DELETE FROM quotes WHERE id=?')



app.get('/random-quote', (req,res)=>{
    // const randomIndex = Math.floor(Math.random()* getQuotes.all().length)
    // const randomQuote = getQuoteWithID.get(randomIndex+1)
    // res.send(randomQuote)
})

app.get('/quotes', (req, res) => {
    const searchParam = req.query.search
    console.log(searchParam)
    if(searchParam){
        const quotesWithSearchParam = getQuotewithSearch.all(`%${searchParam}%`)
        res.send(quotesWithSearchParam)
    }else{
        const quotes = getQuotes.all()
        res.send(quotes)
    }
})

app.get('/quotes/:id', (req,res)=>{
    const id = Number(req.params.id)
    const quote = getQuoteWithID.get(id)
    console.log(quote)
    if(quote){
            res.send(quote)
    }
    else{
        res.status(404).send({error: "No matching quote id found"})
    }
})

app.post('/quotes', (req, res)=>{
    const quote = req.body.quote
    const authorId = req.body.authorId
    const result = createQuote.run(quote, authorId)
    const newQuote = getQuoteWithID.get(result.lastInsertRowid)
    res.send(newQuote)
})


app.delete('/quotes/:id', (req, res)=>{
    const id = req.params.id
    const result = deleteQuoteWithID.run(id)
    console.log(result)
    if(result.changes !== 0){
        res.send({message: "Quote deleted succesfully"})
    }else{
        res.status(404).send({error: "Quote does not exist"})
    }
})

// Authors Sutff

const getAuthors = db.prepare(`SELECT * FROM authors;`)
const getAuthorWithID = db.prepare(`SELECT * FROM authors WHERE id=?;`)
const getAuthorwithSearch = db.prepare(`SELECT * FROM authors WHERE firstName LIKE ?;`)
const createAuthor = db.prepare('INSERT INTO authors (firstName,lastName, age, image) VALUES(?,?,?,?)')
const deleteAuthorWithID = db.prepare('DELETE FROM authors WHERE id=?')

app.get('/authors', (req, res)=>{
    const searchParam = req.query.search
    console.log(searchParam)
    if(searchParam){
        const authorWithSearchParam = getAuthorwithSearch.all(`%${searchParam}%`)
        res.send(authorWithSearchParam)
    }else{
        const authors = getAuthors.all()
        res.send(authors)
    }
})

app.get('/authors/:id', (req, res)=>{
    const id = Number(req.params.id)
    const author = getAuthorWithID.get(id)
    if(author){
        res.send(author)
    }
    else{
        res.status(404).send({error: "No matching author id found"})
    }
})

app.post('/authors', (req, res)=>{
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const age = req.body.age
    const image = req.body.image

    const result = createAuthor.run(firstName, lastName, age, image)
    const newAuthor = getAuthorWithID.get(result.lastInsertRowid)     
    res.send(newAuthor)
})

app.delete('/authors/:id', (req, res)=>{
    const id = Number(req.params.id)
    const result = deleteAuthorWithID.run(id)

    if(result.changes !== 0){
        res.send({message: "Author deleted succesfully"})
    }else{
        res.status(404).send({error: "Author does not exist"})
    }
})


app.listen(PORT, ()=>{
    console.log(`Server up on port: http://localhost:${PORT}`,)
})