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
        If you are encountering issues with empty charts, that probably means
        you have encountered the rate limit of Finnhub. In this online demo, you
        are using the developer's API token, please change your token below.
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
