import {
  getFocusedPortfolio,
  getPortfolioList,
} from "../../redux/PortfolioSlice";
import { useSelector } from "react-redux";
import { getPortfolioCharts } from "../../redux/PortfolioChartSlice";
import CandleStickChart from "../CandleStickChart";
import { Select, SelectItem } from "@nextui-org/react";
import { getSymbolCharts } from "../../redux/SymbolChartSlice";
import AreaChart from "../AreaChart";
import { useState } from "react";
import CombinedChart from "../CombinedChart";

export default function ChartsView() {
  const focusedPortfolio = useSelector(getFocusedPortfolio);
  const portfolioList = useSelector(getPortfolioList);
  const portfolioCharts = useSelector(getPortfolioCharts);
  const symbolCharts = useSelector(getSymbolCharts);

  const [symbol, changeSymbol] = useState("");

  function onChangeSymbol(event: any) {
    changeSymbol(event.target.value);
  }

  let chart = portfolioCharts.find((entity) => entity.name == focusedPortfolio);

  let portfolio = portfolioList.find(
    (entity) => entity.name == focusedPortfolio
  );

  let symbolChart = symbolCharts.find((entity) => entity.name == symbol);
  if (portfolio != undefined) {
    return (
      <div className="flex flex-col gap-2">
        {chart != undefined && (
          <div>
            <h1 className="px-4 text-2xl font-bold">Portfolio Unified Chart</h1>
            <p className="text-small px-4 mb-6 max-w-2xl text-gray-100">
              View your portfolio's historical performance in one chart.
            </p>
            <CombinedChart data={structuredClone(chart.chart)} />{" "}
            <div>
              <h1 className="mx-4 text-2xl font-bold">Symbol Area Chart</h1>
              <p className="text-small mx-4 mb-6 max-w-2xl text-gray-100">
                View individual symbol's performance
              </p>
              <Select
                items={portfolio?.symbols}
                label="Pick a symbol"
                placeholder={`Symbols in ${portfolio?.name}`}
                className="max-w-xs px-4 mb-6 "
                value={symbol}
                onChange={onChangeSymbol}
              >
                {(entry) => (
                  <SelectItem key={entry.name}>{entry.name}</SelectItem>
                )}
              </Select>
              {symbolChart != undefined && (
                <CombinedChart data={structuredClone(symbolChart.chart)} />
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return <div></div>;
}
1;
