"use client";

import { Tabs, Tab } from "@nextui-org/react";
import PortfolioForm from "../PortfolioForm";
import SymbolForm from "../SymbolForm";

export default () => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="px-4 text-2xl font-bold">Import Data</h1>
      <p className="text-small px-4 mb-6 max-w-2xl text-gray-100">
        Populate your portfolio by adding individual symbol to a portfolio or
        import a whole portfolio using TradingView String Format.
      </p>
      <Tabs aria-label="Forms" variant="underlined">
        <Tab title="Symbol">
          <p className="text-small px-3 pb-4 text-gray-100">
            Add individual symbol to your portfolio.
          </p>
          <SymbolForm />
          <p className="text-xs px-3 pb-4 text-gray-100">
            *Select portfolio by switching the tabs below
          </p>
        </Tab>
        <Tab title="Portfolio">
          <p className="text-small px-3 pb-4 text-gray-100">
            Import your portfolio in one tap using Trading View Portfolio
            String.
          </p>
          <PortfolioForm />
        </Tab>
      </Tabs>
    </div>
  );
};
