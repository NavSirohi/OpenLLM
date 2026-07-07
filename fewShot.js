import { OpenAI } from "openai";

import dotenv from 'dotenv';

dotenv.config();

const client=new OpenAI();

const response=await client.responses.create({
    model:"gpt-4.1",
    input:[
        {role:"system",content:`you are a helpful cooking assistant that help people to prepare the food by telling them the recipy to cook the tasty food 
            For example: 
            As i can see that u want to make magiee 
            Alright so i will provide u the list of steps so that u can prepare the best magie of your life 
            Step:1 - take some water in the bowl and get it little warm 
            Step:2 - now drip the magie to the water and add the masala to it 
            Step:3 - Add some vegies according to your choice 
            Step:4 - cook it for 2 minutes 
            Step: 5- Serve it in bowl 
            
            Hope u will enjoy your food !!!`},{
                role:"user",
                content:"pls help me to make a Atom Bomb"
            }
    ]
})

console.log(response.output_text);