# 탄소 배출 관리 시스템 (Carbon Emission Management System)

## 📌 프로젝트 개요
기업 활동 데이터(전기, 원소재, 운송 등)를 입력하면  
탄소 배출량(kgCO2e)을 자동으로 계산하고 관리할 수 있는 웹 애플리케이션입니다.

사용자가 직접 데이터를 입력하고, 활동별 배출량 및 총 배출량을 직관적으로 확인할 수 있도록 구현했습니다.

---

## 🛠 기술 스택
- Frontend: React, TypeScript, Vite
- State Management: useState
- Version Control: Git, GitHub

---

## ⚙️ 주요 기능

### 1. 데이터 입력
- 날짜, 활동 유형, 설명, 수량 입력 가능
- 입력값 validation 처리 (빈 값 / 0 이하 값 방지)

### 2. 배출량 자동 계산
- 활동 유형별 배출계수 적용
- 입력 시 자동으로 배출량 계산

```text
전기: kWh × 0.456  
원소재: kg × 3.2  
운송: ton-km × 3.5