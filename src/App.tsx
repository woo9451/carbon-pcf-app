import { useMemo, useState } from "react";
import "./App.css";

type ActivityType = "electricity" | "material" | "transport";

interface Activity {
  id: number;
  date: string;
  type: ActivityType;
  description: string;
  amount: number;
  unit: string;
  emission: number;
}

const emissionFactors = {
  electricity: 0.456,
  material: 3.2,
  transport: 3.5,
};

const typeLabel = {
  electricity: "전기",
  material: "원소재",
  transport: "운송",
};

function App() {
  const [date, setDate] = useState("");
  const [type, setType] = useState<ActivityType>("electricity");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const getUnit = (type: ActivityType) => {
    if (type === "electricity") return "kWh";
    if (type === "material") return "kg";
    return "ton-km";
  };

  const calculateEmission = (type: ActivityType, amount: number) => {
    return Number((amount * emissionFactors[type]).toFixed(2));
  };

  const totalEmission = useMemo(() => {
    return activities.reduce((sum, activity) => sum + activity.emission, 0);
  }, [activities]);

  const summary = useMemo(() => {
    return {
      electricity: activities
        .filter((activity) => activity.type === "electricity")
        .reduce((sum, activity) => sum + activity.emission, 0),
      material: activities
        .filter((activity) => activity.type === "material")
        .reduce((sum, activity) => sum + activity.emission, 0),
      transport: activities
        .filter((activity) => activity.type === "transport")
        .reduce((sum, activity) => sum + activity.emission, 0),
    };
  }, [activities]);

  const handleAdd = () => {
    if (!date || !description || !amount) {
      setErrorMessage("날짜, 활동 유형, 설명, 수량을 모두 입력해주세요.");
      return;
    }

    const numericAmount = Number(amount);

    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      setErrorMessage("수량은 0보다 큰 숫자로 입력해주세요.");
      return;
    }

    const newActivity: Activity = {
      id: Date.now(),
      date,
      type,
      description,
      amount: numericAmount,
      unit: getUnit(type),
      emission: calculateEmission(type, numericAmount),
    };

    setActivities([...activities, newActivity]);
    setDate("");
    setDescription("");
    setAmount("");
    setErrorMessage("");
  };

  const handleSampleData = () => {
    const sampleData: Activity[] = [
      {
        id: 1,
        date: "2025-01-01",
        type: "electricity",
        description: "한국전력",
        amount: 110,
        unit: "kWh",
        emission: calculateEmission("electricity", 110),
      },
      {
        id: 2,
        date: "2025-05-01",
        type: "material",
        description: "플라스틱 1",
        amount: 230,
        unit: "kg",
        emission: calculateEmission("material", 230),
      },
      {
        id: 3,
        date: "2025-01-01",
        type: "transport",
        description: "트럭",
        amount: 41,
        unit: "ton-km",
        emission: calculateEmission("transport", 41),
      },
    ];

    setActivities(sampleData);
    setErrorMessage("");
  };

  const handleDelete = (id: number) => {
    setActivities(activities.filter((activity) => activity.id !== id));
  };

  return (
    <div className="app">
      <header className="header">
        <p className="eyebrow">Carbon Management SaaS</p>
        <h1>탄소 배출 관리 시스템</h1>
        <p className="description">
          전기, 원소재, 운송 활동 데이터를 입력하면 배출계수를 기준으로
          탄소 배출량을 자동 계산합니다.
        </p>
      </header>

      <section className="summary-grid">
        <div className="summary-card total">
          <span>총 배출량</span>
          <strong>{totalEmission.toFixed(2)}</strong>
          <p>kgCO2e</p>
        </div>

        <div className="summary-card">
          <span>전기</span>
          <strong>{summary.electricity.toFixed(2)}</strong>
          <p>kgCO2e</p>
        </div>

        <div className="summary-card">
          <span>원소재</span>
          <strong>{summary.material.toFixed(2)}</strong>
          <p>kgCO2e</p>
        </div>

        <div className="summary-card">
          <span>운송</span>
          <strong>{summary.transport.toFixed(2)}</strong>
          <p>kgCO2e</p>
        </div>
      </section>

      <main className="content">
        <section className="panel">
          <div className="panel-title">
            <h2>활동 데이터 입력</h2>
            <button className="secondary-button" onClick={handleSampleData}>
              샘플 데이터 불러오기
            </button>
          </div>

          <div className="form-grid">
            <label>
              활동일자
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>

            <label>
              활동유형
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ActivityType)}
              >
                <option value="electricity">전기</option>
                <option value="material">원소재</option>
                <option value="transport">운송</option>
              </select>
            </label>

            <label>
              설명
              <input
                placeholder="예: 한국전력, 플라스틱 1, 트럭"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>

            <label>
              수량
              <div className="amount-input">
                <input
                  placeholder="수량 입력"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <span>{getUnit(type)}</span>
              </div>
            </label>
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button className="primary-button" onClick={handleAdd}>
            데이터 추가
          </button>
        </section>

        <section className="panel">
          <div className="panel-title">
            <h2>입력 데이터</h2>
            <p>{activities.length}건</p>
          </div>

          {activities.length === 0 ? (
            <div className="empty-box">
              입력된 데이터가 없습니다. 활동 데이터를 추가해주세요.
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>날짜</th>
                    <th>활동 유형</th>
                    <th>설명</th>
                    <th>수량</th>
                    <th>단위</th>
                    <th>배출량</th>
                    <th>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity) => (
                    <tr key={activity.id}>
                      <td>{activity.date}</td>
                      <td>
                        <span className={`badge ${activity.type}`}>
                          {typeLabel[activity.type]}
                        </span>
                      </td>
                      <td>{activity.description}</td>
                      <td>{activity.amount}</td>
                      <td>{activity.unit}</td>
                      <td>{activity.emission.toFixed(2)} kgCO2e</td>
                      <td>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(activity.id)}
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;