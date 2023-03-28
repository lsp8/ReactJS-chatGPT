import { Configuration, OpenAIApi } from "openai";

import FormSection from "./components/FormSection";
import AnswerSection from "./components/AnswerSection";

import { useEffect, useState } from "react";

const App = () => {
  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  const [storedValues, setStoredValues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [typedAnswerEffect, setTypedAnswerEffect] = useState("");

  const generateResponse = async (newQuestion, setNewQuestion) => {
    setIsLoading(true);
    let options = {
      model: "davinci",
      temperature: 0,
      max_tokens: 128,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    };

    //MODELO TREINADO, NÃO CUSTOMIZÁVEL
    // let options = {
    //   model: "text-davinci-003",
    //   temperature: 0,
    //   max_tokens: 2048,
    //   top_p: 1,
    //   frequency_penalty: 0.0,
    //   presence_penalty: 0.0,
    //   stop: ["/"],
    // };

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
      setCurrentQuestion(newQuestion);
      setCurrentAnswer(response.data.choices[0].text);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    let timeout;
    let currentIndex = 0;
    setTypedAnswerEffect("");
    const renderNextChar = () => {
      if (currentIndex < currentAnswer.length - 1) {
        setTypedAnswerEffect(
          (prevAnswer) => prevAnswer + currentAnswer[currentIndex]
        );
        currentIndex++;
        timeout = setTimeout(renderNextChar, 100);
      }
    };
    renderNextChar();
    return () => clearTimeout(timeout);
  }, [currentAnswer]);

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div>
      <div className="header-section">
        <h1>Assistente PanvelLabs - by Paulo Salim</h1>
        <p>
          Olá! Seja bem vindo ao sistema de perguntas e respostas do Panvel
          Labs! Sou um sistema automatizado, desenvolvido para lhe auxiliar a
          encontrar informações relevantes. Sinta-se a vontade para realizar
          qualquer pergunta e eu farei o meu melhor para trazer informações
          confiáveis.Qual a idade do Silvio Santos? Qual a idade de Donald
          Trump?
        </p>
      </div>

      <FormSection generateResponse={generateResponse} />
      {isLoading ? (
        <p>Buscando Resposta. Por favor, aguarde...</p>
      ) : (
        typedAnswerEffect.length > 1 && (
          <div className="answer-container">
            <div className="answer-section">
              <p className="question">{currentQuestion}</p>
              <p className="answer">{typedAnswerEffect} </p>
              <div
                className="copy-icon"
                onClick={() => copyText(typedAnswerEffect)}
              >
                <i className="fa-solid fa-copy"></i>
              </div>
            </div>
          </div>
        )
      )}

      <AnswerSection storedValues={storedValues} />
    </div>
  );
};

export default App;
