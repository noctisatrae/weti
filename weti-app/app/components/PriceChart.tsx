const PriceChart = (props: { id: string }) => {
  return <>
    { /* @ts-ignore */ }
    <gecko-coin-price-chart-widget locale="en" dark-mode="true" transparent-background="true" coin-id={props.id} initial-currency="usd"></gecko-coin-price-chart-widget>
  </>
}

export default PriceChart