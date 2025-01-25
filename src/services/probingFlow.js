import dotenv from 'dotenv';
dotenv.config();
import OpenAI from 'openai';


const openai = new OpenAI({ apiKey: process.env.OPENAI_API });


async function generateFollowUpQuestion(context) {
    try {
        const prompt = `
            You are an AI Assistant generating strategic follow-up question

            Context:
            - context till now : ${context}

            Objective:
            Generate a follow-up question that:
            - Deeply probes user movie preferences
            - Uses minimal, targeted questions
            - Provides clear interaction state

            Preference Exploration Dimensions:
            1. Genre specifics
            2. Emotional tone
            3. Thematic interests
            4. Personal viewing preferences

            Response Structure:
            {
                // [STATE_CONTINUE,STATE_SATISFIED,STATE_STOP]
                "state": [boolean, boolean, boolean],
                "question": "string | undefined", 
                "reasoning": "string | undefined",

                Example: {
                    "state": [1, 0, 0],
                    "question": "What type of movie do you prefer?",
                    "reasoning": "Gathering more context"
                }
            }

            Termination Triggers:
                Satisfied Case Phrases:
                    "Great recommendations"
                    "These are perfect"
                    "I like these suggestions"
                    "Found what I wanted"
                    "This works for me"
                    "Exactly what I was looking for"
                    "Good job"

                Unsatisfied/Stop Case Phrases:
                    "Stop"
                    "Done"
                    "Not interested"
                    "This isn't helpful"
                    "Nevermind"
                    "Cancel"
                    "Exit"
                    "Quit"

            Evaluation Criteria:
            - Relevance to initial query
            - Potential to refine recommendations
            - Conversational naturalness
            Desired OutCome:
            - A strategically crafted question
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are a helpful assistant generating structured movie recommendation follow-up questions." },
                { role: "user", content: prompt }
            ],
            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "followup_question_schema",
                    schema: {
                        type: "object",
                        properties: {
                            state: {
                                type: "array",
                                items: { type: "number" },
                                description: "Interaction state [CONTINUE, SATISFIED, STOP]"
                            },
                            question: {
                                type: "string",
                                description: "Follow-up question to probe user preferences"
                            },
                            reasoning: {
                                type: "string",
                                description: "Reasoning behind the follow-up question"
                            }
                        },
                        required: ["state", "question"],
                        additionalProperties: false
                    }
                }
            },
            temperature: 0.7,
            store: true
        });

        const response = JSON.parse(completion.choices[0].message.content);
        return response;
    } catch (error) {
        console.error('Error generating follow-up question:', error);
        return 'Sorry, I couldn\'t understand that. Can you clarify?';
    }
}

export default generateFollowUpQuestion;