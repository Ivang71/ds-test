<template>
    <div>
      <label for="urlInput">URL:</label>
      <input v-model="urlInput" id="urlInput" type="text" placeholder="Enter URL" />
      <button @click="getData">Get</button>
  
      <div v-if="cssFiles.length || jsFiles.length">
        <div v-if="cssFiles.length">
          <h2>CSS Files:</h2>
          <ul>
            <li v-for="(cssFile, index) in cssFiles" :key="index">
              <a :href="cssFile.url" target="_blank">{{ cssFile.name }}</a>
            </li>
          </ul>
        </div>
  
        <div v-if="jsFiles.length">
          <h2>JS Files:</h2>
          <ul>
            <li v-for="(jsFile, index) in jsFiles" :key="index">
              <a :href="jsFile.url" target="_blank">{{ jsFile.name }}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        urlInput: '',
        cssFiles: [],
        jsFiles: [],
      };
    },
    methods: {
      async getData() {
        try {
          const response = await fetch(`http://localhost:19827/?url=${this.urlInput}`);
          const data = await response.json();
  
          // Extract file names for CSS files
          this.cssFiles = (data.cssFiles || []).map(url => ({ name: this.extractFileName(url), url }));
  
          // Extract file names for JS files
          this.jsFiles = (data.jsFiles || []).map(url => ({ name: this.extractFileName(url), url }));
        } catch (error) {
          console.error('Error fetching data:', error.message);
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
  