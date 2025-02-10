import { Button } from "@nutui/nutui-react"
import { Cell } from "@nutui/nutui-react"
import { useNavigate } from "react-router-dom"
import "./home.less"
const IndexPage = () => {
  const navigete = useNavigate()
  const goToPage = (url: string) => {
    navigete(url)
  }
  return (
    <div className="page-content">
      <Button type="info">nativejs调试页面</Button>
      <div className="router-list">
        <Cell title="demo" onClick={() => { goToPage('/demo') }} />
      </div>
    </div>
  )
}
export default IndexPage