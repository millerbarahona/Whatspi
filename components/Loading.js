import { css } from "@emotion/react";
import HashLoader from "react-spinners/HashLoader";
const Loading = () => {

  const override = css`  
  height: 400px;
  width: 20px;
  display: block;
  `
  return (
    <div>
      <center style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
        <div>
          <img
            src="https://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png"
            alt=""
            height={200}
            style={{ marginBottom: 10 }}
          />
          <HashLoader color={"#6CEE99"} css={override} size={200} />

        </div>
      </center>

    </div>
  )
}

export default Loading
