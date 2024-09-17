export interface Message {
    source: string;
    message: string;
}

export const convert = (messages: Message[]) => {
    return messages.map((message) => {
        return `<|${message.source}|>\n${message.message}`;
    }).join('\n');
};