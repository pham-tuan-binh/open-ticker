import {
  PortfolioEntry,
  focusOnPortfolio,
  updateTime,
} from "../../redux/PortfolioSlice";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  Button,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import RowEntry from "./RowEntry";
import {
  SymbolChartEntry,
  getSymbolCharts,
  updateSymbolChart,
} from "../../redux/SymbolChartSlice";
import {
  addPortfolioChart,
  removePortfolioChart,
} from "../../redux/PortfolioChartSlice";
import { removePortfolio } from "../../redux/PortfolioSlice";
import { useDispatch, useSelector } from "react-redux";
import { Key, useEffect } from "react";
import {
  updateSymbolDailyData,
  updateSymbolLiveData,
} from "../../redux/SymbolLiveData";
import gateway from "../../api/APIGateway";

function mergeCharts(charts: Array<SymbolChartEntry>) {
  let processedData = structuredClone(charts[0].chart);

  for (let i = 1; i < charts.length; i++) {
    for (let j = 0; j < processedData.length; j++) {
      processedData[j].open += charts[i].chart[j].open;
      processedData[j].high += charts[i].chart[j].high;
      processedData[j].low += charts[i].chart[j].low;
      processedData[j].close += charts[i].chart[j].close;
    }
  }
  return processedData;
}

function quantizeChart(chart: SymbolChartEntry, quantity: number) {
  for (let i = 0; i < chart.chart.length; i++) {
    chart.chart[i].open *= quantity;
    chart.chart[i].high *= quantity;
    chart.chart[i].low *= quantity;
    chart.chart[i].close *= quantity;
  }
  return chart;
}

export default ({ name, lastUpdated, symbols }: PortfolioEntry) => {
  const charts = useSelector(getSymbolCharts);
  const dispatch = useDispatch();

  useEffect(() => {
    for (let symbol of symbols) {
      gateway.subscribeToSymbol(symbol.name);
    }

    gateway.onSocketMessage((event) => {
      const data = JSON.parse(event.data);
      if (data.type == "trade" && data.data[0] != undefined) {
        dispatch(
          updateSymbolLiveData({
            name: data.data[0].s,
            latestPrice: data.data[0].p,
          })
        );
      }
    });
  });

  async function onCompileChart() {
    let portfolioCharts: Array<SymbolChartEntry> = [];
    if (symbols.length == 0) {
      return;
    }
    for (let symbol of symbols) {
      const chart = structuredClone(
        charts.find((item) => item.name == symbol.name)
      );
      if (chart != undefined) {
        portfolioCharts.push(quantizeChart(chart, symbol.quantity));
      }
    }
    let mergedChart = mergeCharts(portfolioCharts);

    dispatch(addPortfolioChart({ name: name, chart: mergedChart }));
  }

  function onDeletePortfolio() {
    dispatch(removePortfolio({ portfolio: name }));
    dispatch(removePortfolioChart({ portfolio: name }));
  }

  // Refresh Data Automatically Daily
  useEffect(() => {
    const time = new Date().getTime();

    async function refreshData() {
      for (let entry of symbols) {
        let chart = await gateway.getChartForSymbol(entry.name);
        dispatch(updateSymbolChart(chart));

        let dailyPrice = chart.chart.slice(-1)[0].close;
        if (dailyPrice != undefined) {
          dispatch(
            updateSymbolDailyData({ name: entry.name, dailyPrice: dailyPrice })
          );
        }
      }
      dispatch(updateTime({ portfolio: name }));
    }

    if (time - lastUpdated > 1000 * 60 * 60 * 24) {
      refreshData();
    }
  });
  return (
    <div>
      <Table
        aria-label="Example static collection table"
        className="max-h-96"
        isHeaderSticky
      >
        <TableHeader>
          <TableColumn>SYMBOL</TableColumn>
          <TableColumn>QUANTITY</TableColumn>
          <TableColumn>CURRENT PRICE</TableColumn>
          <TableColumn>DAILY MOVEMENT</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody items={symbols}>
          {(item) => (
            <TableRow key={item.name}>
              {(columnKey: Key) => (
                <TableCell>
                  <RowEntry symbol={item} portfolio={name} column={columnKey} />
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Button
        color="success"
        size="md"
        className="my-4 mr-4"
        variant="flat"
        onClick={onCompileChart}
      >
        Compile Charts
      </Button>
      <Button
        size="md"
        className="my-4"
        variant="flat"
        color="danger"
        onClick={onDeletePortfolio}
      >
        Delete Portfolio
      </Button>
    </div>
  );
};
