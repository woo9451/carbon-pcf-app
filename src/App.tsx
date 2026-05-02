import { useState } from "react";

type ActivityType = "electricity" | "material" | "transport";

interface Activity {
  id: number;
  date: string;
  type: ActivityType;
  description: string;
  amount: number;
  unit: string;
}

function App() {
  const [date, setDate] = useState("");
  const [type, setType] = useState<ActivityType>("electricity");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [activities, setActivities] = useState<Activity[]>([]);

  const getUnit = (type: ActivityType) => {
    if (type === "electricity") return "kWh";
    if (type === "material") return "kg";
    return "ton-km";
  };

  const handleAdd = () => {
    if (!date || !description || !amount) {
      alert("날짜, 설명, 수량을 모두 입력해주세요.");
      return;
    }

    const newActivity: Activity = {
      id: Date.now(),
      date,
      type,
      description,
      amount: Number(amount),
      unit: getUnit(type),
    };

    setActivities([...activities, newActivity]);
    setDate("");
    setDescription("");
    setAmount("");
  };

  return (
    <div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1>탄소 배출 관리 시스템</h1>

      <section>
        <h2>데이터 입력</h2>

        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

        <select value={type} onChange={(e) => setType(e.target.value as ActivityType)}>
          <option value="electricity">전기</option>
          <option value="material">원소재</option>
          <option value="transport">운송</option>
        </select>

        <input
          placeholder="활동 설명"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          placeholder="수량"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <span>{getUnit(type)}</span>

        <button onClick={handleAdd}>추가</button>
      </section>

      <section>
        <h2>입력 데이터</h2>

        {activities.length === 0 ? (
          <p>입력된 데이터가 없습니다.</p>
        ) : (
          <table border={1} cellPadding={8}>
            <thead>
              <tr>
                <th>날짜</th>
                <th>활동 유형</th>
                <th>설명</th>
                <th>수량</th>
                <th>단위</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity.id}>
                  <td>{activity.date}</td>
                  <td>{activity.type}</td>
                  <td>{activity.description}</td>
                  <td>{activity.amount}</td>
                  <td>{activity.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2>배출량 결과</h2>
        <p>총 배출량: 0 kgCO2e</p>
      </section>
    </div>
  );
}

export default App;