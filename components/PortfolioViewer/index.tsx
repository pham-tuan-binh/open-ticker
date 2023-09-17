"use client";

import React from "react";
import { Tabs, Tab } from "@nextui-org/react";

import { getPortfolioList, focusOnPortfolio } from "../../redux/PortfolioSlice";
import { useSelector, useDispatch } from "react-redux";
import TabEntry from "./TabEntry";

export default () => {
  const portfolioList = useSelector(getPortfolioList);
  const dispatch = useDispatch();

  function onChangingPortfolio(key: React.Key) {
    dispatch(focusOnPortfolio({ portfolio: String(key) }));
  }

  return (
    <div className="flex flex-col gap-2">
      <h1 className="px-4 text-2xl font-bold">Portfolio View</h1>
      <p className="text-small px-4 mb-6 max-w-2xl text-gray-100">
        View your portfolios quickly.
      </p>
      <Tabs
        aria-label="Portfolios"
        onSelectionChange={onChangingPortfolio}
        variant="underlined"
        items={portfolioList}
      >
        {(item) => (
          <Tab key={item.name} title={item.name}>
            {" "}
            <TabEntry {...item} />
            <p className="text-xs px-3 pb-4 text-gray-100">
              *Refresh data when compiled chart is empty or outdated.
            </p>
          </Tab>
        )}
      </Tabs>
    </div>
  );
};
