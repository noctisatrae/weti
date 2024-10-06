# weti - how to run
At the moment, I haven't put the Remix App (`weti-app`) in a docker container so you'll need to run it manually after starting the compose.

```toml
# create an env file at the root of the project
# change all of this!
# also: put the same values in weti_api/drizzle.config.ts
# due to a bug with drizzle ORM, env variable can't be read...
WETI_API_TOKEN=helloworld
WETI_API_PORT=8000
WETI_DB_PASSWORD=jesuisunecarotte

COIN_GECKO=something_here

0X_KEY=something_here

# moralis node format is:
#  https://site1.moralis-nodes.com/{chain}/{api_key}
# alchemy node format is:
#  https://{chain}-mainnet.g.alchemy.com/v2/{api_key}
MORALIS_1=something_here
MORALIS_8453=something_here
ALCHEMY_1=something_here
ALCHEMY_8453=something_here
```

## Step 1
```bash
# in the root
docker-compose build && docker-compose up -d 
```

## Step 2
```bash
bun i && OX_KEY=YOUR_KEY_HERE bun run dev
```

This is widely unready ahahah, sorry for the rough edges and send me a message if this does not work