import { useEffect, useRef, useState } from "react";
import { SSE } from "sse";
import { throttle } from 'lodash-es';
import "./App.css";

import { Chat } from "./components";
import { Loading } from "./components/Loading";
import { Header } from "./components/Header";
import { Setting } from "./components/Setting";



interface IMessage {
  role: TRole;
  content: string;
}
function App() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [prompt, setPrompt] = useState<string>(''); 
  // 实时的返回数据  
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const resultRef = useRef<string>('');
  useEffect(() => {
    resultRef.current = result;
  }, [result]);

  const resultElement = useRef<HTMLDivElement>(null);
  
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  }


  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.code === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitPromptBtnClicked()
    }
  }


  let handleSubmitPromptBtnClicked = async () => {
    const store = JSON.parse(localStorage.getItem('setting') || '{}');
    const API_KEY = store.API_KEY;
    const PROXY = store.API_PROXY ?? 'https://api.openai.com'
    if (prompt) {
      setIsLoading(true);
      setResult("");
      setPrompt('');
      const fullMessages = [...messages, {role: 'user' as TRole, content: prompt}];
      setMessages(fullMessages);
      console.log('fullMessages', fullMessages);
      let url = `${PROXY}/v1/chat/completions`;
      let data = {
        model: "gpt-3.5-turbo",
        messages: fullMessages.slice(fullMessages.length-5, fullMessages.length), // 最多取5条
        temperature: 0.75,
        top_p: 0.95,
        max_tokens: 200,
        stream: true,
        n: 1,
      };

      let source = new SSE(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        method: "POST",
        payload: JSON.stringify(data),
      });

      let gptRole: TRole = 'assistant';
      source.addEventListener("message", (e: any) => {
        if (e.data != "[DONE]") {
          let payload = JSON.parse(e.data);
          let {delta, finish_reason} = payload.choices[0];
          if (finish_reason != "stop") {
            const {role,  content} = delta;
            if(role) {
              gptRole = role;
            }
            if(content && content !== "\n\n") {
              resultRef.current = resultRef.current + delta.content;
              setResult(resultRef.current);
              resultElement.current?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
            }
          }
        } else {
          // done
          console.log(fullMessages);
          setMessages(fullMessages.concat({role: gptRole, content: resultRef.current}));
          resultRef.current = "";
          setResult("");
          source.close();
        }
      });

      source.addEventListener("readystatechange", (e: any) => {
        if (e.readyState >= 2) {
          setIsLoading(false);
        }
      });

      source.stream();
    }
  };

  function handleClearSession() {
    setMessages([]);
    setResult("");
  }

  const [showSetting, setShowSetting] = useState(false);
  function handleSetting() {
    setShowSetting(true);
  }

  return (
    <div className="h-screen select-none flex flex-col container mx-auto font-sans p-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
      <Header onClearSession={handleClearSession} onSetting={handleSetting}/>
      <div className="container flex-1 overflow-auto">
      <div className="flex flex-col mt-5 select-text selection:bg-fuchsia-300 selection:text-white">
          {messages.map((message, index) => {
            return (
              <Chat
                key={index}
                role={message.role}
                message={message.content}
              />
            );
          })}
          {result && <div ref={resultElement}><Chat role="system" message={result} /></div>}
        </div>
      </div>
      <div className=" relative flex items-center justify-center py-1">
        {isLoading && <div className="absolute -top-6 w-20 py-1 flex justify-center"><Loading/></div>}
        <textarea onKeyDown={handleKeyDown} onChange={handleInput} value={prompt} id="message" rows={2} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your thoughts here..."></textarea>
        <button disabled={!prompt} className="bg-cyan-500 text-white h-full rounded-lg shadow-sm px-4 py-1 ml-1 disabled:opacity-50" onClick={handleSubmitPromptBtnClicked} >send</button>
      </div>
      {showSetting && <Setting onClose={() => setShowSetting(false)}/>}
    </div>
  );
}

export default App;
