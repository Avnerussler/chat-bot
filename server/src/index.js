import express from 'express';
import httpServer from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';

const app = express();

app.use(cors());
const http = httpServer.createServer(app);

http.listen(3000, () => {
  console.log('listening on *:3000');
});

const uri =
  'mongodb+srv://admin:8FOGvaJZ7IALArTu@cluster0.mvlvllf.mongodb.net/?retryWrites=true&w=majority';
const mongodb = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

await mongodb
  .connect()
  .then(() => {
    console.log('Connected successfully to mongoDb');
  })
  .catch(err => console.error(err));

const db = mongodb.db('chat-bot');
const collection = db.collection('chat');

const io = new Server(http, {
  cors: {
    origin: 'http://localhost:8000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

io.on('connection', socket => {
  console.log('new connection', socket.id);

  // Create function to send status
  const sendStatus = s => {
    socket.emit('status', s);
  };
  // Handle input events
  socket.on('input', messageData => {
    const { message, name, replayToMessage, replayText } = messageData;

    // Insert message
    if (replayToMessage) {
      collection
        .findOneAndUpdate({ _id: ObjectId(replayToMessage) }, { $push: { response: replayText } })
        .then(res => {
          io.emit('response', {
            replayToMessage,
            replayText,
            socketId: socket.id,
            response: res.value.response,
          });

          // Send status object
          sendStatus({
            message: 'Response sent',
            clear: true,
          });
        });
    } else {
      // Check for the message
      if (message === '') {
        sendStatus('Please enter a message');
      }

      collection.insertOne({ name: name, message, response: [] }).then(res => {
        io.emit('output', { message, name, id: res.insertedId, socketId: socket.id });
        // Send status object
        sendStatus({
          message: 'Message sent',
          clear: true,
        });
      });
    }
  });

  // io.emit('new connection', 'new connection');
});
