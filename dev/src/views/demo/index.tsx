import { Button, Radio, Form } from "@nutui/nutui-react"
import { Input } from '@nutui/nutui-react'
import { useState } from "react"
import './index.less'
import NativeJs from '../../../../src/index'

const PageIndex = () => {
  const [shareString, setShareString] = useState('') // 自定义标题
  const [shareDesc, setShareDesc] = useState('') // 自定义分享描述
  const [shareUrl, setShareUrl] = useState('') // 自定义分享url
  const [shareType, setShareType] = useState('wechatFriend') // 自定义分享渠道
  const [singleImg, setSingleImg] = useState('') // 自定义分享base64图片



  const [shareTypeValue] = useState('1')
  const customDoShare = () => {
    const params = {
      shareString: shareString,
      shareDesc: shareDesc,
      shareUrl: shareUrl,
      shareType: shareType,
      singleImg: encodeURIComponent(singleImg)
    }
    NativeJs.doShare(params, () => { })
  }

  return (
    <div className="page-content">
      <section>
        <Form labelPosition="right">
          <Form.Item
            align="center"
            label="标题"
            name="shareString"
          >
            <Input
              className="nut-input-text"
              placeholder="请输入分享标题"
              defaultValue={shareString}
              onChange={(val) => {
                setShareString(val)
              }}
              type="text"
            />
          </Form.Item>
          <Form.Item
            align="center"
            label="描述"
            name="shareDesc"
          >
            <Input
              className="nut-input-text"
              placeholder="请输入分享描述"
              type="text"
              defaultValue={shareDesc}
              onChange={(val) => {
                setShareDesc(val)
              }}
            />
          </Form.Item>
          <Form.Item
            align="center"
            label="分享链接"
            name="shareUrl"
          >
            <Input
              className="nut-input-text"
              placeholder="请输入分享链接"
              type="text"
              defaultValue={shareUrl}
              onChange={(val) => {
                setShareUrl(val)
              }}
            />
          </Form.Item>
          <Form.Item
            align="center"
            label="图片Base64"
            name="singleImg"
          >
            <Input
              className="nut-input-text"
              placeholder="图片base64"
              type="text"
              value={singleImg}
              defaultValue={singleImg}
              onChange={(val) => {
                setSingleImg(val)
              }}
            />
          </Form.Item>
          <Form.Item
            align="center"
            label="分享类型"
            name="shareType"
          >
            <Radio.Group defaultValue={shareType} onChange={(e) => setShareType(e as string)} value={shareTypeValue} className="radio-list">
              <Radio shape="button" value="wechatFriend">朋友圈</Radio>
              <Radio shape="button" value="wechatMoment">聊天框</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>

        <div className="btn-list">
          <Button type="info" onClick={() => customDoShare()}>自定义分享</Button>
        </div>
      </section>
    </div>
  )
}
export default PageIndex