import { Input, Button } from "@nextui-org/react";
import {
  addSymbolToPortfolio,
  getFocusedPortfolio,
} from "../../redux/PortfolioSlice";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { getSymbolCharts, addSymbolChart } from "../../redux/SymbolChartSlice";
import gateway from "../../api/APIGateway";
import { updateSymbolDailyData } from "../../redux/SymbolLiveData";

export default function SymbolForm() {
  const [symbolName, changeSymbolName] = useState<string>("");
  const [quantity, changeQuantity] = useState<string>("");
  const dispatch = useDispatch();

  const focusedPortfolio = useSelector(getFocusedPortfolio);
  const charts = useSelector(getSymbolCharts);

  async function onAddSymbol() {
    dispatch(
      addSymbolToPortfolio({
        symbol: {
          name: symbolName,
          quantity: Number(quantity),
        },
        portfolio: focusedPortfolio,
      })
    );

    if (charts.find((chart) => chart.name == symbolName) == undefined) {
      const chart = await gateway.getChartForSymbol(symbolName);
      let dailyPrice = chart.chart.slice(-1)[0].close;
      dispatch(addSymbolChart(chart));
      dispatch(
        updateSymbolDailyData({ name: symbolName, dailyPrice: dailyPrice })
      );
    }
  }

  function onChangeSymbolName(value: string) {
    changeSymbolName(value);
  }

  function onChangeQuantity(value: string) {
    changeQuantity(value);
  }

  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Symbol"
          placeholder="Enter a NASDAQ Symbol"
          value={symbolName}
          onValueChange={onChangeSymbolName}
          variant="bordered"
        />
        <Input
          label="Number of Shares"
          placeholder="Enter the number of shares you own (can be fractional)"
          value={quantity}
          onValueChange={onChangeQuantity}
          variant="bordered"
        />
      </div>
      {focusedPortfolio && (
        <Button
          color="primary"
          size="md"
          onClick={onAddSymbol}
          className="my-4"
          variant="flat"
        >
          Add Symbol To {focusedPortfolio == undefined ? "f" : focusedPortfolio}
        </Button>
      )}
    </div>
  );
}
