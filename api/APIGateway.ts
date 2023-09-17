import { StockAdapter } from "./Adapter";
import { SymbolChartEntry } from "../redux/SymbolChartSlice";
import { FinnhubAPI } from "./Finnhub";

class APIGateway extends StockAdapter {
  provider: StockAdapter;
  constructor(provider: StockAdapter) {
    super();
    this.provider = provider;
  }

  changeToken(token: string): void {
    this.provider.changeToken(token);
  }

  initSocket(): void {
    this.provider.initSocket();
  }

  subscribeToSymbol(symbol: string): void {
    this.provider.subscribeToSymbol(symbol);
  }

  unSubscribeToSymbol(symbol: string): void {
    this.provider.unSubscribeToSymbol(symbol);
  }

  onSocketMessage(callback: (event: any) => void): void {
    this.provider.onSocketMessage(callback);
  }

  closeSocket(): void {
    this.provider.closeSocket();
  }

  async getChartForSymbol(symbol: string): Promise<SymbolChartEntry> {
    return this.provider.getChartForSymbol(symbol);
  }
}
export const finn = new FinnhubAPI("ck33o1hr01qp0k7690ugck33o1hr01qp0k7690v0");
finn.initSocket();

const gateway = new APIGateway(finn);

export default gateway;
