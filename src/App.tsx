import { mockResponseData } from '../mocks/data';

function App() {
  const { category_title, points, question_content } = mockResponseData;

  return (
    <div className="jeopardy-question-container">
      <div
        className={
          'flex items-center justify-center jeopardy-question-container-cat py-3'
        }>
        <p>
          {category_title} - {points}
        </p>
      </div>
      <div className={'jeopardy-question-container-content'}>
        {question_content}
      </div>
    </div>
  );
}

export default App;
