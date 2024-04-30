import React, { useState } from 'react';

const QuestionPage: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    // Work on submitting information to server for answer and send back
  };

  return (
    <div>
      <h1>Question Page</h1>
      <p>Question goes here...</p>

      <div>
        <label>
          <input
            type="radio"
            value="option1"
            checked={selectedOption === 'option1'}
            onChange={() => handleOptionChange('option1')}
          />
          Option 1
        </label>
      </div>

      <div>
        <label>
          <input
            type="radio"
            value="option2"
            checked={selectedOption === 'option2'}
            onChange={() => handleOptionChange('option2')}
          />
          Option 2
        </label>
      </div>

      <div>
        <label>
          <input
            type="radio"
            value="option3"
            checked={selectedOption === 'option3'}
            onChange={() => handleOptionChange('option3')}
          />
          Option 3
        </label>
      </div>

      <div>
        <label>
          <input
            type="radio"
            value="option4"
            checked={selectedOption === 'option4'}
            onChange={() => handleOptionChange('option4')}
          />
          Option 4
        </label>
      </div>

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default QuestionPage;
