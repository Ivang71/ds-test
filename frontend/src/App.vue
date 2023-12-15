<template>
    <div>
      <h1>URL Fetcher</h1>
      <label for="urlInput">Enter URL:</label>
      <input v-model="urlInput" type="text" id="urlInput">
      <button @click="fetchUrls">Get</button>
      
      <div v-if="interceptedUrls.length > 0">
        <h2>Intercepted URLs:</h2>
        <ul>
          <li v-for="fileInfo in interceptedUrls" :key="fileInfo.url">
            <a :href="fileInfo.url" target="_blank">{{ fileInfo.name }}</a>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        urlInput: '',
        interceptedUrls: [],
      };
    },
    methods: {
      async fetchUrls() {
        try {
          // Make a request to localhost with the URL as a query parameter
          const response = await fetch(`http://localhost:19827/?url=${encodeURIComponent(this.urlInput)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
  
          // Parse the response JSON
          const data = await response.json();
  
          // Process URLs and store in interceptedUrls
          this.interceptedUrls = data.interceptedUrls.map(url => ({
            name: this.extractFileName(url),
            url: url,
          }));
        } catch (error) {
          console.error('Error fetching URLs:', error);
        }
      },
      extractFileName(url) {
        // Extract the file name from the URL
        const parts = url.split('/');
        return parts[parts.length - 1];
      },
    },
  };
  </script>
  
  <style>
  /* Add your styles here if needed */
  </style>
  