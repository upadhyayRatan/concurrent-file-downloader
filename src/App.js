import React, { useState } from 'react';
import './App.css'
import axios from 'axios';

function App() {
  const [urlList, setUrlList] = useState('');
  const [message, setMessage] = useState('');

  const handleDownload = async () => {
    try {
      const response = await axios.post('http://localhost:3000/download', { urls: urlList.split('\n') });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(`Error: ${error.response.data.error}`);
    }
  };

  return (
    <div className="App">
      <h1>File Downloader</h1>
      <textarea
        placeholder="Enter file URLs, one per line"
        value={urlList}
        onChange={(event) => setUrlList(event.target.value)}
      />
      <br />
      <button onClick={handleDownload}>Download</button>
      <br />
      <p>{message}</p>
    </div>
  );
}

export default App;
