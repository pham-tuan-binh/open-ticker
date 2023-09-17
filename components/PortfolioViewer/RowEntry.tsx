import { Button } from "@nextui-org/react";
import { SymbolEntry } from "../../redux/PortfolioSlice";
import { DeleteIcon } from "./DeleteIcon";
import { useDispatch, useSelector } from "react-redux";
import { removeSymbolFromPortfolio } from "../../redux/PortfolioSlice";
import { getSymbolLiveData } from "../../redux/SymbolLiveData";

export default (props: {
  symbol: SymbolEntry;
  portfolio: string;
  column: string | number;
}) => {
  const {
    symbol: { name, quantity },
    portfolio,
    column,
  } = props;
  const dispatch = useDispatch();
  const liveData = useSelector(getSymbolLiveData);

  function onDeleteSymbol() {
    dispatch(
      removeSymbolFromPortfolio({
        portfolio: portfolio,
        symbol: name,
      })
    );
  }
  let index;

  switch (column) {
    case "$.0":
      return name;
    case "$.1":
      return quantity;
    case "$.2":
      index = liveData.findIndex((entry) => entry.name == name);
      if (index >= 0) {
        return liveData[index].latestPrice;
      }

      return "Market Closed";
    case "$.3":
      index = liveData.findIndex((entry) => entry.name == name);

      if (index >= 0) {
        return `${
          (liveData[index].latestPrice - liveData[index].dailyPrice) /
          liveData[index].dailyPrice
        }%`;
      }

      return "Market Closed";
    case "$.4":
      return (
        <Button
          variant="light"
          className="text-danger -ml-4"
          onClick={onDeleteSymbol}
        >
          <span className="text-lg text-danger cursor-pointer active:opacity-50">
            <DeleteIcon />
          </span>
          Delete
        </Button>
      );
  }

  return <div>hi</div>;
};
