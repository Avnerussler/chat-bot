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
const chatCollection = db.collection('chat');
const responseCollection = db.collection('response');

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

app.get('/getAllMessages', async (req, res) => {
  const result = await chatCollection.find().toArray();
  res.send(result);
});

app.get('/getResponse/:id', async (req, res) => {
  const { id } = req.params;
  const result = await chatCollection
    .aggregate([
      { $match: { _id: ObjectId(id) } },
      {
        $lookup: {
          from: 'response',
          localField: 'response',
          foreignField: '_id',
          as: 'response',
        },
      },
    ])
    .toArray();
  res.send(result);
});

const sandResponse = async (replayToMessage, replayText, socket) => {
  const newResponse = await responseCollection.insertOne({
    replayToMessage: ObjectId(replayToMessage),
    replayText,
    rate: 0,
  });

  const updateChat = await chatCollection.findOneAndUpdate(
    { _id: ObjectId(replayToMessage) },
    { $push: { response: newResponse.insertedId } }
  );

  io.emit('response', {
    replayToMessage,
    replayText,
    socketId: socket.id,
    response: updateChat.value.response,
    _id: newResponse.insertedId,
  });

  const updateOfResponse = updateChat.value.response;
  updateOfResponse.push(newResponse.insertedId);
  io.emit('update-messages', {
    messageToUpdate: replayToMessage,
    response: updateOfResponse,
  });
};

io.on('connection', socket => {
  console.log('new connection', socket.id);

  // Handle input events
  socket.on('input', async messageData => {
    const { message, name, replayToMessage, replayText } = messageData;

    // Insert message
    if (replayToMessage) {
      sandResponse(replayToMessage, replayText, socket);
    } else {
      // Check for the message
      if (message === '') {
        // sendStatus('Please enter a message');
        return;
      }

      chatCollection.insertOne({ name: name, message, response: [] }).then(async res => {
        // Creating Index type text for text search in message field
        await chatCollection.createIndex({ message: 'text' });

        const findSimilarQA = await chatCollection
          .aggregate([
            //Find a question that match the current question
            { $match: { $text: { $search: message } } },

            //Get the response from the response collection
            {
              $lookup: {
                from: 'response',
                localField: 'response',
                foreignField: '_id',
                as: 'result',
              },
            },

            //Take only "result" and "message" fields
            {
              $project: {
                result: 1,
                message: 1,
              },
            },

            // Get the max "rate" document from the result array (array of response)
            {
              $addFields: {
                maxRate: {
                  $reduce: {
                    input: '$result',
                    initialValue: { rate: 0 },
                    in: { $cond: [{ $gte: ['$$this.rate', '$$value.rate'] }, '$$this', '$$value'] },
                  },
                },
              },
            },

            // Take only the "maxRate" and "message" fields
            {
              $project: {
                maxRate: 1,
                message: 1,
              },
            },

            // Sort and take only the max document
            { $sort: { 'maxRate.rate': -1 } },
            { $limit: 1 },
          ])
          .toArray();

        if (findSimilarQA[0].maxRate.rate > 0) {
          const { replayText } = findSimilarQA[0].maxRate;
          console.log(findSimilarQA);
          sandResponse(res.insertedId, replayText, socket);
        }

        io.emit('output', { message, name, _id: res.insertedId, socketId: socket.id });
      });
    }
  });

  socket.on('rate-input', async data => {
    const responseUpdate = await responseCollection.findOneAndUpdate(
      { _id: ObjectId(data.responseId) },
      { $inc: { rate: 1 } }
    );

    responseUpdate.value['rate'] = responseUpdate.value['rate'] + 1;

    io.emit('rate-output', responseUpdate.value);
  });
});
