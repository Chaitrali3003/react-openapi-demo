import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


function App() {
  const [tweet, setTweet] = useState("")
  const [sentiment,setSentiment] = useState("")
  const API_KEY = process.env.REACT_APP_HUGGINGFACE_API_KEY;
 

  const API_BODY = {
    "model" : "gpt-3.5-turbo",
    "prompt": "Classify the sentiment of this tweet? " + tweet,
    "temperature": 0,
    "max_tokens": 60,
    "top_p":1.0,
    "frequency_penalty": 0.0,
    "presence_penalty": 0.0
  }

async function callOpenAIApi() {
  const res = await fetch(
    "https://api-inference.huggingface.co/models/finiteautomata/bertweet-base-sentiment-analysis",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: tweet }),
    }
  );
  const json = await res.json();
  console.log(json);
  // Check if valid
if (Array.isArray(json) && json.length > 0) {
  // Sort the inner array by score (descending)
  const topSentiment = json[0].sort((a, b) => b.score - a.score)[0].label;

  // Set it in state
  setSentiment(topSentiment); // 'NEG' / 'POS' / 'NEU'
} else {
  setSentiment("Unknown");
}
  return json;
  setTweet("")
}

 console.log(tweet);

  return (
    <>
    <h1>Sentiment Analysis of Tweets</h1>
     <div>
      <textarea name="" id="" placeholder='Place your tweet here
      '
      cols={50}
      rows={10}
      onChange={(e)=>setTweet(e.target.value)}
      value={tweet}></textarea>
     </div>
     <div><button onClick={callOpenAIApi}>Get the tweet sentiment from OpenAI api</button></div>
     {sentiment}
     {sentiment != "" ? <> <h3>
    This sentiment is:{" "}
    {sentiment === "POS"
      ? "Positive 😊"
      : sentiment === "NEG"
      ? "Negative 😠"
      : sentiment === "NEU"
      ? "Neutral 😐"
      : sentiment}
  </h3></> : <></>}
    </>
  )
}

export default App
