import { OpenAI } from "openai";
import dotenv from 'dotenv';
dotenv.config();
const client =new OpenAI();

const response=await client.responses.create({
    model:'gpt-3.5-turbo',
    input:[{
        role:"user",
        content:"say hello to the user",
    }]
})

console.log(response.output_text);

