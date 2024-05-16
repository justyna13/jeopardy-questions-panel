import mqtt from 'mqtt';
import { useEffect, useState } from 'react';

import { IGetGameDataResponse } from '@/types/api.ts';

function App() {
  const [hostAddress, setHostAddress] = useState(
    localStorage.getItem('mqttHost') || ''
  );
  const [question, setQuestion] = useState<IGetGameDataResponse | null>(null);
  const [btnPressed, setBtnPressed] = useState<number>(-1);

  const [client, setClient] = useState<mqtt.MqttClient | null>(null);

  const connectToMqtt = (
    mqttOption: mqtt.IClientOptions | undefined = undefined
  ) => {
    setClient(mqtt.connect(hostAddress, mqttOption));
  };

  useEffect(() => {
    const mqttSub = (topic: string) => {
      if (!client) return;
      client.subscribe(topic);
    };

    if (!client) return;

    client.on('connect', () => {
      localStorage.setItem('mqttHost', hostAddress);
      mqttSub('quiz/selected_question');
      mqttSub('quiz/triggered');
    });

    client.on('message', (topic, message) => {
      if (topic == 'quiz/selected_question') {
        setQuestion(JSON.parse(message.toString()));
      }

      if (topic == 'quiz/triggered') {
        const msg: { first_btn_num: number } = JSON.parse(message.toString());
        setBtnPressed(msg.first_btn_num);
      }
    });
  }, [client]);

  const startConnection = () => {
    if (hostAddress.length === 0) return;

    connectToMqtt();
  };

  return (
    <div>
      {client ? (
        <div className="jeopardy-question-container flex flex-col justify-between">
          <div
            className={
              'flex items-center justify-center jeopardy-question-container-cat py-3'
            }>
            <p>
              {question?.category_title} - {question?.points}
            </p>
          </div>
          {btnPressed !== -1 && (
            <div
              className={'flex items-center justify-center bg-green-700 py-3'}>
              <p>Team: {btnPressed}</p>
            </div>
          )}
          <div className={'jeopardy-question-container-content'}>
            {question?.question_content}
          </div>
          <div className={'py-3 pl-4 !bg-gray-500 !text-black'}>
            <p className="text-left">
              Odpowiedź: <br />
              {question?.answer}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-[#2a3698] w-screen h-screen flex flex-col">
          <div className="w-300 my-4 ml-4">
            <h1 className="text-3xl text-white mb-4">Jeopardy Panel</h1>

            <input
              type="text"
              placeholder="Adres MQTT"
              value={hostAddress}
              className="border-2 border-black px-4 py-3 leading-9 mb-6 rounded-xl outline-none hover:outline-none"
              onChange={(e) => setHostAddress(e.target.value)}
            />

            <button
              type="button"
              onClick={startConnection}
              className="py-2.5 px-10 me-2 mb-2 text-xl font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10">
              Połącz
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
