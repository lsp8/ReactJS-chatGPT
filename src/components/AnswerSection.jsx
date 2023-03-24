const AnswerSection = ({ storedValues }) => {
  const copyText = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <hr className="hr-line" />
      <div className="answer-container">
        {storedValues.map((item, index) => {
          if (index > 0) {
            return (
              <div className="answer-section" key={index}>
                <p className="question">{item.question}</p>
                <p className="answer">{item.answer}</p>

                <div
                  className="copy-icon"
                  onClick={() => copyText(item.answer)}
                >
                  <i className="fa-solid fa-copy"></i>
                </div>
              </div>
            );
          }
        })}
      </div>
    </>
  );
};

export default AnswerSection;
