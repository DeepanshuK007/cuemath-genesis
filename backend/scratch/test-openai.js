import OpenAI from 'openai'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

async function test() {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Say hello' }],
    })
    console.log('Result:', completion.choices[0].message.content)
  } catch (error) {
    console.error('Error:', error.message)
  }
}

test()
