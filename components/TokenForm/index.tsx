import { Input, Button } from "@nextui-org/react";
import gateway from "../../api/APIGateway";
import { useState } from "react";
export default () => {
  const [token, changeToken] = useState("");
  function onSubmitAPIToken() {
    gateway.changeToken(token);
  }
  function onChangeToken(event: any) {
    changeToken(event.target.value);
  }
  return (
    <div className="flex flex-col gap-2">
      <h1 className="px-4 text-2xl font-bold">API Token</h1>
      <p className="text-small px-4 mb-6 max-w-2xl text-gray-100">
        Finnhub recently changed their business model and the OpenTicker author
        can no longer sustain its public API, which will cost 2000$/month per
        Finnhub plan. For the public demo, it's advised to create a Finnhub
        account yourself{" "}
        <a href="https://finnhub.io/" className="underline">
          here
        </a>
        . I'm sorry for the inconvenience!
        <br />
        <br />
        If you wish to have a private product demo, you can contact the
        OpenTicker team{" "}
        <a href="mailto:binhpham@binhph.am" className="underline">
          here.
        </a>
      </p>
      <div>
        <Input
          label="API Token"
          placeholder="Enter your API token from Finnhub"
          variant="bordered"
          value={token}
          onChange={onChangeToken}
        />
        <Button
          color="primary"
          size="md"
          className="my-4"
          variant="flat"
          onClick={onSubmitAPIToken}
        >
          Change API Token
        </Button>
      </div>
    </div>
  );
};
