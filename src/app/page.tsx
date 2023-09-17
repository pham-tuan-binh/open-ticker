"use client";

import FormsTab from "../../components/FormsTab";
import PortfolioViewer from "../../components/PortfolioViewer";
import ChartsView from "../../components/ChartsView";
import { Divider } from "@nextui-org/react";
import TokenForm from "../../components/TokenForm";

export default function Home() {
  return (
    <div className="w-full lg:w-2/3 p-4 md:p-12 flex flex-col m-auto">
      <h1 className=" text-5xl sm:text-8xl lg:text-9xl font-bold mb-6 lg:mb-12 px-3 text-transparent bg-clip-text bg-gradient-to-tr to-green-400 from-emerald-600">
        OpenTicker
      </h1>
      <p className="text-small px-4 mb-6 max-w-3xl text-gray-100">
        OpenTicker is an Open-source Data Compilation and Analysis tool for
        Retail Traders. It's all about transparency, ease of usage and logical
        flow of work.
        <br />
        <br />
        This project is still in its very early age, please report bugs and
        errors on{" "}
        <a href="https://binhph.am" className="underline">
          {" "}
          Github
        </a>
        .
        <br />
        <br />
        Bear in mind that its developer have only spent 12 hours to create this
        MVP so most input validation and performance optimization are not in
        place. Use the tool carefully, don't stress test it, it will definitely
        break. Thanks for checking out this tool!
      </p>
      <Divider className="mb-10" />
      <FormsTab />
      <Divider className="mb-10" />
      <PortfolioViewer />
      <ChartsView />
      <Divider className="mb-10" />
      <TokenForm />
    </div>
  );
}
