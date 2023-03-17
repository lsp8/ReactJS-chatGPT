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
    const { text } = response.data.choices[0];

    const textChunks = text.split("\n");

    const delayedResponse = new Promise((resolve) => {
      const chunkDelay = 1000 / textChunks.length;
      let i = 0;

      const intervalId = setInterval(() => {
        setStoredValues((prevValues) => [
          {
            question: newQuestion,
            answer: prevValues[0] ? prevValues[0].answer : "",
            progress: i / textChunks.length,
          },
          ...prevValues.slice(1, 10),
        ]);

        if (++i === textChunks.length) {
          clearInterval(intervalId);
          resolve();
        }
      }, chunkDelay);
    });

    await delayedResponse;

    setStoredValues([
      {
        question: newQuestion,
        answer: text,
        progress: 1,
      },
      ...storedValues,
    ]);

    setNewQuestion("");
  }
};
