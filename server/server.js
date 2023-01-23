import express from 'express'; // https://www.npmjs.com/package/express
import * as dotenv from 'dotenv'; // https://www.npmjs.com/package/dotenv
import cors from 'cors'; // https://www.npmjs.com/package/cors
import { Configuration, OpenAIApi } from 'openai'; // https://www.npmjs.com/package/openai

dotenv.config() // https://www.npmjs.com/package/dotenv
const configuration = new Configuration({ 
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration); // https://www.npmjs.com/package/openai

const app = express() 
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => { 
  res.status(200).send({ 
    message: 'Hello from RsX!'
  })
});

app.post('/', async (req, res) => {  
  try {
    const prompt = req.body.prompt; 

    const response = await openai.createCompletion({ 
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0, // Number between 0 and 1. 0 is the least creative. 1 is the most creative.
      max_tokens: 3000, // The maximum number of tokens to generate.
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.5, 
      presence_penalty: 0, 
    });

    res.status(200).send({ 
      bot: response.data.choices[0].text 
    });

  } catch (error) { 
    console.error(error) 
    res.status(500).send(error || 'Something went wrong'); 
  }
}) 

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))  // http://localhost:5000