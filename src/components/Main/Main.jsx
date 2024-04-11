import { useEffect, useState } from "react";
import { Col, Row, Card } from "antd";
import axios from "axios";
import { ExclamationCircleTwoTone } from "@ant-design/icons";

import PlotChart from "../Chart/Chart";

import "./main.css";

import { BALANCE_SHEET_URL, INCOME_STATEMENT_URL } from "./constants";

const Main = () => {
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const getBalanceSheet = await axios.get(`${BALANCE_SHEET_URL}`);
      const getIncomeStatement = await axios.get(`${INCOME_STATEMENT_URL}`);
      setData({
        balanceSheetData: getBalanceSheet?.data?.quarterlyReports,
        incomeStatementData: getIncomeStatement?.data?.quarterlyReports,
        symbol: getBalanceSheet?.data?.symbol,
      });
      setFetching(false);
    };

    try {
      setFetching(true);
      fetchData();
    } catch (e) {
      setFetching(false);
      setError(true);
      throw new Error(e?.message);
    }
  }, []);

  const Error = () => {
    return (
      <div className="error">
        <div>
          <ExclamationCircleTwoTone
            twoToneColor="red"
            className="danger-icon"
          />
          <p className="error-label">Something wents wrong!</p>
        </div>
      </div>
    );
  };

  const Graph = () => {
    return (
      <>
        <Row gutter={6}>
          <Col className="card1" span={24}>
            <Card className="card" loading={fetching}>
              {data && <PlotChart data={data} />}
            </Card>
          </Col>
        </Row>
      </>
    );
  };

  return <div className="main">{error ? <Error /> : <Graph />}</div>;
};

export default Main;
