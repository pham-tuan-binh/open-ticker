import { SymbolChartEntry } from "../redux/SymbolChartSlice";

export abstract class StockAdapter {
  constructor() {}
  abstract changeToken(token: string): void;
  abstract initSocket(): void;

  abstract subscribeToSymbol(symbol: string): void;

  abstract unSubscribeToSymbol(symbol: string): void;

  abstract onSocketMessage(callback: (event: any) => void): void;

  abstract closeSocket(): void;

  abstract getChartForSymbol(symbol: string): Promise<SymbolChartEntry>;
}
