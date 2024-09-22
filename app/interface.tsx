'use client';

import { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send } from 'lucide-react';
import { 
  TooltipProvider, 
  TooltipTrigger,
  TooltipContent,
  Tooltip
} from '@/components/ui/tooltip';
import { Message, convert } from '@/utils/convert';

function Interactable(action:string, setAction:Dispatch<SetStateAction<string>>, setMessages:Dispatch<SetStateAction<Message[]>>) {
    const interact = () => {
        Book(setMessages)
        setAction('')
    }
    return(
        action != '' &&
        <div className='flex ml-10'>
            <Button
                className='bg-blue-100 hover:bg-sky-200'
                variant="secondary"
                onClick={interact}
            >
                Book Appointment
            </Button>
        </div>
    )
}

function Book(setMessages:Dispatch<SetStateAction<Message[]>>) {
    const botMessage = { source: 'assistant', message: 'Appointment Booked!' };
    setMessages((prevMessages) => [...prevMessages, botMessage]);

}

export default function Interface(props: { firstname: string }) {

    const { firstname } = props;
    const bottomRef = useRef<null | HTMLDivElement>(null);

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [action, setAction] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(() => {
        const convertMessages = async () => {
            bottomRef.current?.scrollIntoView({
                behavior:'smooth'
            });

            if (messages.length == 0 || messages[messages.length-1].source != 'user') return;
            
            const converted = await convert(messages);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/query`, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query:converted
                }),
            });

            const data = await response.json();
            const botMessage = { source: 'assistant', message: data.message };
            setAction(data.action);
            setMessages((prevMessages) => [...prevMessages, botMessage]);
            setIsDisabled(true);
        };
    
        convertMessages();
    }, [messages]);

    const sendMessage = async () => {
        if (input.trim() === '') return;

        setIsDisabled(true);   
        setInput('');        
    
        const userMessage = { source: 'user', message: input };
        setMessages([...messages, userMessage]);
    }
    
    
    return (
        <>
            { messages.length == 0 ?
            <>
                <div className='sm:pt-44'></div>
                <h1 className="text-3xl font-semibold">Welcome back, {firstname}</h1>
                <span className="text-xl sm:pb-8">How are you feeling today?</span>

                {/* <span>You have <b>2</b> upcoming <a href='/appointments' className='text-blue-500'>appointments. </a> 
                Your next appointment is on Monday, at 4pm with Dr. Ziegler, at the Cleveland Clinic.</span>
                <span>Your next <a href='/medications' className='text-blue-500'>medication</a> is Xionide, in 2 hours.</span> */}
                <span>You have <b>2</b> upcoming <a href='/appointments' className='text-blue-500'>appointments.</a> 
                Your next appointment is tomorrow, at 4pm with Dr. Ziegler, at the Cleveland Clinic.</span>
                <span>Your next <a href='/medications' className='text-blue-500'>medication</a> is Xionide, in 18 hours.</span>
            </>
            : 
            <div className='flex flex-col gap-4 w-full overflow-y-auto pb-14'>
                {messages
                    .filter((message) => message.source != 'system')
                    .map((message, i) => (
                        <div key={i} className={`flex items-end ${message.source == 'user' && 'justify-end'}`}>
                            {message.source === 'assistant' ? 
                            <Avatar>
                                <AvatarImage src="/baya.png" alt="@Baya"/>
                                <AvatarFallback>Baya</AvatarFallback>
                            </Avatar> : null}
                            <div className={`flex p-4 rounded-t-lg w-auto max-w-md
                                ${message.source == 'user' ? 'bg-slate-200 rounded-bl-lg justify-end' : 'bg-emerald-400 rounded-br-lg'}`
                            }>
                                {message.message}
                            </div>
                        </div>
                ))}
                { messages[messages.length - 1].source == 'user' ?
                <div className='flex'>
                    <Avatar>
                        <AvatarImage src="/baya.png" alt="@Baya" />
                        <AvatarFallback>Baya</AvatarFallback>
                    </Avatar>
                    <div className='flex p-4 rounded-t-lg w-auto max-w-md bg-emerald-400 rounded-br-lg space-x-2'>
                        <div className='w-1 h-1 bg-black rounded-full animate-bounce' style = {{ animationDelay: '0s'}}>
                        </div>
                        <div className='w-1 h-1 bg-black rounded-full animate-bounce' style = {{ animationDelay: '0.2s'}}>
                        </div>
                        <div className='w-1 h-1 bg-black rounded-full animate-bounce' style = {{ animationDelay: '0.4s'}}>
                        </div>
                    </div>
                </div> : Interactable(action, setAction, setMessages)
                }
                <div ref={bottomRef}></div>
            </div>
            } 
            <div className='flex items-center w-1/2 flex-col fixed bottom-0 pb-12'>
                <div className="flex w-full items-center space-x-2 mt-auto">
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
                            disabled={isDisabled}
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
                <div className='text-xs text-stone-400 font-thin text-center mt-2'>
                    Baya can make mistakes. For serious cases, please reach out directly to your healthcare provider.
                </div>
            </div>
        </>
    );
}