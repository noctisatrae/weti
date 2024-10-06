import { json, LoaderFunctionArgs } from "@remix-run/node";
import { TokenList } from "~/types";

const loader = async ({ params }: LoaderFunctionArgs) => {
  const req = await fetch("https://account.api.cx.metamask.io/networks/1/tokens");
  return json((await req.json()) as TokenList[])
}

export default loader;