import mqtt from 'mqtt';
import { useEffect, useState } from 'react';

import { mockResponseData } from '../mocks/data';

function App() {
  const { category_title, points, question_content } = mockResponseData;
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);

  const connectToMqtt = (
    host: string,
    mqttOption: mqtt.IClientOptions | undefined = undefined
  ) => {
    setClient(mqtt.connect(host, mqttOption));
  };

  useEffect(() => {
    const mqttSub = (topic: string) => {
      if (!client) return;
      client.subscribe(topic);
    };

    if (!client) return;

    client.on('connect', () => {
      mqttSub('quiz/selected_question');
    });
  }, [client]);

  const startConnection = () => {
    connectToMqtt(import.meta.env.VITE_MQTT_SERVER_HOST);
  };

  return (
    <div>
      {client ? (
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
      ) : (
        <button onClick={startConnection}>Połącz</button>
      )}
    </div>
  );
}

export default App;
