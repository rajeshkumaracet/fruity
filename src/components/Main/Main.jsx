import { useEffect, useState } from "react";
import axios from "axios";
import { Col, Row, Card } from "antd";
import { ExclamationCircleTwoTone } from "@ant-design/icons";

import PlotChart from "../Chart/Chart";

import "./Main.css";

import { BALANCE_SHEET_URL, INCOME_STATEMENT_URL } from "./constants";

const Main = () => {
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      setFetching(true);
      const getBalanceSheet = await axios.get(`${BALANCE_SHEET_URL}`);
      const getIncomeStatement = await axios.get(`${INCOME_STATEMENT_URL}`);
      setData({
        balanceSheetData: getBalanceSheet?.data?.quarterlyReports,
        incomeStatementData: getIncomeStatement?.data?.quarterlyReports,
        symbol: getBalanceSheet?.data?.symbol,
      });
      setFetching(false);
    } catch (error) {
      setFetching(false);
      setError(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const Error = () => (
    <div className="error" data-testid="error">
      <div>
        <ExclamationCircleTwoTone twoToneColor="red" className="danger-icon" />
        <p className="error-label">Something wents wrong!</p>
      </div>
    </div>
  );

  const Graph = () => (
    <div data-testid="graph">
      <Row>
        <Col className="card1" span={24}>
          <Card className="card" loading={fetching}>
            {data && <PlotChart data={data} />}
          </Card>
        </Col>
      </Row>
    </div>
  );

  return (
    <div className="main" data-testid="main">
      {error ? <Error /> : <Graph />}
    </div>
  );
};

export default Main;
