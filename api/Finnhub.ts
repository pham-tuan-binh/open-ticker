import { Socket } from "dgram";
import { OHLCTEntry, SymbolChartEntry } from "../redux/SymbolChartSlice";
import { StockAdapter } from "./Adapter";

interface FinnhubChartEntry {
  o: Array<number>;
  h: Array<number>;
  l: Array<number>;
  c: Array<number>;
  t: Array<number>;
  v: Array<number>;
  s: string;
}
// TODO: Implement Socket API
export class FinnhubAPI extends StockAdapter {
  token: string;
  socket: WebSocket | undefined;
  constructor(token: string) {
    super();
    this.token = token;
    this.socket = undefined;
  }

  changeToken(token: string) {
    this.token = token;
  }

  initSocket() {
    this.socket = new WebSocket(`wss://ws.finnhub.io?token=${this.token}`);
    console.log(this.socket);
  }

  subscribeToSymbol(symbol: string) {
    if (this.socket == undefined) {
      return;
    }

    if (this.socket.readyState == 1) {
      this.socket.send(JSON.stringify({ type: "subscribe", symbol: symbol }));
    }
  }

  unSubscribeToSymbol(symbol: string) {
    if (this.socket == undefined) {
      return;
    }
    if (this.socket.readyState == 1) {
      this.socket.send(JSON.stringify({ type: "subscribe", symbol: symbol }));
    }
  }

  onSocketMessage(callback: (event: any) => void) {
    if (this.socket == undefined) {
      return;
    }

    if (this.socket.readyState == 1) {
      this.socket.addEventListener("message", callback);
    }
  }

  closeSocket() {
    if (this.socket == undefined) {
      return;
    }
    if (this.socket.readyState == 1) {
      this.socket.close();
    }
  }

  processData(chart: FinnhubChartEntry, quantity: number): Array<OHLCTEntry> {
    let processedData: Array<OHLCTEntry> = [];

    if (chart.c == undefined) {
      return processedData;
    }

    for (let i = 0; i <= chart.c.length; i++) {
      if (!chart.o[i]) {
        continue;
      }

      processedData.push({
        open: chart.o[i] * quantity,
        high: chart.h[i] * quantity,
        low: chart.l[i] * quantity,
        close: chart.c[i] * quantity,
        time: chart.t[i],
      });
    }

    return processedData;
  }

  async getChartForSymbol(symbol: string): Promise<SymbolChartEntry> {
    console.log("token" + this.token);
    const today = new Date();
    const todayEpoch = Math.round(today.getTime() / 1000);
    const aYearAgoEpoch = todayEpoch - 60 * 60 * 24 * 365;
    const response = await fetch(
      `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${aYearAgoEpoch}&to=${todayEpoch}&token=${this.token}`
    );

    const data = await response.json();

    const processedData = this.processData(data, 1);

    return { name: symbol, chart: processedData };
  }
}

export default FinnhubAPI;
