import { useState } from "react";

const FormSection = ({ generateResponse }) => {
  const [newQuestion, setNewQuestion] = useState("");
  return (
    <div className="form-section">
      <textarea
        rows="5"
        className="form-control"
        placeholder="Faça sua pergunta!"
        value={newQuestion}
        onChange={(e) => setNewQuestion(e.target.value)}
      ></textarea>
      <button
        className="btn"
        onClick={() => generateResponse(newQuestion, setNewQuestion)}
      >
        Gerar resposta
      </button>
    </div>
  );
};

export default FormSection;
