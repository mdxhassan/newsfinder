import React, { useState, useEffect } from 'react';

// Imports the API key from the .env file
const API_KEY = process.env.REACT_APP_API_KEY;

// Modal Component
// This component is used to display messages in a popup, such as when there are no search results or if there’s an error.
function Modal({ message, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <p className="text-center text-lg mb-4">{message}</p>
        <button
          onClick={onClose}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}

// Main Application Component
function App() {
  // State variables for managing search results, page view, and modal message
  const [news, setNews] = useState([]);
  const [isSearchPage, setIsSearchPage] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // State variables for search parameters
  const [query, setQuery] = useState('');
  const [searchIn, setSearchIn] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [language, setLanguage] = useState('');
  const [sortBy, setSortBy] = useState('');

  // Function to fetch news from the API
  const fetchNews = async () => {
    try {
      let url = `https://newsapi.org/v2/everything?apiKey=${API_KEY}`;
      if (query) url += `&q=${encodeURIComponent(query)}`;
      if (searchIn) url += `&searchIn=${searchIn}`;
      if (fromDate) url += `&from=${fromDate}`;
      if (toDate) url += `&to=${toDate}`;
      if (language) url += `&language=${language}`;
      if (sortBy) url += `&sortBy=${sortBy}`;

      const response = await fetch(url);
      const data = await response.json();

      // Checks if any articles are found by the API, if no articles are found then show modal with a message
      if (data.totalResults === 0) {
        setModalMessage("No articles found. Change parameters and try again.");
        setShowModal(true);
        setNews([]);
      } else if (data.articles) {
        setNews(data.articles);
        setIsSearchPage(false);
      }
    } catch (err) {
      setModalMessage("Error fetching news. Please try again later.");
      setShowModal(true);
      setNews([]);
    }
  };

  // Function to clear all search parameters - so its easier to type in new search conditions
  const clearParameters = () => {
    setQuery('');
    setSearchIn('');
    setFromDate('');
    setToDate('');
    setLanguage('');
    setSortBy('');
    setNews([]);
  };

  // Closes the notification modal
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">

      <h1 className="text-3xl font-bold text-center mb-2">News Finder</h1>
      
      <p className="text-center text-gray-700 mb-6 w-full max-w-lg">
        This is an app you can use to quickly collect news articles in multiple languages about a certain topic. 
        For example, if you want to know what Russians news is broadcasting about about Donald Trump, you can search for Donald Trump news articles in Russian. 
        
        <br></br> <br></br>It can be difficult to search for news in other languages without knowing the popular news sites in those regions. This app solves that problem.
      </p>

      {/* Modal displays if there's an error or no results */}
      {showModal && <Modal message={modalMessage} onClose={closeModal} />}

      {/* Display the search form or the results page based on isSearchPage state */}
      {isSearchPage ? (
        <div className="w-full max-w-md mx-auto bg-white p-6 rounded shadow-md">
          <div className="space-y-4">
            {/* Search fields for the parameters */}
            <label className="font-semibold">Keywords or Phrases</label>
            <input
              type="text"
              placeholder="Keywords or phrases to search for"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
            />

            <label className="font-semibold">Search In</label>
            <select
              value={searchIn}
              onChange={(e) => setSearchIn(e.target.value)}
              className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
            >
              <option value="">All Fields</option>
              <option value="title">Title</option>
              <option value="description">Description</option>
              <option value="content">Content</option>
            </select>

            <label className="font-semibold">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
            >
              <option value="">All Languages</option>
              <option value="ar">Arabic</option>
              <option value="de">German</option>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="he">Hebrew</option>
              <option value="it">Italian</option>
              <option value="nl">Dutch</option>
              <option value="no">Norwegian</option>
              <option value="pt">Portuguese</option>
              <option value="ru">Russian</option>
              <option value="sv">Swedish</option>
              <option value="ud">Urdu</option>
              <option value="zh">Chinese</option>
            </select>

            <label className="font-semibold">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
            >
              <option value="publishedAt">Published date</option>
              <option value="relevancy">Relevancy</option>
              <option value="popularity">Popularity</option>
            </select>

            <label className="font-semibold">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
            />

            <label className="font-semibold">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
            />

            <div className="flex space-x-4 mt-4">
              <button
                onClick={fetchNews}
                className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Search News
              </button>
              <button
                onClick={clearParameters}
                className="w-full p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Clear Parameters
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-3xl mx-auto">
          <button
            onClick={() => setIsSearchPage(true)}
            className="mb-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Search
          </button>

          {/* News results displayed in a grid */}
          <div className="grid gap-4">
            {news.map((article, index) => (
              <div key={index} className="p-4 mb-4 bg-white rounded shadow">
                <h2 className="font-bold">{article.title}</h2>
                <p className="text-sm text-gray-600 mb-2">{article.description}</p>
                <p className="text-sm text-gray-500">
                  Published on: {new Date(article.publishedAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  Source: {article.source.name} | Author: {article.author || 'Unknown'}
                </p>
                <a href={article.url} className="text-blue-500" target="_blank" rel="noopener noreferrer">Read more</a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
