import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./App.css";

type ActivityType = "electricity" | "plastic1" | "plastic2" | "transport";

interface Activity {
  id: number;
  date: string;
  type: ActivityType;
  description: string;
  amount: number;
  unit: string;
  emission: number;
}

interface EmissionFactor {
  code: ActivityType;
  activityGroup: "electricity" | "material" | "transport";
  label: string;
  factor: number;
  version: string;
  source: string;
  inputUnit: string;
  resultUnit: "kgCO2e";
}

const emissionFactorTable: EmissionFactor[] = [
  {
    code: "electricity",
    activityGroup: "electricity",
    label: "전기",
    factor: 0.456,
    version: "2025.1",
    source: "과제 제공 도메인 기준",
    inputUnit: "kWh",
    resultUnit: "kgCO2e",
  },
  {
    code: "plastic1",
    activityGroup: "material",
    label: "플라스틱1",
    factor: 2.3,
    version: "2025.1",
    source: "과제 제공 도메인 기준",
    inputUnit: "kg",
    resultUnit: "kgCO2e",
  },
  {
    code: "plastic2",
    activityGroup: "material",
    label: "플라스틱2",
    factor: 3.2,
    version: "2025.1",
    source: "과제 제공 도메인 기준",
    inputUnit: "kg",
    resultUnit: "kgCO2e",
  },
  {
    code: "transport",
    activityGroup: "transport",
    label: "운송",
    factor: 3.5,
    version: "2025.1",
    source: "과제 제공 도메인 기준",
    inputUnit: "ton-km",
    resultUnit: "kgCO2e",
  },
];

const emissionFactorMap = Object.fromEntries(
  emissionFactorTable.map((factor) => [factor.code, factor]),
) as Record<ActivityType, EmissionFactor>;

const typeLabel = Object.fromEntries(
  emissionFactorTable.map((factor) => [factor.code, factor.label]),
) as Record<ActivityType, string>;

function App() {
  const [date, setDate] = useState("");
  const [type, setType] = useState<ActivityType>("electricity");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const getUnit = (type: ActivityType) => {
    return emissionFactorMap[type].inputUnit;
  };

  const calculateEmission = (type: ActivityType, amount: number) => {
    return Number((amount * emissionFactorMap[type].factor).toFixed(2));
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
        .filter(
          (activity) => emissionFactorMap[activity.type].activityGroup === "material",
        )
        .reduce((sum, activity) => sum + activity.emission, 0),
      transport: activities
        .filter((activity) => activity.type === "transport")
        .reduce((sum, activity) => sum + activity.emission, 0),
    };
  }, [activities]);

  const chartData = [
  { name: "전기", emission: Number(summary.electricity.toFixed(2)), color: "#f59e0b" },
  { name: "원소재", emission: Number(summary.material.toFixed(2)), color: "#10b981" },
  { name: "운송", emission: Number(summary.transport.toFixed(2)), color: "#8b5cf6" },
  ];

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
        type: "plastic1",
        description: "플라스틱1",
        amount: 230,
        unit: "kg",
        emission: calculateEmission("plastic1", 230),
      },
      {
        id: 4,
        date: "2025-05-02",
        type: "plastic2",
        description: "플라스틱2",
        amount: 120,
        unit: "kg",
        emission: calculateEmission("plastic2", 120),
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
        <p className="eyebrow">AI 기반 탄소관리 SaaS</p>
        <h1>제품 탄소발자국 관리 대시보드</h1>
        <p className="description">
          전기, 원소재, 운송 데이터를 배출계수 기반으로 환산하여
          제품 탄소발자국(PCF)을 직관적으로 관리합니다.
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

      <section className="panel chart-panel">
        <div className="panel-title">
          <h2>활동 유형별 탄소 배출량</h2>
          <p>단위: kgCO2e</p>
        </div>

        <div className="chart-box">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
                <Bar dataKey="emission">
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                    ))}
                </Bar>
            </BarChart>
          </ResponsiveContainer>
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
                <option value="plastic1">플라스틱1</option>
                <option value="plastic2">플라스틱2</option>
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
