"use client";

import { createChart, ColorType } from "lightweight-charts";
import React, { useEffect, useRef } from "react";
import { OHLCTEntry } from "../../redux/SymbolChartSlice";

export default (props: { data: any; colors?: any }) => {
  let {
    data,
    colors: {
      backgroundColor = "#18181B",
      lineColor = "#2962FF",
      textColor = "white",
      areaTopColor = "#2962FF",
      areaBottomColor = "rgba(41, 98, 255, 0.28)",
    } = {},
  } = props;

  const chartContainerRef = useRef<HTMLDivElement>(null);

  data = data.map((entry: OHLCTEntry) => ({
    value: entry.close,
    time: entry.time,
  }));

  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current!.clientWidth });
    };

    const chartOptions = {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      width: chartContainerRef.current!.clientWidth,
      height: 300,
    };
    const chart = createChart(chartContainerRef.current!, chartOptions);

    const candlestickSeries = chart.addAreaSeries({
      lineColor: "#2962FF",
      topColor: "#2962FF",
      bottomColor: "rgba(41, 98, 255, 0.28)",
    });

    candlestickSeries.setData(data);

    chart.timeScale().fitContent();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      chart.remove();
    };
  }, [
    data,
    backgroundColor,
    lineColor,
    textColor,
    areaTopColor,
    areaBottomColor,
  ]);

  return (
    <div>
      <div
        ref={chartContainerRef}
        className="rounded-xl overflow-hidden shadow-md bg-black"
      />
    </div>
  );
};
