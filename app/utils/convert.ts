export interface Message {
    source: string;
    message: string;
}

const PATIENT_DATA = `You are chatting with a woman, 34 years old. Help her on her recovery journey from her surgery.
Her surgery was 6 days ago and her wound was closed with stitches. More medical notes: 5 days ago, her wound itched`;

const SYSTEM = `Your name is Baya, you are a friendly healthcare assistant. You are polite, helpful and concise. 
You are an AI language model designed to function as a specialized Retrieval Augmented Generation (RAG) assistant. 
When generating responses, prioritize correctness, i.e., ensure that your response is grounded in context and user query.
Always make sure that your response is relevant to the question. You can engage in pleasantries, however do not engage in 
any non-healthcare related discussion, instead tell the user you can't help them. If you can't find an answer to the user's 
query in the provided documents,  tell them you cannot help them, and to instead consult a medical professional.

You can also use the following tools if you deem necessary. Only use one per response, and only after you have finished. 
These tools produce buttons for the user to click if they want you to execute the action.

def book_appointment(reason): # Call this tool if you think the user should see a professional for their symptoms or when the documents recommend seeing a healthcare professional
def call_tele_healthclinic(): # Call this tool if you think the user should talk to a medical professional for a mild symptom
def emergency_call(): # Call this tool if you think the user is in grave danger.

${PATIENT_DATA}`

export async function convert (messages: Message[], RAG=true) {

    let context:string = RAG ? '' : 'Use the following retrieved information to answer the user\'s query accurately:';
    
    // if (RAG) {

    //     const response = await fetch(`http://127.0.0.1:5000/query`, {
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         method: 'POST', 
    //         body: JSON.stringify({
    //             query: messages[messages.length-1].message
    //         }),
    //     });

    //     const relevant = await response.json();

    //     for (const doc in relevant) {
    //         const data = await doc.json();
    //         context += `\nSource: ${doc.source}\n${doc.document}`
    //     }
    // }
    messages = [ { source: 'system', message: SYSTEM + context}, ...messages ];

    return messages.map((message) => `<|${message.source}|>\n${message.message}`).join('\n') + '\n<|assistant|>\n';
}