import { useState } from "react";
import AreaChart from "../AreaChart";
import CandleStickChart from "../CandleStickChart";
import { Button } from "@nextui-org/react";

export default (props: { data: any }) => {
  const [isCandle, changeIsCandle] = useState<boolean>(true);

  function onExportCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "time,open,high,low,close\r\n";
    props.data.forEach((entry: any) => {
      let row = `${entry.time},${entry.open},${entry.high},${entry.low},${entry.close}`;
      csvContent += row + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
  }

  return (
    <div>
      {isCandle ? (
        <CandleStickChart data={props.data} />
      ) : (
        <AreaChart data={props.data} />
      )}
      <Button
        color="primary"
        size="md"
        className="my-4 mr-4"
        variant="flat"
        onClick={onExportCSV}
      >
        Export Chart To CSV
      </Button>
      <Button
        color="secondary"
        size="md"
        className="my-4 mr-4"
        variant="flat"
        onClick={() => {
          changeIsCandle(!isCandle);
        }}
      >
        Toggle Candle/Area
      </Button>
    </div>
  );
};
