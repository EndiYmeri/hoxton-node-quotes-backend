import Database from 'better-sqlite3'

const db = new Database('./data.db', {
  verbose: console.log
})

type Quote={
    id: number,
    quote: string,
    authorId:number,
}

type Author = {
    id: number
    firstName: string,
    lastName: string,
    age: number
    image:string
}

const quotes: Quote[] = [
    {id: 1, quote: "A person grows up when he’s able to overcome hardships. Protection is important, but there are some things that a person must learn on his own.”", authorId: 1},
    {id: 2, quote: "Rejection is a part of any man’s life. If you can’t accept and move past rejection, or at least use it as writing material – you’re not a real man.", authorId: 1},
    {id: 3, quote: "A place where someone still thinks about you is a place you can call home.", authorId: 1},
    {id: 4, quote: "When people get hurt, they learn to hate… When people hurt others, they become hated and racked with guilt. But knowing that pain allows people to be kind. Pain allows people to grow… and how you grow is up to you.", authorId: 1},
    {id: 5, quote: "It’s not the face that makes someone a monster, it’s the choices they make with their lives.", authorId: 2},
    {id: 6, quote: "Fear. That is what we live with. And we live with it every day. Only in death are we free of it.", authorId: 4},
    {id: 7, quote: "Power is not will, it is the phenomenon of physically making things happen.", authorId: 3},
]

const authors: Author[]  = [
    {id: 1, firstName:"Jiraya", lastName: "", age: 50, image: "https://cdna.artstation.com/p/assets/images/images/011/283/900/large/marc-lehmann-20180612-grumpyoldguy-web.jpg?1528798728"},
    {id: 2, firstName:"Naruto", lastName: "Uzumaki", age: 50, image: "https://cdna.artstation.com/p/assets/images/images/011/283/900/large/marc-lehmann-20180612-grumpyoldguy-web.jpg?1528798728"},
    {id: 3, firstName:"Madara", lastName: "Uchiha", age: 50, image: "https://cdna.artstation.com/p/assets/images/images/011/283/900/large/marc-lehmann-20180612-grumpyoldguy-web.jpg?1528798728"},
    {id: 4, firstName:"Neji", lastName: "Hyuga", age: 50, image: "https://cdna.artstation.com/p/assets/images/images/011/283/900/large/marc-lehmann-20180612-grumpyoldguy-web.jpg?1528798728"},
]


const createQuotes = db.prepare(`
    CREATE TABLE IF NOT EXISTS quotes(
        id INTEGER PRIMARY KEY,
        quote TEXT,
        authorId INTEGER
    );
`)
const createAuthors = db.prepare(`
    CREATE TABLE IF NOT EXISTS authors(
        id INTEGER PRIMARY KEY,
        firstName TEXT,
        lastName TEXT,
        age INTEGER,
        image TEXT
    );
`)

createQuotes.run()
createAuthors.run()

const deleteQuotes = db.prepare(`
    DELETE FROM quotes;
`)
const deleteAuthors = db.prepare(`
    DELETE FROM authors;
`)

deleteQuotes.run()
deleteAuthors.run()


const createQuote = db.prepare(`
INSERT INTO quotes(quote, authorId) VALUES(?, ?);
`)

const createAuthor = db.prepare(`
INSERT INTO authors(firstName, lastName, age, image) VALUES(?, ?, ?, ?);
`)


for(const quote of quotes){
    createQuote.run(quote.quote, quote.authorId)
}
for(const author of authors){
    createAuthor.run(author.firstName, author.lastName, author.age, author.image)
}

