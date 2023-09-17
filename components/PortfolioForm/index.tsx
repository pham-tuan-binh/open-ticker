import { Input, Button } from "@nextui-org/react";
import { addPortfolio } from "../../redux/PortfolioSlice";
import { updateSymbolDailyData } from "../../redux/SymbolLiveData";
import { getSymbolCharts, addSymbolChart } from "../../redux/SymbolChartSlice";
import { useSelector, useDispatch } from "react-redux";
import React, { useState } from "react";
import gateway from "../../api/APIGateway";

export default function SymbolForm() {
  const [portfolioName, changePortfolioName] = useState<string>("");
  const [portfolioString, changePortfolioString] = useState<string>("");
  const [portfolioStringError, changePortfolioStringError] =
    useState<boolean>(false);
  const dispatch = useDispatch();
  const charts = useSelector(getSymbolCharts);

  function processPortfolioString(testString: string) {
    const pattern = /^([A-Z]+\*\d+(\.\d+)?\+*)+$/;

    const isCorrect = pattern.test(testString);

    if (isCorrect) {
      const portfolioEntry = [];
      const symbols = testString.split("+");

      for (let entity of symbols) {
        const data = entity.split("*");
        portfolioEntry.push({
          name: data[0],
          quantity: Number(data[1]),
        });
      }
      return portfolioEntry;
    }

    return undefined;
  }

  async function onAddPortfolio() {
    const symbols = processPortfolioString(portfolioString);
    if (symbols != undefined) {
      changePortfolioStringError(false);
      dispatch(
        addPortfolio({
          name: portfolioName,
          lastUpdated: 0,
          symbols: symbols,
        })
      );

      for (let entry of symbols) {
        let chart = await gateway.getChartForSymbol(entry.name);
        dispatch(addSymbolChart(chart));
      }
    } else {
      changePortfolioStringError(true);
    }
  }

  function onChangePortfolioName(value: string) {
    changePortfolioName(value);
  }

  function onChangePortfolioString(value: string) {
    changePortfolioString(value);
  }

  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-4">
        <Input
          label="Name"
          placeholder="Enter your portfolio's name."
          value={portfolioName}
          onValueChange={onChangePortfolioName}
          variant="bordered"
        />
        <Input
          label="Portfolio String"
          placeholder="Enter your portfolio string. Eg: AAPL*1+GOOG*0.5"
          value={portfolioString}
          onValueChange={onChangePortfolioString}
          variant="bordered"
          className="md:col-span-2"
          validationState={portfolioStringError ? "invalid" : "valid"}
          errorMessage={
            portfolioStringError
              ? "Your Portfolio String is not in the correct format."
              : undefined
          }
        />
      </div>

      <Button
        color="primary"
        size="md"
        onClick={onAddPortfolio}
        className="my-4"
        variant="flat"
      >
        Add Portfolio
      </Button>
    </div>
  );
}
