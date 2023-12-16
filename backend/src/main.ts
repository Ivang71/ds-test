import express, { Request, Response } from 'express'
import axios from 'axios'
import { parse } from 'node-html-parser'
import cors from 'cors'


const app = express()
const port = 80

app.use(cors()) // Небезопасно в проде

const addHttpsToUrlArray = (urls: string[]) => urls.map((url) => url.startsWith('//') ? `https:${url}` : url)

/**
 * Это решение пропустить некоторые файлы если они загружаются не напрямую из html а из js кода.
 * Для получения таких файлов можно использовать браузер без интерфейса с перехватом запросов 
 */
app.get('/', async (req: Request, res: Response) => {
    const url: string | undefined = req.query.url as string

    try {
        if (!url) {
            return res.status(400).json({ error: 'URL is required' })
        }

        // Fetch HTML content from the specified URL
        const { data: htmlContent } = await axios.get(url)

        // Parse HTML content to extract CSS and JS files
        const root = parse(htmlContent)
        let cssFiles = root.querySelectorAll('link[rel="stylesheet"]').map(link => link.getAttribute('href'))
        let jsFiles = root.querySelectorAll('script[src]').map(script => script.getAttribute('src'))

        cssFiles = addHttpsToUrlArray(cssFiles)
        jsFiles = addHttpsToUrlArray(jsFiles)

        // Return the extracted files to the requester
        res.json({ cssFiles, jsFiles })
    } catch (error) {
        console.error('Error:', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})


app.get('/ping', (req: Request, res: Response) => {
    res.status(200).send()
})


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})
