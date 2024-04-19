import type { ChatCompletionCreateParamsNonStreaming } from "openai/resources/index.mjs"

export type Character = {
    n: string //name
    p: ChatCompletionCreateParamsNonStreaming // params 
}