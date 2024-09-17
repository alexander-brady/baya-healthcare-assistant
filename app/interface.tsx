'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { 
  TooltipProvider, 
  TooltipTrigger,
  TooltipContent,
  Tooltip
} from '@/components/ui/tooltip';
import { Message, convert } from '@/app/utils/convert';

const SYSTEM = 'You are a helpful chatbot assisting a user with a medical question.';

export default function Interface(props: { firstname: string }) {

    const { firstname } = props;
    
    const [messages, setMessages] = useState<Message[]>([
        { source: 'system', message: SYSTEM }
    ]);
    const [input, setInput] = useState('');

    const sendMessage = async () => {
        if (input.trim() === '') return;
    
        const userMessage = { source: 'user', message: input };
        setMessages([...messages, userMessage]);
    
        setInput('');        

        const response = await fetch(`http://localhost:3000/api/query`, {
            method: 'POST', 
            body: JSON.stringify({
                query:convert(messages)
            }),
        });
        const data = await response.json();
        const botMessage = { source: 'assistant', message: data.message };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
    };
    
    
    return (
        <>
        { messages.length < 2 ?
            <>
                <h1 className="text-3xl font-semibold">Welcome back, {firstname}</h1>
                <span className="text-xl sm:pb-8">How are you feeling today?</span>

                <span>You have <b>2</b> upcoming <a href='/appointments' className='text-blue-500'>appointments.</a> 
                Your next appointment is on Monday, at 4pm with Dr. Ziegler, at the Cleveland Clinic.</span>
                <span>Your next <a href='/medications'className='text-blue-500'>medication</a> is Xionide, in 2 hours.</span>
            </>
            :
            <>
                <section className="flex flex-col gap-4 sm:flex-grow">
                    {messages
                        .filter((message) => message.source != 'system')
                        .map((message, index) => (
                        <span key={index}><b>{message.source}:</b> {message.message}</span>
                    ))}
                </section>
            </>
        } 
            <div className="flex w-full max-w-sm items-center space-x-2 sm:mt-auto">
                <Input 
                    placeholder="Ask me anything..."
                    name="message"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            sendMessage();
                        }
                    }}
                />
                <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                    <Button 
                        size="icon" 
                        className='hover:text-gray-200'
                        onClick={sendMessage}
                        >                
                        <Send className="size-4" />
                    </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        Send
                    </TooltipContent>
                </Tooltip>
                </TooltipProvider>
            </div>       
        </>
    );
}