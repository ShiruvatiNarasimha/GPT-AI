import { createContext, useState } from "react";
import runChat from "../config/Gemini";


export const Context = createContext()

const ContextProvider = (props) => {

    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] =  useState("");


    const delayPara =(index,nextword) =>{
        setTimeout(function () {
            setResultData(prev=>prev+nextword);
        }, 75*index)
    }

    const newChat =() => {
        setLoading(false)
        setShowResult(false)
    }

    

    const onSent = async (prompt) => {

        setResultData("")
        setLoading(true)
        setShowResult(true)
        let response ;
        if(prompt !== undefined){
            response = await runChat(prompt);
            setRecentPrompt(prompt)
        }
            else{
                setPrevPrompts(prev=>[...prev,input])
                setRecentPrompt(input)
                response = await runChat(input)
            }
      let responseArray = response.split("");
      let newResponse="" ;
      for(let i= 0; i< responseArray.length; i++)
      {
        if(i === 0 || i%2 !== 1) {
            newResponse += responseArray[i];
        }
        else{
            newResponse +=responseArray[i];
        }
        
      }
      let newResponse2 = newResponse.split("*").join("")
      let newResponseArray = newResponse2.split(" ");
      for(let i=0; i<newResponseArray.length; i++)
      {
        const nextword = newResponseArray[i];
        delayPara(i, nextword+ " ")
      }
      setLoading(false)
      setInput("")
    }

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
} 


export default ContextProvider