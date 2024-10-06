import { json, LoaderFunctionArgs } from "@remix-run/node";
import { TokenList } from "~/types";

const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const chainId = url.searchParams.get("chainId") || "1"; // Default to Ethereum mainnet if not provided

  const req = await fetch(`https://account.api.cx.metamask.io/networks/${chainId}/tokens`);
  try {
    const res = await req.json()
    return json(res as TokenList[])
  } catch (e) {
    return json({ error: e }, { status: 500 })
  }
}

export const shouldRevalidate = () => {
  return false;
} 

export default loader;