// pages/index.tsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDebounce } from 'use-debounce';

type SearchResult = {
  objectID: string;
  title: string;
  url: string;
};

const Home = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // Debounce for 500ms

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchResults(debouncedSearchTerm);
    } else {
      setResults([]);
    }
  }, [debouncedSearchTerm]);

  const fetchResults = async (term: string) => {
    try {
      const response = await axios.get(`https://hn.algolia.com/api/v1/search?query=${term}`);
      setResults(response.data.hits);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <h1>Hacker News Search</h1>
      <input
        type="text"
        placeholder="Search Hacker News"
        value={searchTerm}
        onChange={handleInputChange}
      />
      <ul>
        {results.map((item) => (
          <li key={item.objectID}>
            <a href={item.url} target="_blank" rel="noopener noreferrer">{item.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
