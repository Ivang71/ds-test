<script>
const BACKEND_ADDRESS = 'http://localhost:19827'

export default {
    data() {
        return {
            urlInput: '',
            cssFiles: [],
            jsFiles: [],
            isFetching: false,
            serverStatus: '',
        }
    },
    methods: {
        validateAndFormatUrl(url) {
            if (!url.includes('.')) return null
            try {
                const validatedUrl = new URL(url)
                return url
            } catch (error) {
                // If an error occurs, the URL is invalid, try to prepend 'https://' and validate again
                try {
                    const withHttps = `https://${url}`
                    const validatedWithHttps = new URL(withHttps)
                    return withHttps
                } catch (secondError) {
                    // If adding 'https://' doesn't make it valid, return null
                    return null
                }
            }
        },
        async getData() {
            if (this.isFetching) return
            const formattedUrl = this.validateAndFormatUrl(this.urlInput)
            if (!formattedUrl) {
                alert('Please provide a valid url')
                return
            }

            try {
                this.cssFiles = []
                this.jsFiles = []
                this.isFetching = true
                const response = await fetch(`${BACKEND_ADDRESS}/?url=${formattedUrl}`)
                const data = await response.json()

                const extractFileName = (url) => {
                    const parts = url.split('/')
                    return parts[parts.length - 1]
                }

                this.cssFiles = (data.cssFiles || []).map(url => ({ name: extractFileName(url), url }))
                this.jsFiles = (data.jsFiles || []).map(url => ({ name: extractFileName(url), url }))
            } catch (error) {
                console.error('Error fetching data:', error.message)
            } finally {
                this.isFetching = false
            }
        },
        fillInputWithLink(link) {
            this.urlInput = link
        },
        async checkServerStatus() {
            try {
                const response = await fetch(`${BACKEND_ADDRESS}/ping`)
                if (response.status === 200) {
                    this.serverStatus = 'reachable'
                } else {
                    this.serverStatus = 'unreachable'
                }
            } catch (error) {
                this.serverStatus = 'unreachable'
            }
        },
    },
    mounted() {
        this.checkServerStatus()
    },
};
</script>

<template>
    <div v-if="serverStatus === 'unreachable'" class="unreacheable-message">
        Backend is unreachable
    </div>
    <div class="url-fetcher-container">
        <h1 class="app-title">Get CSS and JS files from a Website</h1>
        <div class="suggestion-container">
            <button @click="fillInputWithLink('https://youtube.com')" class="suggestion-button">YouTube</button>
            <button @click="fillInputWithLink('https://openai.com')" class="suggestion-button">Openai</button>
            <button @click="fillInputWithLink('https://amazon.com')" class="suggestion-button">Amazon</button>
        </div>
        <input type="text" class="input" placeholder="Enter URL" v-model="urlInput" @keyup.enter="getData" />
        <button @click="getData" class="button" :disabled="isFetching">Get</button>

        <!-- Loader -->
        <div v-if="isFetching" class="loader">
            <div class="loading-spinner"></div>
            <div>Loading...</div>
        </div>

        <div v-if="cssFiles.length || jsFiles.length" class="file-list-container">
            <!-- CSS Files -->
            <transition name="fade">
                <div v-if="cssFiles.length" class="file-list" key="cssFiles">
                    <h2>CSS Files:</h2>
                    <ul>
                        <li v-for="(cssFile, index) in cssFiles" :key="index" class="file-item">
                            <a :href="cssFile.url" target="_blank" class="file-link">{{ cssFile.name }}</a>
                        </li>
                    </ul>
                </div>
            </transition>

            <!-- JS Files -->
            <transition name="fade">
                <div v-if="jsFiles.length" class="file-list" key="jsFiles">
                    <h2>JS Files:</h2>
                    <ul>
                        <li v-for="(jsFile, index) in jsFiles" :key="index" class="file-item">
                            <a :href="jsFile.url" target="_blank" class="file-link">{{ jsFile.name }}</a>
                        </li>
                    </ul>
                </div>
            </transition>
        </div>
    </div>
</template>

<style scoped>
.unreacheable-message {
    background-color: #e74c3c;
    color: #fff;
    padding: 15px;
    font-size: 1.4em;
    position: fixed;
    left: 0;
    right: 0;
}

button {
    border-radius: 5px;
    transition: all ease-in-out .2s;
}

button:hover {
    filter: saturate(1.5) contrast(1.2);
}

button:disabled {
    filter: contrast(0.5);
}

.url-fetcher-container {
    max-width: 600px;
    margin: auto;
    padding: 20px;
    padding-top: 70px;
    text-align: center;
}

.app-title {
    font-size: 24px;
    margin-bottom: 20px;
}

.suggestion-container {
    padding-bottom: 20px;
}

.suggestion-button {
    margin-right: 10px;
    padding: 8px 15px;
    background-color: #698ca1;
    color: #fff;
    border: none;
    cursor: pointer;
}

.input {
    width: 70%;
    padding: 8px;
    margin-right: 10px;
    border-radius: 5px;
    border: 1px solid #3498db;
    box-shadow: 0 0 5px #3498db;
    transition: border-color 0.3s, box-shadow 0.3s;
    background-color: #2c3e50; /* Adjust input background color based on your theme */
    color: #fff; 
}

.input:focus {
    outline: none;
    border-color: #2980b9;
    box-shadow: 0 0 20px #2980b9;
}

.button {
    padding: 8px 15px;
    background-color: #3498db;
    color: #fff;
    border: none;
    cursor: pointer;
}

/* Loader styles */
.loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 18px;
    margin-top: 20px;
    color: #3498db;
}

.loading-spinner {
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top: 4px solid #3498db;
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;
    margin-bottom: 10px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.file-list-container {
    margin-top: 20px;
}

.file-list {
    margin-top: 10px;
}

.file-item {
    margin-bottom: 5px;
}

.file-link {
    text-decoration: none;
    color: #3498db;
    font-weight: bold;
}

/* Transition */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
