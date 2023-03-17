import { Configuration, OpenAIApi } from "openai";

import FormSection from "./components/FormSection";
import AnswerSection from "./components/AnswerSection";

import { useState } from "react";

const App = () => {
  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  const [storedValues, setStoredValues] = useState([]);

  const generateResponse = async (newQuestion, setNewQuestion) => {
    let options = {
      model: "text-davinci-003",
      temperature: 0,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stop: ["/"],
    };

    let completeOptions = {
      ...options,
      prompt: newQuestion,
    };

    const response = await openai.createCompletion(completeOptions);

    if (response.data.choices) {
      setStoredValues([
        {
          question: newQuestion,
          answer: response.data.choices[0].text,
        },
        ...storedValues,
      ]);
      setNewQuestion("");
    }
  };

  return (
    <div>
      <div className="header-section">
        <h1>Assistente PanvelLabs - by Paulo Salim</h1>
        <p>
          Olá!Seja bem vindo ao sistema de perguntas e respostas do Panvel Labs!
          Sou um sistema automatizado, desenvolvido para lhe auxiliar a
          encontrar informações relevantes. Sinta-se a vontade para realizar
          qualquer pergunta e eu farei o meu melhor para trazer informações
          confiáveis.
        </p>
      </div>

      <FormSection generateResponse={generateResponse} />

      <AnswerSection storedValues={storedValues} />
    </div>
  );
};

export default App;
