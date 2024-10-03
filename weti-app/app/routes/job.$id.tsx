import { useParams } from "@remix-run/react"

const Job = () => {
  const params = useParams()

  return <p>{params["id"]}</p>
}

export default Job