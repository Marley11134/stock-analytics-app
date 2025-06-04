import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [input, setInput] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input) return;
    router.push(`/company/${input.toUpperCase()}`);
  };

  return (
    <div className="container">
      <h1>Stock Analytics App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter ticker symbol (e.g., AAPL)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
}

