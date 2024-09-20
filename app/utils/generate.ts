import { WatsonXAI } from '@ibm-cloud/watsonx-ai';
import { IamAuthenticator } from 'ibm-cloud-sdk-core';

const watson = WatsonXAI.newInstance({ 
    authenticator: new IamAuthenticator({ apikey: process.env.WATSONX_AI_APIKEY || '' }),
    version: process.env.WATSONX_AI_VERSION || '2024-05-31',
    serviceUrl: process.env.WATSONX_AI_URL || 'https://us-south.ml.cloud.ibm.com'
});


export default async function generate(query:string) {
    const params = {
        input: query,
        modelId: process.env.LLM_MODEL_ID || 'ibm/granite-13b-chat-v2',
        projectId: process.env.LLM_PROJECT_ID || 'None',
        parameters: {
            decoding_method: process.env.LLM_DECODING_METHOD,
            min_new_tokens: process.env.LLM_MIN_NEW_TOKENS ? Number(process.env.LLM_MIN_NEW_TOKENS) : undefined,
            max_new_tokens: process.env.LLM_MAX_NEW_TOKENS ? Number(process.env.LLM_MAX_NEW_TOKENS) : undefined,
            stop_sequences: process.env.LLM_STOP_SEQUENCES ? JSON.parse(process.env.LLM_STOP_SEQUENCES) : undefined,
            repetition_penalty: process.env.LLM_REPETITION_PENALTY ? Number(process.env.LLM_REPETITION_PENALTY) : undefined,
        },
        moderations : process.env.LLM_GUARDRAILS ? {
            hap: {
                input: {
                    enabled: true,
                    threshold: 0.5,
                    mask: {
                        remove_entity_value: true,
                    },
                },
                output: {
                    enabled: true,
                    threshold: 0.5,
                    mask: {
                        remove_entity_value: true,
                    },
                },
            },
        } : undefined,
    };

    // return 'generated text here';    

    return watson
    .generateText(params)
    .then(res => res.result.results[0].generated_text)
    .catch(() => 'Error generating output');
    // .generateTextStream(params)
}