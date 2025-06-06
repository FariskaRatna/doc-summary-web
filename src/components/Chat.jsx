import { GoogleGenerativeAI } from "@google/generative-ai";
import './Chat.css'
import { useState } from 'react'

function Chat({file}) {

    const genAI = new GoogleGenerativeAI("AIzaSyCwH1t6YHmaRMIul-xCwOs63f85aEGls8c");
    const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });
    const [messages, setMessage] = useState([]);
    const [input, setInput] = useState("");
    console.log(input)

    async function handleSendMessage() {
        if(input.length) {
            let chatMessages = [...messages, {role: "user", text: input}, {role: "loader", text: ""}];
            setInput("");
            setMessage(chatMessages);

            try {
                const result = await model.generateContent([
                    {
                        inlineData: {
                            data: file.file,
                            mimeType: file.type,
                        },
                    },
                    `
                    Using *only* the information from the attached document, answer this question: ${input}.
                    Answer as a chatbot with short messages and text only (no markdowns, tags, or symbols).
                    If the answer cannot be found in the document, clearly state that.
                    Chat history for context: ${JSON.stringify(messages)}
                    `,
                ]);

                chatMessages = [...chatMessages.filter((msg)=>msg.role != 'loader'), {role: "model", text: result.response.text()}]
                setMessage(chatMessages);
            } catch (error) {
                chatMessages = [...chatMessages.filter((msg)=>msg.role != 'loader'), {role: "error", text: "Error sending messages, please try again."}]
                setMessage(chatMessages);
                console.log('error');
            }
        }
    }

    return (
      <section className="chat-window">
        <h2>Chat</h2>
        {
            messages.length ? 
            <div className="chat">
                {
                    messages.map((msg)=>(
                        <div className={msg.role} key={msg.text}>
                            <p>{msg.text}</p>
                        </div>
                    ))
                }
            </div> :
            ''
        }
        <div className="input-area">
            <input 
                value={input}
                onChange={(e)=>setInput(e.target.value)}
                type="text" 
                placeholder="Ask any question about the uploaded document..."
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
      </section>
    )
  }
  
  export default Chat
  