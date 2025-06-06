import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState, useEffect } from "react";
import Loader from "./Loader";

function Summary({file}) {

    const genAI = new GoogleGenerativeAI("AIzaSyCwH1t6YHmaRMIul-xCwOs63f85aEGls8c");
    const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });
    const [summary, setSummary] = useState("");
    const [status, setStatus] = useState("idle");

    async function getSummary(){
        setStatus('loading');

        try {
            const result = await model.generateContent([
                {
                    inlineData: {
                        data: file.file,
                        mimeType: file.type,
                    },
                },
                `
                Generate a concise summary of the attached document.
                The summary must be a single paragraph, under 300 words.
                It should clearly identify the document's main topic or purpose and highlight its most significant key points or conclusions.
                Output in plain text only (no markdown, HTML, or other formatting). Ensure the summary accurately captures the essence of the document.
                `,
            ]);
            setStatus('success');
            setSummary(result.response.text());
        } catch (error) {
            setStatus('error');
        }

    }

    useEffect(()=>{
        if(status === 'idle') {
            getSummary();
        }
    },[status]);


    return (
      <section className="summary">

        <img src={file.imageUrl} alt="Preview Image" />
        <h2>Summary</h2>
        {
            status === 'loading' ?
            <Loader /> :
            status === 'success' ?
            <p>{summary}</p> :
            status === 'error' ?
            <p>Error getting the summary</p> :
            ''

        }
      </section>
    )
  }
  
  export default Summary
  