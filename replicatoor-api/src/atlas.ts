import kecack256 from "keccak256";
import nodeFetch from "node-fetch";

let domain = "http://module-atlas.default.svc.cluster.local";
if (process.env.DEVELOPMENT === "TRUE" || process.env.DEVELOPMENT) {
  domain = "https://api.modulenft.xyz";
  // domain = "http://localhost:8000"; // //
}

domain = "https://3mhz.modulenft.xyz"; ///

class Client {
  public async query(
    query: string,
    values: string[] = [],
    timeout = 1000
  ): Promise<any> {
    try {
      console.log(
        JSON.stringify({
          query,
          values,
          id: kecack256(query + values.join("")).toString("hex"),
          signature: "module-atlas",
        })
      );
      const response = await nodeFetch(`${domain}/api/v2/atlas/query`, {
        method: "POST",
        timeout: timeout,
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "931028357360009287",
        },
        body: JSON.stringify({
          query,
          values,
          id: kecack256(query + values.join("")).toString("hex"),
          signature: "module-atlas",
        }),
      });

      const result = await response.json();
      console.log(result);
      return result;
    } catch (e) {
      console.log(e);
      return {
        error: true,
        errorText: e,
      };
    }
  }
}

export default new Client();
