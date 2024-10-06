import { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/react";

const action = async ({ request }: ActionFunctionArgs) => {
  // Need:
  // - [x] chainId
  // - [x] buyToken
  // - [x] sellToken
  // - [x] sellAmount
  // - [x] taker

  if (process.env["OX_KEY"] == null) {
    return json({ error: "Internal server error! (swap apikey)", }, { status: 500 })
  }

  const errors = {}

  const formData = await request.formData();
  const chainId = Number(formData.get("chain"));
  const buyToken = String(formData.get("buyToken"))
  const sellToken = String(formData.get("sellToken"))
  const sellAmount = String(formData.get("sellAmount"))
  const taker = String(formData.get("taker"))

  console.debug({
    chainId,
    buyToken,
    sellToken,
    sellAmount,
    taker
  })

  if (isNaN(chainId)) {
    // @ts-ignore
    errors.chainId = "The chainId must be a valid number!";
  }

  if (!buyToken) {
    // @ts-ignore
    errors.buyToken = "The buyToken was not provided!";
  }

  if (!sellToken) {
    // @ts-ignore
    errors.sellToken = "The sellToken was not provided!";
  }
  
  if (!sellAmount) {
    // @ts-ignore
    errors.sellAmount = "The sellAmount must be a valid positive number!";
  }

  if (!taker) {
    // @ts-ignore
    errors.taker = "The taker was not provided!";
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors }, { status: 400 });
  }

  const searchParams = new URLSearchParams({
    chainId: `${chainId}`,
    sellToken: sellToken,
    buyToken: buyToken,
    sellAmount: sellAmount,
    taker: taker
  });
  
  const res = await fetch(
    `https://api.0x.org/swap/permit2/quote?${searchParams.toString()}`,
    {
      headers: {
        "0x-api-key": process.env["OX_KEY"] as string,
        "0x-version": "v2",
      },
    }
  );
  
  return json(await res.json())
}

export default action;