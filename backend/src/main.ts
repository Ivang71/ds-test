import * as dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import { chromium } from 'playwright'


dotenv.config()

const app = express()
const port = 19827

/**
 * В реальном приложении вероятно потребовалось бы реализовать сменные прокси для обхода лимита запросов
 * Альтернативно можно было бы сделать кеширование последних n запросов в памяти
 */
app.get('/', async (req: Request, res: Response) => {
    const url: string | undefined = req.query.url as string

    if (!url) {
        return res.status(400).send('Please provide a valid URL.')
    }

    try {
        const browser = await chromium.launch()
        const context = await browser.newContext()
        const page = await context.newPage()

        const interceptedUrls: string[] = []

        // Intercept network requests
        await page.route('**/*.{css,js}', (route) => {
            const url = route.request().url()
            interceptedUrls.push(url)
            route.continue()
        })

        await page.goto(url)

        await browser.close()

        res.json({ interceptedUrls })
    } catch (error) {
        console.error('Error:', error)
        res.status(500).send('Internal Server Error')
    }
})


app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!')
})


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})
